import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const session = await auth()
	if (!session?.user || session.user.role !== 'ADMIN') {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	const { searchParams } = new URL(request.url)
	const page = Math.max(1, Number(searchParams.get('page')) || 1)
	const limit = Math.min(
		50,
		Math.max(1, Number(searchParams.get('limit')) || 20),
	)
	const status = searchParams.get('status')
	const dateFrom = searchParams.get('dateFrom')
	const dateTo = searchParams.get('dateTo')

	const where: Record<string, unknown> = {}
	if (status) where.status = status
	if (dateFrom || dateTo) {
		where.createdAt = {}
		if (dateFrom)
			(where.createdAt as Record<string, unknown>).gte = new Date(dateFrom)
		if (dateTo)
			(where.createdAt as Record<string, unknown>).lte = new Date(dateTo)
	}

	const [transactions, total] = await Promise.all([
		prisma.transaction.findMany({
			where,
			include: {
				order: {
					select: {
						id: true,
						requestedKwh: true,
						totalPrice: true,
						paymentMethod: true,
						status: true,
						buyer: { select: { id: true, name: true, email: true } },
						listing: {
							select: {
								id: true,
								title: true,
								seller: { select: { id: true, name: true, email: true } },
							},
						},
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.transaction.count({ where }),
	])

	return NextResponse.json({
		transactions,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	})
}
