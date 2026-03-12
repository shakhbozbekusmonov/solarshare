'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Listing {
	id: string
	title: string
	description: string | null
	totalKwh: string
	availableKwh: string
	pricePerKwh: string
	currency: string
	period: string
	status: string
	location: string | null
	seller: {
		id: string
		name: string
	}
}

function formatCurrency(amount: number, currency: string) {
	if (currency === 'USD') {
		return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
	}
	return `${new Intl.NumberFormat('uz-UZ').format(Math.round(amount))} so'm`
}

const periodLabels: Record<string, string> = {
	DAILY: 'kunlik',
	WEEKLY: 'haftalik',
	MONTHLY: 'oylik',
}

export function CheckoutDialog({
	listing,
	open,
	onOpenChange,
	onSuccess,
}: {
	listing: Listing | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
}) {
	const [requestedKwh, setRequestedKwh] = useState(1)
	const [paymentMethod, setPaymentMethod] = useState<string>('PAYME')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const maxKwh = listing ? Number(listing.availableKwh) : 0
	const pricePerKwh = listing ? Number(listing.pricePerKwh) : 0
	const totalPrice = requestedKwh * pricePerKwh

	useEffect(() => {
		if (listing) {
			setRequestedKwh(Math.min(10, maxKwh))
			setPaymentMethod('PAYME')
		}
	}, [listing, maxKwh])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()

		if (!listing) return
		if (requestedKwh <= 0 || requestedKwh > maxKwh) {
			toast.error(`Miqdor 1 dan ${maxKwh} gacha bo'lishi kerak`)
			return
		}

		setIsSubmitting(true)
		try {
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					listingId: listing.id,
					requestedKwh,
					paymentMethod,
				}),
			})

			if (!res.ok) {
				const data = await res.json()
				toast.error(data.error || 'Buyurtma yaratishda xatolik')
				return
			}

			toast.success('Buyurtma muvaffaqiyatli yaratildi!')
			onOpenChange(false)
			onSuccess()
		} catch {
			toast.error('Tarmoq xatoligi')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!listing) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Buyurtma berish</DialogTitle>
					<DialogDescription>{listing.title}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-5'>
					{/* Listing Info */}
					<div className='rounded-lg bg-muted/50 p-4 space-y-2'>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-muted-foreground'>Sotuvchi</span>
							<span className='font-medium'>{listing.seller.name}</span>
						</div>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-muted-foreground'>Narx (kWh)</span>
							<span className='font-medium'>
								{formatCurrency(pricePerKwh, listing.currency)}
							</span>
						</div>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-muted-foreground'>Mavjud</span>
							<Badge variant='outline' className='gap-1'>
								<Zap className='size-3' />
								{maxKwh.toLocaleString()} kWh
							</Badge>
						</div>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-muted-foreground'>Davr</span>
							<span>{periodLabels[listing.period]}</span>
						</div>
					</div>

					{/* Quantity */}
					<div className='space-y-2'>
						<Label htmlFor='requestedKwh'>Miqdor (kWh)</Label>
						<div className='flex gap-2'>
							<Input
								id='requestedKwh'
								type='number'
								step='0.01'
								min={0.01}
								max={maxKwh}
								value={requestedKwh}
								onChange={e => setRequestedKwh(Number(e.target.value))}
								required
							/>
							<Button
								type='button'
								variant='outline'
								size='sm'
								className='shrink-0'
								onClick={() => setRequestedKwh(maxKwh)}
							>
								Hammasi
							</Button>
						</div>
						<p className='text-xs text-muted-foreground'>
							Mavjud: {maxKwh.toLocaleString()} kWh gacha
						</p>
					</div>

					{/* Payment Method */}
					<div className='space-y-2'>
						<Label>To&apos;lov usuli</Label>
						<Select value={paymentMethod} onValueChange={setPaymentMethod}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='PAYME'>
									<div className='flex items-center gap-2'>
										<CreditCard className='size-4' />
										Payme
									</div>
								</SelectItem>
								<SelectItem value='CLICK'>
									<div className='flex items-center gap-2'>
										<CreditCard className='size-4' />
										Click
									</div>
								</SelectItem>
								<SelectItem value='STRIPE'>
									<div className='flex items-center gap-2'>
										<CreditCard className='size-4' />
										Stripe (Visa/MC)
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Separator />

					{/* Price Summary */}
					<div className='space-y-2'>
						<div className='flex items-center justify-between text-sm'>
							<span className='text-muted-foreground'>
								{requestedKwh} kWh ×{' '}
								{formatCurrency(pricePerKwh, listing.currency)}
							</span>
							<span>{formatCurrency(totalPrice, listing.currency)}</span>
						</div>
						<div className='flex items-center justify-between font-semibold text-lg'>
							<span>Jami</span>
							<span className='text-emerald-600'>
								{formatCurrency(totalPrice, listing.currency)}
							</span>
						</div>
					</div>

					{/* Actions */}
					<div className='flex gap-2 pt-2'>
						<Button
							type='button'
							variant='outline'
							className='flex-1'
							onClick={() => onOpenChange(false)}
						>
							Bekor qilish
						</Button>
						<Button
							type='submit'
							className='flex-1'
							disabled={
								isSubmitting || requestedKwh <= 0 || requestedKwh > maxKwh
							}
						>
							{isSubmitting ? 'Yaratilmoqda...' : 'Buyurtma berish'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
