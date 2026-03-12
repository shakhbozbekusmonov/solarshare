import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await auth()
	if (!session?.user) {
		return NextResponse.json(
			{ error: 'Avtorizatsiya talab qilinadi' },
			{ status: 401 },
		)
	}

	if (!['SELLER', 'BOTH', 'ADMIN'].includes(session.user.role)) {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	const sellerId = session.user.id

	const [totalListings, activeListings, orders, recentTransactions] =
		await Promise.all([
			prisma.listing.count({ where: { sellerId } }),
			prisma.listing.count({ where: { sellerId, status: 'ACTIVE' } }),
			prisma.order.findMany({
				where: { listing: { sellerId } },
				include: {
					listing: { select: { title: true } },
					buyer: { select: { name: true } },
				},
				orderBy: { createdAt: 'desc' },
			}),
			prisma.transaction.findMany({
				where: { order: { listing: { sellerId } } },
				include: {
					order: {
						select: {
							requestedKwh: true,
							listing: { select: { title: true } },
							buyer: { select: { name: true } },
						},
					},
				},
				orderBy: { createdAt: 'desc' },
				take: 10,
			}),
		])

	const completedOrders = orders.filter(
		(o: (typeof orders)[number]) =>
			o.status === 'PAID' || o.status === 'DELIVERED',
	)
	const totalRevenue = completedOrders.reduce(
		(sum: number, o: (typeof orders)[number]) => sum + Number(o.totalPrice),
		0,
	)
	const totalKwhSold = completedOrders.reduce(
		(sum: number, o: (typeof orders)[number]) => sum + Number(o.requestedKwh),
		0,
	)

	return NextResponse.json({
		totalListings,
		activeListings,
		totalOrders: orders.length,
		completedOrders: completedOrders.length,
		totalRevenue,
		totalKwhSold,
		recentTransactions,
	})
}
