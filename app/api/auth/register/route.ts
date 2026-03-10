import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
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
