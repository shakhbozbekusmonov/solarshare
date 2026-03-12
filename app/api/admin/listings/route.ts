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
	const search = searchParams.get('search')

	const where: Record<string, unknown> = {}
	if (status) where.status = status
	if (search) {
		where.OR = [
			{ title: { contains: search, mode: 'insensitive' } },
			{ location: { contains: search, mode: 'insensitive' } },
		]
	}

	const [listings, total] = await Promise.all([
		prisma.listing.findMany({
			where,
			include: {
				seller: { select: { id: true, name: true, email: true } },
				_count: { select: { orders: true } },
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.listing.count({ where }),
	])

	return NextResponse.json({
		listings,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	})
}

export async function PATCH(request: Request) {
	const session = await auth()
	if (!session?.user || session.user.role !== 'ADMIN') {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	const body = await request.json()
	const { listingId, action } = body as {
		listingId: string
		action: 'approve' | 'reject' | 'cancel'
	}

	if (!listingId || !action) {
		return NextResponse.json(
			{ error: 'listingId va action talab qilinadi' },
			{ status: 400 },
		)
	}

	const listing = await prisma.listing.findUnique({
		where: { id: listingId },
	})
	if (!listing) {
		return NextResponse.json({ error: 'Listing topilmadi' }, { status: 404 })
	}

	const statusMap: Record<string, string> = {
		approve: 'ACTIVE',
		reject: 'CANCELLED',
		cancel: 'CANCELLED',
	}

	const newStatus = statusMap[action]
	if (!newStatus) {
		return NextResponse.json({ error: "Noto'g'ri action" }, { status: 400 })
	}

	await prisma.listing.update({
		where: { id: listingId },
		data: { status: newStatus as 'ACTIVE' | 'PENDING' | 'SOLD' | 'CANCELLED' },
	})

	return NextResponse.json({
		message: `Listing ${action === 'approve' ? 'tasdiqlandi' : 'rad etildi'}`,
	})
}
