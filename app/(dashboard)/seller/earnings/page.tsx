import { SellerEarnings } from '@/components/dashboard/seller-earnings'

export default function SellerEarningsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold tracking-tight'>Daromadlarim</h2>
				<p className='text-muted-foreground'>
					Daromadlaringiz va tranzaksiyalar tarixini ko&apos;ring
				</p>
			</div>

			<SellerEarnings />
		</div>
	)
}
