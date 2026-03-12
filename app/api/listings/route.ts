import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { listingSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const page = Math.max(1, Number(searchParams.get('page')) || 1)
	const limit = Math.min(
		50,
		Math.max(1, Number(searchParams.get('limit')) || 20),
	)
	const status = searchParams.get('status')
	const sellerId = searchParams.get('sellerId')
	const search = searchParams.get('search')
	const minPrice = searchParams.get('minPrice')
	const maxPrice = searchParams.get('maxPrice')
	const currency = searchParams.get('currency')
	const sortBy = searchParams.get('sortBy') || 'createdAt'
	const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

	const where: Record<string, unknown> = {}

	if (status) where.status = status
	if (currency) where.currency = currency

	// Handle sellerId=me (current user's listings)
	if (sellerId === 'me') {
		const session = await auth()
		if (session?.user) where.sellerId = session.user.id
	} else if (sellerId) {
		where.sellerId = sellerId
	}

	if (search) {
		where.OR = [
			{ title: { contains: search, mode: 'insensitive' } },
			{ description: { contains: search, mode: 'insensitive' } },
			{ location: { contains: search, mode: 'insensitive' } },
		]
	}

	if (minPrice || maxPrice) {
		where.pricePerKwh = {}
		if (minPrice)
			(where.pricePerKwh as Record<string, unknown>).gte = Number(minPrice)
		if (maxPrice)
			(where.pricePerKwh as Record<string, unknown>).lte = Number(maxPrice)
	}

	const allowedSortFields = [
		'createdAt',
		'pricePerKwh',
		'availableKwh',
		'totalKwh',
	]
	const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'

	const [listings, total] = await Promise.all([
		prisma.listing.findMany({
			where,
			include: { seller: { select: { id: true, name: true, email: true } } },
			orderBy: { [orderField]: sortOrder },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.listing.count({ where }),
	])

	return NextResponse.json({
		listings,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	})
}

export async function POST(request: Request) {
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

	const body = await request.json()
	const parsed = listingSchema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Noto'g'ri ma'lumotlar", details: parsed.error.issues },
			{ status: 400 },
		)
	}

	const {
		title,
		description,
		totalKwh,
		pricePerKwh,
		currency,
		period,
		location,
	} = parsed.data

	const listing = await prisma.listing.create({
		data: {
			sellerId: session.user.id,
			title,
			description,
			totalKwh,
			availableKwh: totalKwh,
			pricePerKwh,
			currency,
			period,
			location,
			status: 'ACTIVE',
		},
		include: { seller: { select: { id: true, name: true, email: true } } },
	})

	return NextResponse.json(listing, { status: 201 })
}
