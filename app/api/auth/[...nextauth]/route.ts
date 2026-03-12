import { handlers } from '@/auth'
import { rateLimit } from '@/lib/rate-limit'
import { type NextRequest, NextResponse } from 'next/server'

const { GET: authGET, POST: authPOST } = handlers

export const GET = authGET

export async function POST(request: NextRequest) {
	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
	const { success } = rateLimit(`auth:${ip}`, {
		limit: 10,
		windowMs: 60 * 1000,
	})
	if (!success) {
		return NextResponse.json(
			{ error: "Juda ko'p so'rov. Iltimos, birozdan keyin urinib ko'ring." },
			{ status: 429 },
		)
	}
	return authPOST(request)
}
