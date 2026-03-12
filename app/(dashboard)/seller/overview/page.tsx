import {
	RecentTransactions,
	SellerStatsCards,
} from '@/components/dashboard/seller-stats'

export default function SellerOverviewPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
				<p className='text-muted-foreground'>
					Sizning energiya savdosi holatingiz
				</p>
			</div>

			<SellerStatsCards />

			<div className='grid gap-6 lg:grid-cols-2'>
				<RecentTransactions />
			</div>
		</div>
	)
}
