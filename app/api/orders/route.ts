import { NextResponse } from 'next/server'

export async function GET() {
	return NextResponse.json(
		{ message: 'TODO: implement orders GET' },
		{ status: 501 },
	)
}

export async function POST() {
	return NextResponse.json(
		{ message: 'TODO: implement orders POST' },
		{ status: 501 },
	)
}
