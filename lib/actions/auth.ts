'use server'

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(formData: {
	email: string
	password: string
}) {
	try {
		await signIn('credentials', {
			email: formData.email,
			password: formData.password,
			redirect: false,
		})
		return { success: true }
	} catch (error) {
		if (error instanceof AuthError) {
			if (error.cause?.err?.message === 'BLOCKED') {
				return { error: "Akkauntingiz bloklangan. Admin bilan bog'laning." }
			}
			return { error: "Email yoki parol noto'g'ri" }
		}
		throw error
	}
}

export async function logoutAction() {
	await signOut({ redirectTo: '/login' })
}
