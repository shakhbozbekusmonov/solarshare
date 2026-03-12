import { Button } from '@/components/ui/button'
import { Sun } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-6 p-4'>
			<Sun className='size-16 text-amber-500' />
			<h1 className='text-4xl font-bold'>404</h1>
			<p className='max-w-sm text-center text-muted-foreground'>
				Siz qidirayotgan sahifa topilmadi yoki ko&apos;chirilgan.
			</p>
			<Button asChild size='lg'>
				<Link href='/'>Bosh sahifaga qaytish</Link>
			</Button>
		</div>
	)
}
