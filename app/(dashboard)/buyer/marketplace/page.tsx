import { MarketplaceListings } from '@/components/dashboard/marketplace-listings'

export default function BuyerMarketplacePage() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold tracking-tight'>Energiya Bozori</h2>
				<p className='text-muted-foreground'>
					Quyosh energiya listinglarini ko&apos;ring va sotib oling
				</p>
			</div>

			<MarketplaceListings />
		</div>
	)
}
