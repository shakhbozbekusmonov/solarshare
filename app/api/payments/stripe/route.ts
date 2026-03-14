import { completeOrder, verifyStripeSignature } from '@/lib/payments'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

			// Create transaction then use completeOrder to also decrement listing.availableKwh
			const newTx = await prisma.transaction.create({
				data: {
					orderId,
					amount: order.totalPrice,
					currency: 'USD',
					status: 'PENDING',
					providerResponse: {
						stripe_event: event.type,
						payment_intent_id: event.data.object.id,
					},
				},
			})
			await prisma.order.update({
				where: { id: orderId },
				data: {
					paymentId: event.data.object.id,
					paymentMethod: 'STRIPE',
				},
			})
			// Marks transaction SUCCESS, order PAID, decrements listing.availableKwh
			await completeOrder(newTx.id)

			return NextResponse.json({ received: true })
		}

		case 'payment_intent.payment_failed': {
			const orderId = event.data.object.metadata?.order_id
			if (!orderId) {
				return NextResponse.json({ received: true })
			}

			const order = await prisma.order.findUnique({
				where: { id: orderId },
				select: {
					totalPrice: true,
					status: true,
					requestedKwh: true,
					listingId: true,
				},
			})

			if (!order || order.status !== 'PENDING') {
				return NextResponse.json({ received: true })
			}

			await prisma.$transaction(async db => {
				await db.transaction.create({
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
				})
				await db.order.update({
					where: { id: orderId },
					data: { status: 'CANCELLED' },
				})
				// Restore reserved kWh back to the listing
				await db.listing.update({
					where: { id: order.listingId },
					data: { availableKwh: { increment: order.requestedKwh } },
				})
				await db.listing.updateMany({
					where: { id: order.listingId, status: 'SOLD' },
					data: { status: 'ACTIVE' },
				})
			})

			return NextResponse.json({ received: true })
		}

		default:
			return NextResponse.json({ received: true })
	}
}
