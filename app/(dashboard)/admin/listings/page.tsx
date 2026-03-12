import { AdminListingsList } from '@/components/dashboard/admin-listings'

export default function AdminListingsPage() {
	return (
		<div className='p-6 space-y-6'>
			<h1 className='text-2xl font-bold'>Listinglar Boshqaruvi</h1>
			<AdminListingsList />
		</div>
	)
}
