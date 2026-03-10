import { NextResponse } from 'next/server'

export async function POST() {
	return NextResponse.json(
		{ message: 'TODO: implement Click payment' },
		{ status: 501 },
	)
}
