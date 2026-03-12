'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export default function GlobalError({
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
		<html lang='uz'>
			<body>
				<div className='flex min-h-screen flex-col items-center justify-center gap-6 p-4'>
					<AlertTriangle className='size-16 text-red-500' />
					<h1 className='text-2xl font-bold'>Kutilmagan xatolik yuz berdi</h1>
					<p className='max-w-md text-center text-muted-foreground'>
						Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko&apos;ring.
					</p>
					<Button onClick={reset} size='lg'>
						Qayta urinish
					</Button>
				</div>
			</body>
		</html>
	)
}
