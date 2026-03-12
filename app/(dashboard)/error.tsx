'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export default function DashboardError({
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
		<div className='flex flex-col items-center justify-center gap-6 py-20'>
			<AlertTriangle className='size-12 text-red-500' />
			<h2 className='text-xl font-bold'>Xatolik yuz berdi</h2>
			<p className='max-w-sm text-center text-sm text-muted-foreground'>
				Sahifani yuklashda muammo paydo bo&apos;ldi. Qayta urinib ko&apos;ring.
			</p>
			<Button onClick={reset}>Qayta urinish</Button>
		</div>
	)
}
