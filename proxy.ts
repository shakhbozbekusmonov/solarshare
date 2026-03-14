import { authConfig } from '@/auth.config'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

async function isUserBlocked(userId: string): Promise<boolean> {
	try {
		const res = await fetch(
			`${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/auth/check-blocked?userId=${encodeURIComponent(userId)}`,
		)
		if (!res.ok) return false
		const data = await res.json()
		return data.isBlocked === true
	} catch {
		return false
	}
}

const publicRoutes = ['/', '/login', '/register', '/forgot-password']

const roleRoutes: Record<string, string[]> = {
	'/seller': ['SELLER', 'BOTH', 'ADMIN'],
	'/buyer': ['BUYER', 'BOTH', 'ADMIN'],
	'/admin': ['ADMIN'],
}

function getRoleRedirect(role: string): string {
	switch (role) {
		case 'SELLER':
			return '/seller/overview'
		case 'BUYER':
			return '/buyer/marketplace'
		case 'BOTH':
			return '/seller/overview'
		case 'ADMIN':
			return '/admin/users'
		default:
			return '/login'
	}
}

export default auth(async req => {
	const { pathname } = req.nextUrl
	const session = req.auth

	// Allow public routes
	if (publicRoutes.includes(pathname)) {
		// If logged in and on auth pages, redirect to dashboard
		if (session?.user && (pathname === '/login' || pathname === '/register')) {
			return NextResponse.redirect(
				new URL(getRoleRedirect(session.user.role), req.url),
			)
		}
		return NextResponse.next()
	}

	// Allow API and static routes
	if (
		pathname.startsWith('/api') ||
		pathname.startsWith('/_next') ||
		pathname.includes('.')
	) {
		return NextResponse.next()
	}

	// Require auth for all other routes
	if (!session?.user) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	// Check if user is blocked
	const blocked = await isUserBlocked(session.user.id)
	if (blocked) {
		const response = NextResponse.redirect(new URL('/login', req.url))
		response.cookies.delete('authjs.session-token')
		response.cookies.delete('__Secure-authjs.session-token')
		return response
	}

	// Role-based access
	for (const [prefix, allowedRoles] of Object.entries(roleRoutes)) {
		if (pathname.startsWith(prefix)) {
			if (!allowedRoles.includes(session.user.role)) {
				return NextResponse.redirect(
					new URL(getRoleRedirect(session.user.role), req.url),
				)
			}
		}
	}

	return NextResponse.next()
})

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
