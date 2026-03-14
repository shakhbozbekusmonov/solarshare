import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'
import { z } from 'zod/v4'

const forgotPasswordSchema = z.object({
	email: z.email("Noto'g'ri email format"),
})

const GENERIC_RESPONSE = {
	message:
		"Agar akkaunt mavjud bo'lsa, parolni tiklash havolasi email manzilingizga yuborildi.",
}

export async function POST(request: Request) {
	try {
		const ip =
			request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
		const { success } = rateLimit(`forgot-password:${ip}`, {
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
		const parsed = forgotPasswordSchema.safeParse(body)

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Ma'lumotlar noto'g'ri" },
				{ status: 400 },
			)
		}

		const user = await prisma.user.findUnique({
			where: { email: parsed.data.email },
			select: { id: true },
		})

		if (user) {
			// MVP: reset token/email infrastructure not implemented yet.
			// We still run a database lookup to keep timing behavior realistic.
			await Promise.resolve()
		}

		return NextResponse.json(GENERIC_RESPONSE, { status: 200 })
	} catch {
		return NextResponse.json(
			{ error: 'Serverda xatolik yuz berdi' },
			{ status: 500 },
		)
	}
}
