import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const userId = request.nextUrl.searchParams.get('userId')
	if (!userId) {
		return NextResponse.json({ isBlocked: false })
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { isBlocked: true },
	})

	return NextResponse.json({ isBlocked: user?.isBlocked ?? false })
}
