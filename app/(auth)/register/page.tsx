'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RegisterInput } from '@/lib/validations'
import { Loader2, Sun } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'

const roles = [
	{ value: 'SELLER' as const, label: 'Sotuvchi', desc: 'Energiya sotish' },
	{ value: 'BUYER' as const, label: 'Xaridor', desc: 'Energiya olish' },
	{ value: 'BOTH' as const, label: 'Ikkalasi', desc: 'Sotish va olish' },
]

function RegisterForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const defaultRole = searchParams.get('role')?.toUpperCase()

	const [error, setError] = useState('')
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<RegisterInput>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
			role:
				defaultRole === 'SELLER' ||
				defaultRole === 'BUYER' ||
				defaultRole === 'BOTH'
					? defaultRole
					: 'BUYER',
		},
	})

	const selectedRole = watch('role')

	async function onSubmit(data: RegisterInput) {
		setError('')
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})

			const json = await res.json()

			if (!res.ok) {
				setError(json.error || 'Xatolik yuz berdi')
				return
			}

			router.push('/login?registered=true')
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

			<div className='space-y-2'>
				<h1 className='text-2xl font-bold tracking-tight'>
					Ro&apos;yxatdan o&apos;tish
				</h1>
				<p className='text-sm text-muted-foreground'>
					Akkaunt yarating va quyosh energiya bozoriga qo&apos;shiling
				</p>
			</div>

			{error && (
				<div className='rounded-lg bg-destructive/10 p-3 text-sm text-destructive'>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Ism</Label>
					<Input
						id='name'
						placeholder='Ismingizni kiriting'
						{...register('name', {
							required: 'Ism kiritish majburiy',
							minLength: { value: 2, message: 'Kamida 2 ta belgi' },
						})}
					/>
					{errors.name && (
						<p className='text-xs text-destructive'>{errors.name.message}</p>
					)}
				</div>

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

				<div className='space-y-2'>
					<Label htmlFor='password'>Parol</Label>
					<Input
						id='password'
						type='password'
						placeholder='Kamida 8 ta belgi'
						{...register('password', {
							required: 'Parol kiritish majburiy',
							minLength: { value: 8, message: 'Kamida 8 ta belgi' },
						})}
					/>
					{errors.password && (
						<p className='text-xs text-destructive'>
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Role selection */}
				<div className='space-y-2'>
					<Label>Rolni tanlang</Label>
					<div className='grid grid-cols-3 gap-2'>
						{roles.map(r => (
							<button
								key={r.value}
								type='button'
								onClick={() => setValue('role', r.value)}
								className={`rounded-lg border p-3 text-center text-sm transition-colors ${
									selectedRole === r.value
										? 'border-amber-500 bg-amber-50 text-amber-700'
										: 'border-border hover:border-amber-300 hover:bg-amber-50/50'
								}`}
							>
								<div className='font-medium'>{r.label}</div>
								<div className='text-xs text-muted-foreground'>{r.desc}</div>
							</button>
						))}
					</div>
				</div>

				<Button
					type='submit'
					className='w-full bg-amber-500 hover:bg-amber-600 text-white'
					size='lg'
					disabled={isSubmitting}
				>
					{isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
					Ro&apos;yxatdan o&apos;tish
				</Button>
			</form>

			<p className='text-center text-sm text-muted-foreground'>
				Akkauntingiz bormi?{' '}
				<Link
					href='/login'
					className='font-medium text-amber-600 hover:underline'
				>
					Kirish
				</Link>
			</p>
		</div>
	)
}

export default function RegisterPage() {
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
			<RegisterForm />
		</Suspense>
	)
}
