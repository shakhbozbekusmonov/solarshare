'use client'

import { CheckoutDialog } from '@/components/dashboard/checkout-dialog'
import { LoadErrorState } from '@/components/dashboard/load-error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
	ChevronLeft,
	ChevronRight,
	MapPin,
	Search,
	ShoppingCart,
	SlidersHorizontal,
	Sun,
	X,
	Zap,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Listing {
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
	}
}

interface ListingsResponse {
	listings: Listing[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

const periodLabels: Record<string, string> = {
	DAILY: 'Kunlik',
	WEEKLY: 'Haftalik',
	MONTHLY: 'Oylik',
}

function formatCurrency(amount: number | string, currency: string) {
	const num = Number(amount)
	if (currency === 'USD') {
		return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
	}
	return `${new Intl.NumberFormat('uz-UZ').format(num)} so'm`
}

function ListingCardSkeleton() {
	return (
		<Card className='flex flex-col'>
			<CardHeader className='pb-3'>
				<Skeleton className='h-5 w-3/4' />
				<Skeleton className='h-4 w-1/2 mt-1' />
			</CardHeader>
			<CardContent className='flex-1 space-y-3'>
				<Skeleton className='h-4 w-full' />
				<Skeleton className='h-4 w-2/3' />
				<div className='grid grid-cols-2 gap-2 mt-4'>
					<Skeleton className='h-16' />
					<Skeleton className='h-16' />
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className='h-10 w-full' />
			</CardFooter>
		</Card>
	)
}

export function MarketplaceListings() {
	const [data, setData] = useState<ListingsResponse | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [searchInput, setSearchInput] = useState('')
	const [currency, setCurrency] = useState<string>('all')
	const [sortBy, setSortBy] = useState('createdAt')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
	const [minPrice, setMinPrice] = useState('')
	const [maxPrice, setMaxPrice] = useState('')
	const [page, setPage] = useState(1)
	const [showFilters, setShowFilters] = useState(false)
	const [checkoutListing, setCheckoutListing] = useState<Listing | null>(null)
	const limit = 12

	const fetchListings = useCallback(async () => {
		setIsLoading(true)
		setErrorMessage(null)
		const params = new URLSearchParams({
			page: String(page),
			limit: String(limit),
			status: 'ACTIVE',
			sortBy,
			sortOrder,
		})
		if (search) params.set('search', search)
		if (currency !== 'all') params.set('currency', currency)
		if (minPrice) params.set('minPrice', minPrice)
		if (maxPrice) params.set('maxPrice', maxPrice)

		try {
			const res = await fetch(`/api/listings?${params}`)
			if (!res.ok) {
				const json = await res.json().catch(() => null)
				throw new Error(json?.error || 'Listinglarni yuklashda xatolik')
			}

			const json = await res.json()
			setData(json)
		} catch (error) {
			setData(null)
			setErrorMessage(
				error instanceof Error ? error.message : 'Kutilmagan xatolik yuz berdi',
			)
		} finally {
			setIsLoading(false)
		}
	}, [page, search, currency, sortBy, sortOrder, minPrice, maxPrice])

	useEffect(() => {
		fetchListings()
	}, [fetchListings])

	function handleSearch(e: React.FormEvent) {
		e.preventDefault()
		setSearch(searchInput)
		setPage(1)
	}

	function clearFilters() {
		setSearch('')
		setSearchInput('')
		setCurrency('all')
		setSortBy('createdAt')
		setSortOrder('desc')
		setMinPrice('')
		setMaxPrice('')
		setPage(1)
	}

	const hasActiveFilters =
		search ||
		currency !== 'all' ||
		minPrice ||
		maxPrice ||
		sortBy !== 'createdAt'

	return (
		<div className='space-y-6'>
			{/* Search and Filter Bar */}
			<div className='flex flex-col gap-4'>
				<div className='flex gap-2'>
					<form onSubmit={handleSearch} className='flex-1 flex gap-2'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
							<Input
								placeholder='Qidiruv: sarlavha, tavsif, joylashuv...'
								value={searchInput}
								onChange={e => setSearchInput(e.target.value)}
								className='pl-9'
							/>
						</div>
						<Button type='submit' variant='secondary'>
							Qidirish
						</Button>
					</form>
					<Button
						variant={showFilters ? 'default' : 'outline'}
						size='icon'
						onClick={() => setShowFilters(!showFilters)}
					>
						<SlidersHorizontal className='size-4' />
					</Button>
				</div>

				{/* Filters Panel */}
				{showFilters && (
					<div className='grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg border'>
						<div className='space-y-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								Valyuta
							</label>
							<Select
								value={currency}
								onValueChange={v => {
									setCurrency(v)
									setPage(1)
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>Barchasi</SelectItem>
									<SelectItem value='UZS'>UZS (so&apos;m)</SelectItem>
									<SelectItem value='USD'>USD ($)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								Saralash
							</label>
							<Select
								value={`${sortBy}-${sortOrder}`}
								onValueChange={v => {
									const [field, order] = v.split('-')
									setSortBy(field)
									setSortOrder(order as 'asc' | 'desc')
									setPage(1)
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='createdAt-desc'>Eng yangi</SelectItem>
									<SelectItem value='createdAt-asc'>Eng eski</SelectItem>
									<SelectItem value='pricePerKwh-asc'>
										Narx: past → yuqori
									</SelectItem>
									<SelectItem value='pricePerKwh-desc'>
										Narx: yuqori → past
									</SelectItem>
									<SelectItem value='availableKwh-desc'>
										kWh: ko&apos;p → kam
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								Min narx (kWh)
							</label>
							<Input
								type='number'
								placeholder='0'
								value={minPrice}
								onChange={e => {
									setMinPrice(e.target.value)
									setPage(1)
								}}
								min={0}
							/>
						</div>
						<div className='space-y-1.5'>
							<label className='text-xs font-medium text-muted-foreground'>
								Max narx (kWh)
							</label>
							<Input
								type='number'
								placeholder='∞'
								value={maxPrice}
								onChange={e => {
									setMaxPrice(e.target.value)
									setPage(1)
								}}
								min={0}
							/>
						</div>
					</div>
				)}

				{/* Active Filters */}
				{hasActiveFilters && (
					<div className='flex items-center gap-2 flex-wrap'>
						<span className='text-sm text-muted-foreground'>Filtrlar:</span>
						{search && (
							<Badge variant='secondary' className='gap-1'>
								&quot;{search}&quot;
								<X
									className='size-3 cursor-pointer'
									onClick={() => {
										setSearch('')
										setSearchInput('')
									}}
								/>
							</Badge>
						)}
						{currency !== 'all' && (
							<Badge variant='secondary' className='gap-1'>
								{currency}
								<X
									className='size-3 cursor-pointer'
									onClick={() => setCurrency('all')}
								/>
							</Badge>
						)}
						{(minPrice || maxPrice) && (
							<Badge variant='secondary' className='gap-1'>
								Narx: {minPrice || '0'} – {maxPrice || '∞'}
								<X
									className='size-3 cursor-pointer'
									onClick={() => {
										setMinPrice('')
										setMaxPrice('')
									}}
								/>
							</Badge>
						)}
						<Button
							variant='ghost'
							size='sm'
							onClick={clearFilters}
							className='text-xs h-7'
						>
							Barchasini tozalash
						</Button>
					</div>
				)}
			</div>

			{/* Results info */}
			{data && !isLoading && (
				<div className='flex items-center justify-between'>
					<p className='text-sm text-muted-foreground'>
						{data.pagination.total} ta listing topildi
					</p>
				</div>
			)}

			{/* Listings Grid */}
			{isLoading ? (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<ListingCardSkeleton key={i} />
					))}
				</div>
			) : errorMessage ? (
				<LoadErrorState
					title="Bozor listinglarini yuklab bo'lmadi"
					description={errorMessage}
					onRetry={fetchListings}
				/>
			) : data && data.listings.length > 0 ? (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{data.listings.map(listing => (
						<Card
							key={listing.id}
							className='flex flex-col hover:shadow-md transition-shadow'
						>
							<CardHeader className='pb-3'>
								<div className='flex items-start justify-between gap-2'>
									<div className='min-w-0'>
										<h3 className='font-semibold truncate'>{listing.title}</h3>
										{listing.location && (
											<div className='flex items-center gap-1 text-sm text-muted-foreground mt-1'>
												<MapPin className='size-3 shrink-0' />
												<span className='truncate'>{listing.location}</span>
											</div>
										)}
									</div>
									<Badge variant='outline' className='shrink-0 text-xs'>
										{periodLabels[listing.period]}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className='flex-1 space-y-3'>
								{listing.description && (
									<p className='text-sm text-muted-foreground line-clamp-2'>
										{listing.description}
									</p>
								)}
								<div className='grid grid-cols-2 gap-3'>
									<div className='rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center'>
										<div className='flex items-center justify-center gap-1 text-emerald-600'>
											<Zap className='size-3.5' />
											<span className='text-xs font-medium'>Mavjud</span>
										</div>
										<p className='text-lg font-bold mt-1'>
											{Number(listing.availableKwh).toLocaleString()}
										</p>
										<p className='text-xs text-muted-foreground'>kWh</p>
									</div>
									<div className='rounded-lg bg-amber-50 dark:bg-amber-950/20 p-3 text-center'>
										<div className='flex items-center justify-center gap-1 text-amber-600'>
											<Sun className='size-3.5' />
											<span className='text-xs font-medium'>Narx</span>
										</div>
										<p className='text-lg font-bold mt-1'>
											{formatCurrency(listing.pricePerKwh, listing.currency)}
										</p>
										<p className='text-xs text-muted-foreground'>per kWh</p>
									</div>
								</div>
								<div className='flex items-center justify-between text-xs text-muted-foreground pt-1'>
									<span>Sotuvchi: {listing.seller.name}</span>
									<span>
										{new Date(listing.createdAt).toLocaleDateString('uz-UZ')}
									</span>
								</div>
							</CardContent>
							<CardFooter className='pt-0'>
								<Button
									className='w-full gap-2'
									onClick={() => setCheckoutListing(listing)}
								>
									<ShoppingCart className='size-4' />
									Sotib olish
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Sun className='size-16 text-muted-foreground/30 mb-4' />
					<h3 className='text-lg font-semibold'>Listing topilmadi</h3>
					<p className='text-sm text-muted-foreground mt-1 max-w-sm'>
						Hozircha faol listinglar yo&apos;q. Filtrlarni o&apos;zgartirib
						ko&apos;ring yoki keyinroq qaytib keling.
					</p>
					{hasActiveFilters && (
						<Button variant='outline' className='mt-4' onClick={clearFilters}>
							Filtrlarni tozalash
						</Button>
					)}
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
					<div className='flex items-center gap-1'>
						{Array.from(
							{ length: Math.min(data.pagination.totalPages, 5) },
							(_, i) => {
								let pageNum: number
								const total = data.pagination.totalPages
								if (total <= 5) {
									pageNum = i + 1
								} else if (page <= 3) {
									pageNum = i + 1
								} else if (page >= total - 2) {
									pageNum = total - 4 + i
								} else {
									pageNum = page - 2 + i
								}
								return (
									<Button
										key={pageNum}
										variant={page === pageNum ? 'default' : 'outline'}
										size='sm'
										className='w-9'
										onClick={() => setPage(pageNum)}
									>
										{pageNum}
									</Button>
								)
							},
						)}
					</div>
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

			{/* Checkout Dialog */}
			<CheckoutDialog
				listing={checkoutListing}
				open={!!checkoutListing}
				onOpenChange={(open: boolean) => !open && setCheckoutListing(null)}
				onSuccess={() => {
					setCheckoutListing(null)
					fetchListings()
				}}
			/>
		</div>
	)
}
