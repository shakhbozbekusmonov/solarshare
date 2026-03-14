import {
	type ClickParams,
	completeOrder,
	verifyClickSign,
} from '@/lib/payments'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const body = (await request.json()) as ClickParams

	if (!verifyClickSign(body)) {
		return NextResponse.json({
			error: -1,
			error_note: 'SIGN CHECK FAILED!',
		})
	}

	const orderId = body.merchant_trans_id
	const action = parseInt(body.action, 10)

	// action=0 -> Prepare, action=1 -> Complete
	if (action === 0) {
		const order = await prisma.order.findUnique({
			where: { id: orderId },
		})

		if (!order) {
			return NextResponse.json({
				error: -5,
				error_note: 'Order not found',
			})
		}

		if (order.status !== 'PENDING') {
			return NextResponse.json({
				error: -4,
				error_note: 'Order already processed',
			})
		}

		const amount = Number(order.totalPrice)
		if (Math.abs(amount - parseFloat(body.amount)) > 0.01) {
			return NextResponse.json({
				error: -2,
				error_note: 'Incorrect amount',
			})
		}

		const tx = await prisma.transaction.create({
			data: {
				orderId,
				amount: order.totalPrice,
				currency: 'UZS',
				status: 'PENDING',
				providerResponse: {
					click_trans_id: body.click_trans_id,
					service_id: body.service_id,
				},
			},
		})

		await prisma.order.update({
			where: { id: orderId },
			data: {
				paymentId: body.click_trans_id,
				paymentMethod: 'CLICK',
			},
		})

		return NextResponse.json({
			click_trans_id: body.click_trans_id,
			merchant_trans_id: orderId,
			merchant_prepare_id: tx.id,
			error: 0,
			error_note: 'Success',
		})
	}

	if (action === 1) {
		const prepareId = body.merchant_prepare_id
		if (!prepareId) {
			return NextResponse.json({
				error: -6,
				error_note: 'Missing prepare ID',
			})
		}

		const tx = await prisma.transaction.findUnique({
			where: { id: prepareId },
			include: { order: true },
		})

		if (!tx) {
			return NextResponse.json({
				error: -6,
				error_note: 'Transaction not found',
			})
		}

		const hasError = parseInt(body.error, 10) < 0

		if (hasError) {
			await prisma.$transaction([
				prisma.transaction.update({
					where: { id: tx.id },
					data: {
						status: 'FAILED',
						providerResponse: {
							...(tx.providerResponse as Record<string, unknown>),
							error: body.error,
							error_note: body.error_note,
						},
					},
				}),
				prisma.order.update({
					where: { id: tx.orderId },
					data: { status: 'CANCELLED' },
				}),
			])

			return NextResponse.json({
				click_trans_id: body.click_trans_id,
				merchant_trans_id: orderId,
				merchant_prepare_id: prepareId,
				error: 0,
				error_note: 'Success',
			})
		}

		// Marks transaction SUCCESS, order PAID, decrements listing.availableKwh
		await completeOrder(tx.id)

		return NextResponse.json({
			click_trans_id: body.click_trans_id,
			merchant_trans_id: orderId,
			merchant_prepare_id: prepareId,
			error: 0,
			error_note: 'Success',
		})
	}

	return NextResponse.json({
		error: -3,
		error_note: 'Action not found',
	})
}
