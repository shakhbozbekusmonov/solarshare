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
	const search = searchParams.get('search')
	const role = searchParams.get('role')

	const where: Record<string, unknown> = {}

	if (role) where.role = role
	if (search) {
		where.OR = [
			{ name: { contains: search, mode: 'insensitive' } },
			{ email: { contains: search, mode: 'insensitive' } },
		]
	}

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				isBlocked: true,
				isVerified: true,
				createdAt: true,
				_count: { select: { listings: true, orders: true } },
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.user.count({ where }),
	])

	return NextResponse.json({
		users,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	})
}

export async function PATCH(request: Request) {
	const session = await auth()
	if (!session?.user || session.user.role !== 'ADMIN') {
		return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
	}

	const body = await request.json()
	const { userId, action, role } = body as {
		userId: string
		action: 'block' | 'unblock' | 'changeRole'
		role?: string
	}

	if (!userId || !action) {
		return NextResponse.json(
			{ error: 'userId va action talab qilinadi' },
			{ status: 400 },
		)
	}

	// Prevent self-modification
	if (userId === session.user.id) {
		return NextResponse.json(
			{ error: "O'zingizni o'zgartira olmaysiz" },
			{ status: 400 },
		)
	}

	const user = await prisma.user.findUnique({ where: { id: userId } })
	if (!user) {
		return NextResponse.json(
			{ error: 'Foydalanuvchi topilmadi' },
			{ status: 404 },
		)
	}

	if (action === 'block') {
		await prisma.user.update({
			where: { id: userId },
			data: { isBlocked: true },
		})
		return NextResponse.json({ message: 'Foydalanuvchi bloklandi' })
	}

	if (action === 'unblock') {
		await prisma.user.update({
			where: { id: userId },
			data: { isBlocked: false },
		})
		return NextResponse.json({ message: 'Foydalanuvchi blokdan chiqarildi' })
	}

	if (action === 'changeRole' && role) {
		const validRoles = ['SELLER', 'BUYER', 'BOTH', 'ADMIN']
		if (!validRoles.includes(role)) {
			return NextResponse.json({ error: "Noto'g'ri rol" }, { status: 400 })
		}
		await prisma.user.update({
			where: { id: userId },
			data: { role: role as 'SELLER' | 'BUYER' | 'BOTH' | 'ADMIN' },
		})
		return NextResponse.json({ message: "Rol o'zgartirildi" })
	}

	return NextResponse.json({ error: "Noto'g'ri action" }, { status: 400 })
}
