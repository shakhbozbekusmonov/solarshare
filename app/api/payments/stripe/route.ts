import { prisma } from '@/lib/prisma'
import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

function verifyStripeSignature(payload: string, sigHeader: string): boolean {
	if (!STRIPE_WEBHOOK_SECRET) return false

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
	const expected = createHmac('sha256', STRIPE_WEBHOOK_SECRET)
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

interface StripeEvent {
	type: string
	data: {
		object: {
			id: string
			metadata?: { order_id?: string }
			amount?: number
			currency?: string
			status?: string
		}
	}
}

export async function POST(request: Request) {
	const body = await request.text()
	const sigHeader = request.headers.get('stripe-signature')

	if (!sigHeader || !verifyStripeSignature(body, sigHeader)) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
	}

	const event = JSON.parse(body) as StripeEvent

	switch (event.type) {
		case 'checkout.session.completed':
		case 'payment_intent.succeeded': {
			const orderId = event.data.object.metadata?.order_id
			if (!orderId) {
				return NextResponse.json({ received: true })
			}

			const order = await prisma.order.findUnique({
				where: { id: orderId },
				include: { transactions: true },
			})

			if (!order || order.status !== 'PENDING') {
				return NextResponse.json({ received: true })
			}

			const existingTx = order.transactions.find(t => t.status === 'SUCCESS')
			if (existingTx) {
				return NextResponse.json({ received: true })
			}

			await prisma.$transaction([
				prisma.transaction.create({
					data: {
						orderId,
						amount: order.totalPrice,
						currency: 'USD',
						status: 'SUCCESS',
						providerResponse: {
							stripe_event: event.type,
							payment_intent_id: event.data.object.id,
						},
					},
				}),
				prisma.order.update({
					where: { id: orderId },
					data: {
						status: 'PAID',
						paymentId: event.data.object.id,
						paymentMethod: 'STRIPE',
					},
				}),
			])

			return NextResponse.json({ received: true })
		}

		case 'payment_intent.payment_failed': {
			const orderId = event.data.object.metadata?.order_id
			if (!orderId) {
				return NextResponse.json({ received: true })
			}

			const order = await prisma.order.findUnique({
				where: { id: orderId },
			})

			if (!order || order.status !== 'PENDING') {
				return NextResponse.json({ received: true })
			}

			await prisma.$transaction([
				prisma.transaction.create({
					data: {
						orderId,
						amount: order.totalPrice,
						currency: 'USD',
						status: 'FAILED',
						providerResponse: {
							stripe_event: event.type,
							payment_intent_id: event.data.object.id,
						},
					},
				}),
				prisma.order.update({
					where: { id: orderId },
					data: { status: 'CANCELLED' },
				}),
			])

			return NextResponse.json({ received: true })
		}

		default:
			return NextResponse.json({ received: true })
	}
}
