'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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
import {
	Check,
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
	Package,
	Search,
	X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface AdminListing {
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
	createdAt: string
	seller: {
		id: string
		name: string
		email: string
	}
	_count: {
		orders: number
	}
}

interface ListingsResponse {
	listings: AdminListing[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

const statusColors: Record<string, string> = {
	ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
	SOLD: 'bg-blue-100 text-blue-700 border-blue-200',
	CANCELLED: 'bg-red-100 text-red-700 border-red-200',
}

const statusLabels: Record<string, string> = {
	ACTIVE: 'Faol',
	PENDING: 'Kutilmoqda',
	SOLD: 'Sotilgan',
	CANCELLED: 'Bekor qilingan',
}

function formatCurrency(amount: number | string) {
	return new Intl.NumberFormat('uz-UZ').format(Number(amount))
}

export function AdminListingsList() {
	const [data, setData] = useState<ListingsResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [searchInput, setSearchInput] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [page, setPage] = useState(1)

	const fetchListings = useCallback(async () => {
		setIsLoading(true)
		const params = new URLSearchParams({ page: String(page), limit: '20' })
		if (search) params.set('search', search)
		if (statusFilter !== 'all') params.set('status', statusFilter)

		try {
			const res = await fetch(`/api/admin/listings?${params}`)
			if (res.ok) setData(await res.json())
		} finally {
			setIsLoading(false)
		}
	}, [page, search, statusFilter])

	useEffect(() => {
		fetchListings()
	}, [fetchListings])

	async function handleAction(listingId: string, action: string) {
		try {
			const res = await fetch('/api/admin/listings', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ listingId, action }),
			})
			if (res.ok) {
				toast.success(
					action === 'approve' ? 'Listing tasdiqlandi' : 'Listing rad etildi',
				)
				fetchListings()
			} else {
				const data = await res.json()
				toast.error(data.error || 'Xatolik yuz berdi')
			}
		} catch {
			toast.error('Tarmoq xatoligi')
		}
	}

	function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		setSearch(searchInput)
		setPage(1)
	}

	return (
		<div className='space-y-4'>
			{/* Tabs */}
			<Tabs
				value={statusFilter}
				onValueChange={v => {
					setStatusFilter(v)
					setPage(1)
				}}
			>
				<TabsList>
					<TabsTrigger value='all'>Barchasi</TabsTrigger>
					<TabsTrigger value='PENDING'>Kutilmoqda</TabsTrigger>
					<TabsTrigger value='ACTIVE'>Faol</TabsTrigger>
					<TabsTrigger value='SOLD'>Sotilgan</TabsTrigger>
					<TabsTrigger value='CANCELLED'>Bekor qilingan</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* Search */}
			<form onSubmit={handleSearch} className='flex gap-2'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
					<Input
						placeholder="Sarlavha yoki joylashuv bo'yicha qidirish..."
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
						className='pl-9'
					/>
				</div>
				<Button type='submit' variant='secondary'>
					Qidirish
				</Button>
			</form>

			{/* Table */}
			{isLoading ? (
				<div className='space-y-3'>
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className='h-14 w-full' />
					))}
				</div>
			) : data && data.listings.length > 0 ? (
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Listing</TableHead>
								<TableHead>Sotuvchi</TableHead>
								<TableHead className='text-right'>Narx/kWh</TableHead>
								<TableHead className='text-right'>Mavjud kWh</TableHead>
								<TableHead className='text-center'>Buyurtmalar</TableHead>
								<TableHead>Holat</TableHead>
								<TableHead>Sana</TableHead>
								<TableHead className='w-12' />
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.listings.map(listing => (
								<TableRow key={listing.id}>
									<TableCell>
										<div>
											<p className='font-medium truncate max-w-48'>
												{listing.title}
											</p>
											{listing.location && (
												<p className='text-xs text-muted-foreground'>
													{listing.location}
												</p>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div>
											<p className='text-sm'>{listing.seller.name}</p>
											<p className='text-xs text-muted-foreground'>
												{listing.seller.email}
											</p>
										</div>
									</TableCell>
									<TableCell className='text-right'>
										{formatCurrency(listing.pricePerKwh)}{' '}
										<span className='text-xs text-muted-foreground'>
											{listing.currency}
										</span>
									</TableCell>
									<TableCell className='text-right'>
										{Number(listing.availableKwh).toLocaleString()} /{' '}
										{Number(listing.totalKwh).toLocaleString()}
									</TableCell>
									<TableCell className='text-center'>
										{listing._count.orders}
									</TableCell>
									<TableCell>
										<Badge
											variant='outline'
											className={statusColors[listing.status]}
										>
											{statusLabels[listing.status]}
										</Badge>
									</TableCell>
									<TableCell className='text-muted-foreground text-sm'>
										{new Date(listing.createdAt).toLocaleDateString('uz-UZ')}
									</TableCell>
									<TableCell>
										{listing.status === 'PENDING' && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon'>
														<MoreHorizontal className='size-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuItem
														onClick={() => handleAction(listing.id, 'approve')}
														className='text-emerald-600'
													>
														<Check className='size-4 mr-2' />
														Tasdiqlash
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleAction(listing.id, 'reject')}
														className='text-red-600'
													>
														<X className='size-4 mr-2' />
														Rad etish
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Package className='size-16 text-muted-foreground/30 mb-4' />
					<h3 className='text-lg font-semibold'>Listinglar topilmadi</h3>
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
