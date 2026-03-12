import { BuyerOrdersList } from '@/components/dashboard/buyer-orders'

export default function BuyerOrdersPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold tracking-tight'>Buyurtmalarim</h2>
				<p className='text-muted-foreground'>
					Energiya buyurtmalaringiz tarixi va holati
				</p>
			</div>

			<BuyerOrdersList />
		</div>
	)
}
