import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * PATCH /api/orders/:id/cancel
 * Allows a buyer to cancel their own PENDING order.
 * Restores reserved kWh back to the listing atomically.
 */
export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth()
	if (!session?.user) {
		return NextResponse.json(
			{ error: 'Avtorizatsiya talab qilinadi' },
			{ status: 401 },
		)
	}

	const { id } = await params

	const order = await prisma.order.findUnique({
		where: { id },
		select: {
			id: true,
			buyerId: true,
			status: true,
			requestedKwh: true,
			listingId: true,
		},
	})

	if (!order) {
		return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 })
	}

	// Only the buyer or admin can cancel
	if (order.buyerId !== session.user.id && session.user.role !== 'ADMIN') {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	if (order.status !== 'PENDING') {
		return NextResponse.json(
			{ error: 'Faqat kutilayotgan buyurtmalarni bekor qilish mumkin' },
			{ status: 400 },
		)
	}

	await prisma.$transaction(async db => {
		await db.order.update({
			where: { id },
			data: { status: 'CANCELLED' },
		})

		// Restore reserved kWh back to the listing
		await db.listing.update({
			where: { id: order.listingId },
			data: { availableKwh: { increment: order.requestedKwh } },
		})

		// Reactivate listing if it was depleted by this reservation
		await db.listing.updateMany({
			where: { id: order.listingId, status: 'SOLD' },
			data: { status: 'ACTIVE' },
		})

		// Mark any pending transactions as FAILED
		await db.transaction.updateMany({
			where: { orderId: id, status: 'PENDING' },
			data: { status: 'FAILED' },
		})
	})

	return NextResponse.json({ message: 'Buyurtma bekor qilindi' })
}
