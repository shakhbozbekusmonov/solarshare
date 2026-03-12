import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const ip =
			request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
		const { success } = rateLimit(`register:${ip}`, {
			limit: 5,
			windowMs: 60 * 1000,
		})
		if (!success) {
			return NextResponse.json(
				{ error: "Juda ko'p so'rov. Iltimos, birozdan keyin urinib ko'ring." },
				{ status: 429 },
			)
		}

		const body = await request.json()
		const parsed = registerSchema.safeParse(body)

		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Ma'lumotlar noto'g'ri",
					details: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 },
			)
		}

		const { name, email, password, role } = parsed.data

		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: "Bu email allaqachon ro'yxatdan o'tgan" },
				{ status: 409 },
			)
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role,
				isVerified: true, // MVP: auto-verify (email verification not yet implemented)
			},
		})

		return NextResponse.json(
			{ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz" },
			{ status: 201 },
		)
	} catch {
		return NextResponse.json(
			{ error: 'Serverda xatolik yuz berdi' },
			{ status: 500 },
		)
	}
}
