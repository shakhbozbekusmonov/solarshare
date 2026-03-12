import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { listingSchema } from '@/lib/validations'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params
	const listing = await prisma.listing.findUnique({
		where: { id },
		include: {
			seller: { select: { id: true, name: true, email: true } },
			orders: {
				select: {
					id: true,
					status: true,
					requestedKwh: true,
					totalPrice: true,
				},
			},
		},
	})

	if (!listing) {
		return NextResponse.json({ error: 'Listing topilmadi' }, { status: 404 })
	}

	return NextResponse.json(listing)
}

export async function PUT(
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
	const existing = await prisma.listing.findUnique({ where: { id } })

	if (!existing) {
		return NextResponse.json({ error: 'Listing topilmadi' }, { status: 404 })
	}

	if (existing.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
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

	const kwhDiff = totalKwh - Number(existing.totalKwh)
	const newAvailable = Math.max(0, Number(existing.availableKwh) + kwhDiff)

	const listing = await prisma.listing.update({
		where: { id },
		data: {
			title,
			description,
			totalKwh,
			availableKwh: newAvailable,
			pricePerKwh,
			currency,
			period,
			location,
		},
		include: { seller: { select: { id: true, name: true, email: true } } },
	})

	return NextResponse.json(listing)
}

export async function DELETE(
	_request: Request,
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
	const existing = await prisma.listing.findUnique({ where: { id } })

	if (!existing) {
		return NextResponse.json({ error: 'Listing topilmadi' }, { status: 404 })
	}

	if (existing.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	await prisma.listing.update({
		where: { id },
		data: { status: 'CANCELLED' },
	})

	return NextResponse.json({ message: "Listing o'chirildi" })
}
