import type { Role } from '@/types'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: '/login',
	},
	providers: [], // Providers added in auth.ts (requires Node.js APIs)
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id!
				token.role = (user as { role: Role }).role
			}
			return token
		},
		session({ session, token }) {
			session.user.id = token.id as string
			session.user.role = token.role as Role
			return session
		},
	},
} satisfies NextAuthConfig
