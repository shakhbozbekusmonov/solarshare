import { auth } from '@/auth'
import { Prisma } from '@/lib/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { orderSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	const session = await auth()
	if (!session?.user) {
		return NextResponse.json(
			{ error: 'Avtorizatsiya talab qilinadi' },
			{ status: 401 },
		)
	}

	const { searchParams } = new URL(request.url)
	const page = Math.max(1, Number(searchParams.get('page')) || 1)
	const limit = Math.min(
		50,
		Math.max(1, Number(searchParams.get('limit')) || 20),
	)
	const status = searchParams.get('status')

	const where: Prisma.OrderWhereInput = {
		buyerId: session.user.id,
	}

	if (status) where.status = status as Prisma.OrderWhereInput['status']

	const [orders, total] = await Promise.all([
		prisma.order.findMany({
			where,
			include: {
				listing: {
					select: {
						id: true,
						title: true,
						pricePerKwh: true,
						currency: true,
						period: true,
						location: true,
						seller: { select: { id: true, name: true } },
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.order.count({ where }),
	])

	return NextResponse.json({
		orders,
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

	if (!['BUYER', 'BOTH', 'ADMIN'].includes(session.user.role)) {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	const body = await request.json()
	const parsed = orderSchema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Noto'g'ri ma'lumotlar", details: parsed.error.issues },
			{ status: 400 },
		)
	}

	const { listingId, requestedKwh, paymentMethod } = parsed.data

	// Find listing and verify availability
	const listing = await prisma.listing.findUnique({
		where: { id: listingId },
	})

	if (!listing) {
		return NextResponse.json({ error: 'Listing topilmadi' }, { status: 404 })
	}

	if (listing.status !== 'ACTIVE') {
		return NextResponse.json({ error: 'Bu listing faol emas' }, { status: 400 })
	}

	if (listing.sellerId === session.user.id) {
		return NextResponse.json(
			{ error: "O'z listingingizdan sotib ololmaysiz" },
			{ status: 400 },
		)
	}

	const availableKwh = Number(listing.availableKwh)
	if (requestedKwh > availableKwh) {
		return NextResponse.json(
			{
				error: `Yetarli kWh mavjud emas. Mavjud: ${availableKwh} kWh`,
			},
			{ status: 400 },
		)
	}

	const totalPrice = requestedKwh * Number(listing.pricePerKwh)

	// Create order and transaction in a single transaction.
	// Listing availability is decremented only after payment succeeds.
	const order = await prisma.$transaction(async tx => {
		const newOrder = await tx.order.create({
			data: {
				buyerId: session.user.id,
				listingId,
				requestedKwh,
				totalPrice,
				paymentMethod,
				status: 'PENDING',
			},
			include: {
				listing: {
					select: {
						title: true,
						currency: true,
						seller: { select: { name: true } },
					},
				},
			},
		})

		// Create initial transaction record
		await tx.transaction.create({
			data: {
				orderId: newOrder.id,
				amount: totalPrice,
				currency: listing.currency,
				status: 'PENDING',
			},
		})

		return newOrder
	})

	return NextResponse.json({ order }, { status: 201 })
}
