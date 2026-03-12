import { AdminTransactionsList } from '@/components/dashboard/admin-transactions'

export default function AdminTransactionsPage() {
	return (
		<div className='p-6 space-y-6'>
			<h1 className='text-2xl font-bold'>Tranzaksiyalar</h1>
			<AdminTransactionsList />
		</div>
	)
}
