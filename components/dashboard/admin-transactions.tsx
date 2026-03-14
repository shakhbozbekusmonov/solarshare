'use client'

import { LoadErrorState } from '@/components/dashboard/load-error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Download, Receipt } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface TransactionItem {
	id: string
	amount: string
	currency: string
	status: string
	createdAt: string
	order: {
		id: string
		requestedKwh: string
		totalPrice: string
		paymentMethod: string | null
		status: string
		buyer: { id: string; name: string; email: string }
		listing: {
			id: string
			title: string
			seller: { id: string; name: string; email: string }
		}
	}
}

interface TransactionsResponse {
	transactions: TransactionItem[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

const txStatusConfig: Record<string, { label: string; className: string }> = {
	PENDING: {
		label: 'Kutilmoqda',
		className: 'bg-amber-100 text-amber-700 border-amber-200',
	},
	SUCCESS: {
		label: 'Muvaffaqiyatli',
		className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	},
	FAILED: {
		label: 'Muvaffaqiyatsiz',
		className: 'bg-red-100 text-red-700 border-red-200',
	},
}

const paymentLabels: Record<string, string> = {
	PAYME: 'Payme',
	CLICK: 'Click',
	STRIPE: 'Stripe',
}

function formatCurrency(amount: number | string, currency: string) {
	const num = Number(amount)
	if (currency === 'USD') {
		return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
	}
	return `${new Intl.NumberFormat('uz-UZ').format(Math.round(num))} so'm`
}

export function AdminTransactionsList() {
	const [data, setData] = useState<TransactionsResponse | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [statusFilter, setStatusFilter] = useState('all')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [page, setPage] = useState(1)

	const fetchTransactions = useCallback(async () => {
		setIsLoading(true)
		setErrorMessage(null)
		const params = new URLSearchParams({ page: String(page), limit: '20' })
		if (statusFilter !== 'all') params.set('status', statusFilter)
		if (dateFrom) params.set('dateFrom', dateFrom)
		if (dateTo) params.set('dateTo', dateTo)

		try {
			const res = await fetch(`/api/admin/transactions?${params}`)
			if (!res.ok) {
				const json = await res.json().catch(() => null)
				throw new Error(json?.error || 'Tranzaksiyalarni yuklashda xatolik')
			}

			setData(await res.json())
		} catch (error) {
			setData(null)
			setErrorMessage(
				error instanceof Error ? error.message : 'Kutilmagan xatolik yuz berdi',
			)
		} finally {
			setIsLoading(false)
		}
	}, [page, statusFilter, dateFrom, dateTo])

	useEffect(() => {
		fetchTransactions()
	}, [fetchTransactions])

	function exportCSV() {
		if (!data || data.transactions.length === 0) return

		const headers = [
			'ID',
			'Sana',
			'Summa',
			'Valyuta',
			'Holat',
			'Xaridor',
			'Xaridor Email',
			'Sotuvchi',
			'Sotuvchi Email',
			'Listing',
			"To'lov usuli",
			'kWh',
		]
		const rows = data.transactions.map(tx => [
			tx.id,
			new Date(tx.createdAt).toISOString(),
			tx.amount,
			tx.currency,
			tx.status,
			tx.order.buyer.name,
			tx.order.buyer.email,
			tx.order.listing.seller.name,
			tx.order.listing.seller.email,
			tx.order.listing.title,
			tx.order.paymentMethod || '',
			tx.order.requestedKwh,
		])

		const csv = [headers, ...rows]
			.map(row =>
				row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','),
			)
			.join('\n')

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
		link.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className='space-y-4'>
			{/* Filters */}
			<div className='flex flex-wrap gap-3'>
				<Select
					value={statusFilter}
					onValueChange={v => {
						setStatusFilter(v)
						setPage(1)
					}}
				>
					<SelectTrigger className='w-44'>
						<SelectValue placeholder='Holat' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Barcha holatlar</SelectItem>
						<SelectItem value='PENDING'>Kutilmoqda</SelectItem>
						<SelectItem value='SUCCESS'>Muvaffaqiyatli</SelectItem>
						<SelectItem value='FAILED'>Muvaffaqiyatsiz</SelectItem>
					</SelectContent>
				</Select>
				<Input
					type='date'
					value={dateFrom}
					onChange={e => {
						setDateFrom(e.target.value)
						setPage(1)
					}}
					className='w-40'
					placeholder='Dan'
				/>
				<Input
					type='date'
					value={dateTo}
					onChange={e => {
						setDateTo(e.target.value)
						setPage(1)
					}}
					className='w-40'
					placeholder='Gacha'
				/>
				<Button
					variant='outline'
					onClick={exportCSV}
					disabled={!data || data.transactions.length === 0}
					className='gap-2 ml-auto'
				>
					<Download className='size-4' />
					CSV eksport
				</Button>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className='space-y-3'>
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className='h-14 w-full' />
					))}
				</div>
			) : errorMessage ? (
				<LoadErrorState
					title="Tranzaksiyalarni yuklab bo'lmadi"
					description={errorMessage}
					onRetry={fetchTransactions}
				/>
			) : data && data.transactions.length > 0 ? (
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Sana</TableHead>
								<TableHead>Listing</TableHead>
								<TableHead>Xaridor</TableHead>
								<TableHead>Sotuvchi</TableHead>
								<TableHead className='text-right'>Summa</TableHead>
								<TableHead>To&apos;lov</TableHead>
								<TableHead>Holat</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.transactions.map(tx => {
								const status =
									txStatusConfig[tx.status] || txStatusConfig.PENDING
								return (
									<TableRow key={tx.id}>
										<TableCell className='text-sm text-muted-foreground whitespace-nowrap'>
											{new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
										</TableCell>
										<TableCell className='font-medium max-w-48 truncate'>
											{tx.order.listing.title}
										</TableCell>
										<TableCell>
											<div>
												<p className='text-sm'>{tx.order.buyer.name}</p>
												<p className='text-xs text-muted-foreground'>
													{tx.order.buyer.email}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<div>
												<p className='text-sm'>
													{tx.order.listing.seller.name}
												</p>
												<p className='text-xs text-muted-foreground'>
													{tx.order.listing.seller.email}
												</p>
											</div>
										</TableCell>
										<TableCell className='text-right font-medium'>
											{formatCurrency(tx.amount, tx.currency)}
										</TableCell>
										<TableCell>
											{tx.order.paymentMethod
												? paymentLabels[tx.order.paymentMethod] ||
													tx.order.paymentMethod
												: '—'}
										</TableCell>
										<TableCell>
											<Badge variant='outline' className={status.className}>
												{status.label}
											</Badge>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Receipt className='size-16 text-muted-foreground/30 mb-4' />
					<h3 className='text-lg font-semibold'>Tranzaksiyalar topilmadi</h3>
					<p className='text-sm text-muted-foreground mt-1'>
						Hali tranzaksiyalar mavjud emas
					</p>
				</div>
			)}

			{/* Pagination */}
			{data && data.pagination.totalPages > 1 && (
				<div className='flex items-center justify-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						disabled={page <= 1}
						onClick={() => setPage(p => p - 1)}
					>
						<ChevronLeft className='size-4 mr-1' />
						Oldingi
					</Button>
					<span className='text-sm text-muted-foreground'>
						{page} / {data.pagination.totalPages}
					</span>
					<Button
						variant='outline'
						size='sm'
						disabled={page >= data.pagination.totalPages}
						onClick={() => setPage(p => p + 1)}
					>
						Keyingi
						<ChevronRight className='size-4 ml-1' />
					</Button>
				</div>
			)}
		</div>
	)
}
