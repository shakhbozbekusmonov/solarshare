'use client'

import { LoadErrorState } from '@/components/dashboard/load-error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Order {
	id: string
	requestedKwh: string
	totalPrice: string
	status: string
	paymentMethod: string | null
	createdAt: string
	listing: {
		id: string
		title: string
		pricePerKwh: string
		currency: string
		period: string
		location: string | null
		seller: {
			id: string
			name: string
		}
	}
}

interface OrdersResponse {
	orders: Order[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

const statusConfig: Record<string, { label: string; className: string }> = {
	PENDING: {
		label: 'Kutilmoqda',
		className: 'bg-amber-100 text-amber-700 border-amber-200',
	},
	PAID: {
		label: "To'langan",
		className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	},
	DELIVERED: {
		label: 'Yetkazilgan',
		className: 'bg-blue-100 text-blue-700 border-blue-200',
	},
	CANCELLED: {
		label: 'Bekor qilingan',
		className: 'bg-red-100 text-red-700 border-red-200',
	},
	REFUNDED: {
		label: 'Qaytarilgan',
		className: 'bg-gray-100 text-gray-700 border-gray-200',
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

type TabFilter = 'all' | 'active' | 'completed' | 'cancelled'

export function BuyerOrdersList() {
	const [data, setData] = useState<OrdersResponse | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [tab, setTab] = useState<TabFilter>('all')
	const [page, setPage] = useState(1)

	const fetchOrders = useCallback(async () => {
		setIsLoading(true)
		setErrorMessage(null)
		const params = new URLSearchParams({
			page: String(page),
			limit: '20',
		})

		if (tab === 'active') params.set('status', 'PENDING')
		else if (tab === 'completed') params.set('status', 'PAID')
		else if (tab === 'cancelled') params.set('status', 'CANCELLED')

		try {
			const res = await fetch(`/api/orders?${params}`)
			if (!res.ok) {
				const json = await res.json().catch(() => null)
				throw new Error(json?.error || 'Buyurtmalarni yuklashda xatolik')
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
	}, [page, tab])

	useEffect(() => {
		fetchOrders()
	}, [fetchOrders])

	function handleTabChange(value: string) {
		setTab(value as TabFilter)
		setPage(1)
	}

	return (
		<div className='space-y-6'>
			<Tabs value={tab} onValueChange={handleTabChange}>
				<TabsList>
					<TabsTrigger value='all'>Barchasi</TabsTrigger>
					<TabsTrigger value='active'>Faol</TabsTrigger>
					<TabsTrigger value='completed'>To&apos;langan</TabsTrigger>
					<TabsTrigger value='cancelled'>Bekor qilingan</TabsTrigger>
				</TabsList>
			</Tabs>

			{isLoading ? (
				<div className='space-y-3'>
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className='h-16 w-full' />
					))}
				</div>
			) : errorMessage ? (
				<LoadErrorState
					title="Buyurtmalarni yuklab bo'lmadi"
					description={errorMessage}
					onRetry={fetchOrders}
				/>
			) : data && data.orders.length > 0 ? (
				<>
					{/* Desktop Table */}
					<div className='hidden md:block rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Listing</TableHead>
									<TableHead>Sotuvchi</TableHead>
									<TableHead className='text-right'>Miqdor</TableHead>
									<TableHead className='text-right'>Summa</TableHead>
									<TableHead>To&apos;lov</TableHead>
									<TableHead>Holat</TableHead>
									<TableHead>Sana</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.orders.map(order => {
									const status =
										statusConfig[order.status] || statusConfig.PENDING
									return (
										<TableRow key={order.id}>
											<TableCell className='font-medium max-w-50 truncate'>
												{order.listing.title}
											</TableCell>
											<TableCell>{order.listing.seller.name}</TableCell>
											<TableCell className='text-right'>
												{Number(order.requestedKwh).toLocaleString()} kWh
											</TableCell>
											<TableCell className='text-right font-medium'>
												{formatCurrency(
													order.totalPrice,
													order.listing.currency,
												)}
											</TableCell>
											<TableCell>
												{order.paymentMethod
													? paymentLabels[order.paymentMethod] ||
														order.paymentMethod
													: '—'}
											</TableCell>
											<TableCell>
												<Badge variant='outline' className={status.className}>
													{status.label}
												</Badge>
											</TableCell>
											<TableCell className='text-muted-foreground'>
												{new Date(order.createdAt).toLocaleDateString('uz-UZ')}
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</div>

					{/* Mobile Cards */}
					<div className='md:hidden space-y-3'>
						{data.orders.map(order => {
							const status = statusConfig[order.status] || statusConfig.PENDING
							return (
								<Card key={order.id}>
									<CardContent className='p-4 space-y-3'>
										<div className='flex items-start justify-between gap-2'>
											<div className='min-w-0'>
												<p className='font-medium truncate'>
													{order.listing.title}
												</p>
												<p className='text-sm text-muted-foreground'>
													{order.listing.seller.name}
												</p>
											</div>
											<Badge variant='outline' className={status.className}>
												{status.label}
											</Badge>
										</div>
										<div className='grid grid-cols-3 gap-2 text-sm'>
											<div>
												<p className='text-muted-foreground'>Miqdor</p>
												<p className='font-medium'>
													{Number(order.requestedKwh).toLocaleString()} kWh
												</p>
											</div>
											<div>
												<p className='text-muted-foreground'>Summa</p>
												<p className='font-medium'>
													{formatCurrency(
														order.totalPrice,
														order.listing.currency,
													)}
												</p>
											</div>
											<div>
												<p className='text-muted-foreground'>Sana</p>
												<p className='font-medium'>
													{new Date(order.createdAt).toLocaleDateString(
														'uz-UZ',
													)}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
					</div>

					{/* Pagination */}
					{data.pagination.totalPages > 1 && (
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
				</>
			) : (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Package className='size-16 text-muted-foreground/30 mb-4' />
					<h3 className='text-lg font-semibold'>Buyurtmalar yo&apos;q</h3>
					<p className='text-sm text-muted-foreground mt-1 max-w-sm'>
						{tab === 'all'
							? "Hali buyurtma berilmagan. Bozorga o'ting va energiya sotib oling!"
							: "Bu holatda buyurtmalar yo'q."}
					</p>
				</div>
			)}
		</div>
	)
}
