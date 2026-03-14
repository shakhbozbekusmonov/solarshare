import { completeOrder, verifyPaymeAuth } from '@/lib/payments'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type PaymeMethod =
	| 'CheckPerformTransaction'
	| 'CreateTransaction'
	| 'PerformTransaction'
	| 'CancelTransaction'
	| 'CheckTransaction'

interface PaymeRequest {
	method: PaymeMethod
	params: {
		id?: string
		amount?: number
		account?: { order_id?: string }
		reason?: number
		time?: number
	}
	id: number
}

export async function POST(request: Request) {
	const authHeader = request.headers.get('authorization')
	if (!verifyPaymeAuth(authHeader)) {
		return NextResponse.json(
			{ error: { code: -32504, message: 'Unauthorized' }, id: 0 },
			{ status: 200 },
		)
	}

	const body = (await request.json()) as PaymeRequest
	const { method, params, id } = body

	switch (method) {
		case 'CheckPerformTransaction': {
			const orderId = params.account?.order_id
			if (!orderId) {
				return NextResponse.json({
					error: { code: -31050, message: 'Order not found' },
					id,
				})
			}
			const order = await prisma.order.findUnique({ where: { id: orderId } })
			if (!order || order.status !== 'PENDING') {
				return NextResponse.json({
					error: { code: -31050, message: 'Order not found or not pending' },
					id,
				})
			}
			const amountInTiyin = Number(order.totalPrice) * 100
			if (params.amount !== amountInTiyin) {
				return NextResponse.json({
					error: { code: -31001, message: 'Incorrect amount' },
					id,
				})
			}
			return NextResponse.json({ result: { allow: true }, id })
		}

		case 'CreateTransaction': {
			const orderId = params.account?.order_id
			if (!orderId) {
				return NextResponse.json({
					error: { code: -31050, message: 'Order not found' },
					id,
				})
			}
			const order = await prisma.order.findUnique({
				where: { id: orderId },
				include: { transactions: true },
			})
			if (!order || order.status !== 'PENDING') {
				return NextResponse.json({
					error: { code: -31050, message: 'Order not found or not pending' },
					id,
				})
			}

			const existingTx = order.transactions.find(
				t =>
					(t.providerResponse as Record<string, unknown>)?.payme_id ===
					params.id,
			)

			if (existingTx) {
				return NextResponse.json({
					result: {
						transaction: existingTx.id,
						state: 1,
						create_time: existingTx.createdAt.getTime(),
					},
					id,
				})
			}

			const tx = await prisma.transaction.create({
				data: {
					orderId,
					amount: order.totalPrice,
					currency: 'UZS',
					status: 'PENDING',
					providerResponse: { payme_id: params.id, time: params.time },
				},
			})

			await prisma.order.update({
				where: { id: orderId },
				data: { paymentId: params.id, paymentMethod: 'PAYME' },
			})

			return NextResponse.json({
				result: {
					transaction: tx.id,
					state: 1,
					create_time: tx.createdAt.getTime(),
				},
				id,
			})
		}

		case 'PerformTransaction': {
			const tx = await prisma.transaction.findFirst({
				where: {
					providerResponse: { path: ['payme_id'], equals: params.id },
				},
				include: { order: true },
			})
			if (!tx) {
				return NextResponse.json({
					error: { code: -31003, message: 'Transaction not found' },
					id,
				})
			}

			if (tx.status === 'SUCCESS') {
				return NextResponse.json({
					result: {
						transaction: tx.id,
						state: 2,
						perform_time: tx.createdAt.getTime(),
					},
					id,
				})
			}

			// Marks transaction SUCCESS, order PAID, decrements listing.availableKwh
			await completeOrder(tx.id)

			return NextResponse.json({
				result: {
					transaction: tx.id,
					state: 2,
					perform_time: Date.now(),
				},
				id,
			})
		}

		case 'CancelTransaction': {
			const tx = await prisma.transaction.findFirst({
				where: {
					providerResponse: { path: ['payme_id'], equals: params.id },
				},
				include: {
					order: { select: { requestedKwh: true, listingId: true } },
				},
			})
			if (!tx) {
				return NextResponse.json({
					error: { code: -31003, message: 'Transaction not found' },
					id,
				})
			}

			await prisma.$transaction(async db => {
				await db.transaction.update({
					where: { id: tx.id },
					data: {
						status: 'FAILED',
						providerResponse: {
							...(tx.providerResponse as Record<string, unknown>),
							cancel_reason: params.reason,
						},
					},
				})
				await db.order.update({
					where: { id: tx.orderId },
					data: { status: 'CANCELLED' },
				})
				// Restore reserved kWh back to the listing
				await db.listing.update({
					where: { id: tx.order.listingId },
					data: { availableKwh: { increment: tx.order.requestedKwh } },
				})
				await db.listing.updateMany({
					where: { id: tx.order.listingId, status: 'SOLD' },
					data: { status: 'ACTIVE' },
				})
			})

			return NextResponse.json({
				result: {
					transaction: tx.id,
					state: -1,
					cancel_time: Date.now(),
				},
				id,
			})
		}

		case 'CheckTransaction': {
			const tx = await prisma.transaction.findFirst({
				where: {
					providerResponse: { path: ['payme_id'], equals: params.id },
				},
			})
			if (!tx) {
				return NextResponse.json({
					error: { code: -31003, message: 'Transaction not found' },
					id,
				})
			}

			const stateMap: Record<string, number> = {
				PENDING: 1,
				SUCCESS: 2,
				FAILED: -1,
			}

			return NextResponse.json({
				result: {
					transaction: tx.id,
					state: stateMap[tx.status],
					create_time: tx.createdAt.getTime(),
				},
				id,
			})
		}

		default:
			return NextResponse.json({
				error: { code: -32601, message: 'Method not found' },
				id,
			})
	}
}
