import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await auth()
	if (!session?.user || session.user.role !== 'ADMIN') {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	const [
		totalUsers,
		totalListings,
		totalOrders,
		totalTransactions,
		usersByRole,
		ordersByStatus,
		recentUsers,
		monthlyRevenue,
	] = await Promise.all([
		prisma.user.count(),
		prisma.listing.count(),
		prisma.order.count(),
		prisma.transaction.aggregate({
			where: { status: 'SUCCESS' },
			_sum: { amount: true },
			_count: true,
		}),
		prisma.user.groupBy({
			by: ['role'],
			_count: true,
		}),
		prisma.order.groupBy({
			by: ['status'],
			_count: true,
		}),
		prisma.user.findMany({
			orderBy: { createdAt: 'desc' },
			take: 10,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		}),
		prisma.$queryRaw`
			SELECT 
				TO_CHAR("createdAt", 'YYYY-MM') as month,
				COUNT(*)::int as count,
				COALESCE(SUM("amount"), 0)::float as revenue
			FROM transactions
			WHERE status = 'SUCCESS'
			GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
			ORDER BY month DESC
			LIMIT 12
		` as Promise<Array<{ month: string; count: number; revenue: number }>>,
	])

	// Monthly new users (last 6 months)
	const monthlyUsers = (await prisma.$queryRaw`
		SELECT 
			TO_CHAR("createdAt", 'YYYY-MM') as month,
			COUNT(*)::int as count
		FROM users
		GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
		ORDER BY month DESC
		LIMIT 6
	`) as Array<{ month: string; count: number }>

	return NextResponse.json({
		stats: {
			totalUsers,
			totalListings,
			totalOrders,
			totalRevenue: Number(totalTransactions._sum.amount || 0),
			successfulTransactions: totalTransactions._count,
		},
		usersByRole: usersByRole.map(r => ({ role: r.role, count: r._count })),
		ordersByStatus: ordersByStatus.map(o => ({
			status: o.status,
			count: o._count,
		})),
		recentUsers,
		monthlyRevenue: (
			monthlyRevenue as Array<{ month: string; count: number; revenue: number }>
		).reverse(),
		monthlyUsers: monthlyUsers.reverse(),
	})
}
