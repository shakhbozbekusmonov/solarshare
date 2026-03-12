'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AuthError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-6 p-4'>
			<AlertTriangle className='size-12 text-red-500' />
			<h2 className='text-xl font-bold'>Xatolik yuz berdi</h2>
			<p className='max-w-sm text-center text-sm text-muted-foreground'>
				Autentifikatsiya sahifasida muammo paydo bo&apos;ldi.
			</p>
			<div className='flex gap-3'>
				<Button onClick={reset} variant='outline'>
					Qayta urinish
				</Button>
				<Button asChild>
					<Link href='/login'>Kirish sahifasi</Link>
				</Button>
			</div>
		</div>
	)
}
