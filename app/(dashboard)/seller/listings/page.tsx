import { SellerListings } from '@/components/dashboard/seller-listings'

export default function SellerListingsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold tracking-tight'>
					Mening Listinglarim
				</h2>
				<p className='text-muted-foreground'>
					Quyosh energiya listinglaringizni boshqaring
				</p>
			</div>

			<SellerListings />
		</div>
	)
}
