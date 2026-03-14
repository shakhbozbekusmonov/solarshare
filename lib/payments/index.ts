/**
 * lib/payments/index.ts
 * Shared payment utilities for Payme, Click, and Stripe integrations.
 */

import { prisma } from '@/lib/prisma'
import { createHash, createHmac, timingSafeEqual } from 'crypto'

// ─── Payme ─────────────────────────────────────────────────────────────────

/**
 * Validates `Basic <base64(Payme:PAYME_KEY)>` authorization header.
 */
export function verifyPaymeAuth(authHeader: string | null): boolean {
	if (!authHeader?.startsWith('Basic ')) return false
	const decoded = Buffer.from(authHeader.slice(6), 'base64').toString()
	const [, password] = decoded.split(':')
	return !!password && password === (process.env.PAYME_KEY ?? '')
}

// ─── Click ─────────────────────────────────────────────────────────────────

export interface ClickParams {
	click_trans_id: string
	service_id: string
	merchant_trans_id: string
	merchant_prepare_id?: string
	amount: string
	action: string
	sign_time: string
	sign_string: string
	error: string
	error_note: string
}

/**
 * Verifies the MD5 signature sent by Click.
 */
export function verifyClickSign(params: ClickParams): boolean {
	const secret = process.env.CLICK_SECRET_KEY ?? ''
	const signString = [
		params.click_trans_id,
		params.service_id,
		secret,
		params.merchant_trans_id,
		params.amount,
		params.action,
		params.sign_time,
	].join('')
	const hash = createHash('md5').update(signString).digest('hex')
	return hash === params.sign_string
}

// ─── Stripe ────────────────────────────────────────────────────────────────

/**
 * Verifies the `Stripe-Signature` header using HMAC-SHA256.
 */
export function verifyStripeSignature(
	payload: string,
	sigHeader: string,
): boolean {
	const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''
	if (!secret) return false

	const parts = sigHeader.split(',').reduce(
		(acc, part) => {
			const [key, val] = part.split('=')
			if (key === 't') acc.timestamp = val
			if (key === 'v1') acc.signatures.push(val)
			return acc
		},
		{ timestamp: '', signatures: [] as string[] },
	)

	if (!parts.timestamp || parts.signatures.length === 0) return false

	const signedPayload = `${parts.timestamp}.${payload}`
	const expected = createHmac('sha256', secret)
		.update(signedPayload)
		.digest('hex')

	return parts.signatures.some(sig => {
		try {
			return timingSafeEqual(
				Buffer.from(expected, 'hex'),
				Buffer.from(sig, 'hex'),
			)
		} catch {
			return false
		}
	})
}

// ─── Shared order completion ────────────────────────────────────────────────

/**
 * Atomically marks a transaction as SUCCESS, order as PAID,
 * and decrements listing.availableKwh by order.requestedKwh.
 *
 * Sprint 4 requirement: Order → PAID → Listing.availableKwh kamaytirish → Transaction log
 */
export async function completeOrder(transactionId: string): Promise<void> {
	await prisma.$transaction(async db => {
		const transaction = await db.transaction.findUnique({
			where: { id: transactionId },
			include: {
				order: {
					include: { listing: true },
				},
			},
		})

		if (!transaction || transaction.status === 'SUCCESS') return

		const requestedKwh = Number(transaction.order.requestedKwh)
		const availableKwh = Number(transaction.order.listing.availableKwh)
		const nextAvailableKwh = Math.max(0, availableKwh - requestedKwh)

		await db.transaction.update({
			where: { id: transactionId },
			data: { status: 'SUCCESS' },
		})

		await db.order.update({
			where: { id: transaction.order.id },
			data: { status: 'PAID' },
		})

		await db.listing.update({
			where: { id: transaction.order.listingId },
			data: {
				availableKwh: nextAvailableKwh,
				status:
					nextAvailableKwh <= 0 ? 'SOLD' : transaction.order.listing.status,
			},
		})
	})
}

/**
 * Atomically marks a transaction as FAILED and order as CANCELLED.
 */
export async function cancelOrder(transactionId: string): Promise<void> {
	const tx = await prisma.transaction.findUnique({
		where: { id: transactionId },
	})

	if (!tx || tx.status === 'FAILED') return

	await prisma.$transaction([
		prisma.transaction.update({
			where: { id: transactionId },
			data: { status: 'FAILED' },
		}),
		prisma.order.update({
			where: { id: tx.orderId },
			data: { status: 'CANCELLED' },
		}),
	])
}
