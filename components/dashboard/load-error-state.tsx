import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export function LoadErrorState({
	title = "Ma'lumotni yuklab bo'lmadi",
	description = "Server bilan aloqa qilishda muammo yuz berdi. Qayta urinib ko'ring.",
	onRetry,
}: {
	title?: string
	description?: string
	onRetry: () => void
}) {
	return (
		<div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
			<div className='mb-4 rounded-full bg-destructive/10 p-3 text-destructive'>
				<AlertTriangle className='size-6' />
			</div>
			<h3 className='text-lg font-semibold'>{title}</h3>
			<p className='mt-2 max-w-md text-sm text-muted-foreground'>
				{description}
			</p>
			<Button className='mt-5 gap-2' variant='outline' onClick={onRetry}>
				<RotateCcw className='size-4' />
				Qayta urinish
			</Button>
		</div>
	)
}
