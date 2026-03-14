'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Sun } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ForgotPasswordInput {
	email: string
}

export default function ForgotPasswordPage() {
	const [sent, setSent] = useState(false)
	const [error, setError] = useState('')
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordInput>({
		defaultValues: { email: '' },
	})

	async function onSubmit(data: ForgotPasswordInput) {
		setError('')

		try {
			const res = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const json = (await res.json().catch(() => null)) as {
					error?: string
				} | null
				setError(json?.error || "So'rov yuborishda xatolik yuz berdi")
				return
			}

			setSent(true)
		} catch {
			setError("Server bilan bog'lanib bo'lmadi")
		}
	}

	return (
		<div className='space-y-6'>
			{/* Mobile logo */}
			<div className='flex items-center gap-2 lg:hidden'>
				<Sun className='size-6 text-amber-500' />
				<span className='text-lg font-bold'>SolarShare</span>
			</div>

			<Link
				href='/login'
				className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
			>
				<ArrowLeft className='size-4' /> Kirishga qaytish
			</Link>

			<div className='space-y-2'>
				<h1 className='text-2xl font-bold tracking-tight'>Parolni tiklash</h1>
				<p className='text-sm text-muted-foreground'>
					Email manzilingizni kiriting, tiklash havolasini yuboramiz
				</p>
			</div>

			{error && (
				<div className='rounded-lg bg-destructive/10 p-3 text-sm text-destructive'>
					{error}
				</div>
			)}

			{sent ? (
				<div className='rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 space-y-2'>
					<p className='font-medium'>Havola yuborildi!</p>
					<p>
						Agar akkaunt mavjud bo&apos;lsa, parolni tiklash havolasi email
						manzilingizga yuborildi. Iltimos, pochta qutingizni tekshiring.
					</p>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='email@example.com'
							{...register('email', {
								required: 'Email kiritish majburiy',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Noto'g'ri email format",
								},
							})}
						/>
						{errors.email && (
							<p className='text-xs text-destructive'>{errors.email.message}</p>
						)}
					</div>

					<Button
						type='submit'
						className='w-full bg-amber-500 hover:bg-amber-600 text-white'
						size='lg'
						disabled={isSubmitting}
					>
						{isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
						Tiklash havolasini yuborish
					</Button>
				</form>
			)}
		</div>
	)
}
