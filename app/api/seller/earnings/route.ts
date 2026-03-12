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

	const transactions = await prisma.transaction.findMany({
		where: {
			order: { listing: { sellerId } },
			status: 'SUCCESS',
		},
		include: {
			order: {
				select: {
					requestedKwh: true,
					totalPrice: true,
					paymentMethod: true,
					listing: { select: { title: true, currency: true } },
					buyer: { select: { name: true } },
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	})

	// Group by month for chart data
	const monthlyMap = new Map<
		string,
		{ revenue: number; kwh: number; count: number }
	>()

	for (const tx of transactions) {
		const month = tx.createdAt.toISOString().slice(0, 7) // YYYY-MM
		const existing = monthlyMap.get(month) ?? { revenue: 0, kwh: 0, count: 0 }
		existing.revenue += Number(tx.amount)
		existing.kwh += Number(tx.order.requestedKwh)
		existing.count += 1
		monthlyMap.set(month, existing)
	}

	const monthlyEarnings = Array.from(monthlyMap.entries())
		.map(([month, data]) => ({ month, ...data }))
		.sort((a, b) => a.month.localeCompare(b.month))
		.slice(-12) // last 12 months

	const totalEarnings = transactions.reduce(
		(sum: number, tx: (typeof transactions)[number]) => sum + Number(tx.amount),
		0,
	)
	const totalKwhSold = transactions.reduce(
		(sum: number, tx: (typeof transactions)[number]) =>
			sum + Number(tx.order.requestedKwh),
		0,
	)

	return NextResponse.json({
		totalEarnings,
		totalKwhSold,
		totalTransactions: transactions.length,
		monthlyEarnings,
		transactions: transactions.slice(0, 50),
	})
}
