import { authConfig } from '@/auth.config'
import { prisma } from '@/lib/prisma'
import type { Role } from '@/types'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

declare module 'next-auth' {
	interface User {
		role: Role
		isBlocked: boolean
	}
	interface Session {
		user: {
			id: string
			role: Role
			name: string
			email: string
		}
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async credentials => {
				const email = credentials?.email as string | undefined
				const password = credentials?.password as string | undefined

				if (!email || !password) return null

				const user = await prisma.user.findUnique({
					where: { email },
				})

				if (!user) return null

				if (user.isBlocked) {
					throw new Error('BLOCKED')
				}

				const isValid = await bcrypt.compare(password, user.password)
				if (!isValid) return null

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					isBlocked: user.isBlocked,
				}
			},
		}),
	],
})
