'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/lib/actions/auth'
import type { LoginInput } from '@/lib/validations'
import { Loader2, Sun } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'

function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const registered = searchParams.get('registered')

	const [error, setError] = useState('')
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		defaultValues: { email: '', password: '' },
	})

	async function onSubmit(data: LoginInput) {
		setError('')
		const result = await loginAction(data)

		if (result?.error) {
			setError(result.error)
			return
		}

		// After successful login, refresh to let middleware redirect based on role
		router.refresh()
		router.push('/')
	}

	return (
		<div className='space-y-6'>
			{/* Mobile logo */}
			<div className='flex items-center gap-2 lg:hidden'>
				<Sun className='size-6 text-amber-500' />
				<span className='text-lg font-bold'>SolarShare</span>
			</div>

			<div className='space-y-2'>
				<h1 className='text-2xl font-bold tracking-tight'>Kirish</h1>
				<p className='text-sm text-muted-foreground'>
					Akkauntingizga kirish uchun ma&apos;lumotlaringizni kiriting
				</p>
			</div>

			{registered && (
				<div className='rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700'>
					Muvaffaqiyatli ro&apos;yxatdan o&apos;tdingiz! Endi kiring.
				</div>
			)}

			{error && (
				<div className='rounded-lg bg-destructive/10 p-3 text-sm text-destructive'>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						placeholder='email@example.com'
						{...register('email', {
							required: 'Email kiritish majburiy',
						})}
					/>
					{errors.email && (
						<p className='text-xs text-destructive'>{errors.email.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Label htmlFor='password'>Parol</Label>
						<Link
							href='/forgot-password'
							className='text-xs text-amber-600 hover:underline'
						>
							Parolni unutdingizmi?
						</Link>
					</div>
					<Input
						id='password'
						type='password'
						placeholder='Parolingizni kiriting'
						{...register('password', {
							required: 'Parol kiritish majburiy',
						})}
					/>
					{errors.password && (
						<p className='text-xs text-destructive'>
							{errors.password.message}
						</p>
					)}
				</div>

				<Button
					type='submit'
					className='w-full bg-amber-500 hover:bg-amber-600 text-white'
					size='lg'
					disabled={isSubmitting}
				>
					{isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
					Kirish
				</Button>
			</form>

			<p className='text-center text-sm text-muted-foreground'>
				Akkauntingiz yo&apos;qmi?{' '}
				<Link
					href='/register'
					className='font-medium text-amber-600 hover:underline'
				>
					Ro&apos;yxatdan o&apos;ting
				</Link>
			</p>
		</div>
	)
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className='space-y-6 animate-pulse'>
					<div className='h-8 bg-muted rounded w-32' />
					<div className='h-10 bg-muted rounded' />
					<div className='h-10 bg-muted rounded' />
				</div>
			}
		>
			<LoginForm />
		</Suspense>
	)
}
