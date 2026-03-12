'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { ListingInput } from '@/lib/validations'
import { Edit, Package, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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

const periodLabels: Record<string, string> = {
	DAILY: 'Kunlik',
	WEEKLY: 'Haftalik',
	MONTHLY: 'Oylik',
}

function formatCurrency(amount: number | string) {
	return new Intl.NumberFormat('uz-UZ').format(Number(amount))
}

function ListingFormDialog({
	listing,
	open,
	onOpenChange,
	onSuccess,
}: {
	listing?: Listing | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => void
}) {
	const isEdit = !!listing
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [form, setForm] = useState<ListingInput>({
		title: listing?.title ?? '',
		description: listing?.description ?? '',
		totalKwh: listing ? Number(listing.totalKwh) : 0,
		pricePerKwh: listing ? Number(listing.pricePerKwh) : 0,
		currency: (listing?.currency as 'UZS' | 'USD') ?? 'UZS',
		period: (listing?.period as 'DAILY' | 'WEEKLY' | 'MONTHLY') ?? 'MONTHLY',
		location: listing?.location ?? '',
	})

	useEffect(() => {
		if (listing) {
			setForm({
				title: listing.title,
				description: listing.description ?? '',
				totalKwh: Number(listing.totalKwh),
				pricePerKwh: Number(listing.pricePerKwh),
				currency: listing.currency as 'UZS' | 'USD',
				period: listing.period as 'DAILY' | 'WEEKLY' | 'MONTHLY',
				location: listing.location ?? '',
			})
		} else {
			setForm({
				title: '',
				description: '',
				totalKwh: 0,
				pricePerKwh: 0,
				currency: 'UZS',
				period: 'MONTHLY',
				location: '',
			})
		}
	}, [listing])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setIsSubmitting(true)

		const url = isEdit ? `/api/listings/${listing.id}` : '/api/listings'
		const method = isEdit ? 'PUT' : 'POST'

		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})

			if (!res.ok) {
				const data = await res.json()
				toast.error(data.error || 'Xatolik yuz berdi')
				return
			}

			toast.success(isEdit ? 'Listing yangilandi' : 'Listing yaratildi')
			onOpenChange(false)
			onSuccess()
		} catch {
			toast.error('Tarmoq xatoligi')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						{isEdit ? 'Listingni tahrirlash' : 'Yangi listing yaratish'}
					</DialogTitle>
					<DialogDescription>
						{isEdit
							? "Listing ma'lumotlarini yangilang"
							: "Quyosh energiyangizni sotuvga qo'ying"}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='title'>Sarlavha</Label>
						<Input
							id='title'
							placeholder='Masalan: Toshkentdagi quyosh paneli'
							value={form.title}
							onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Tavsif</Label>
						<Textarea
							id='description'
							placeholder={"Listing haqida qo'shimcha ma'lumot..."}
							value={form.description ?? ''}
							onChange={e =>
								setForm(f => ({ ...f, description: e.target.value }))
							}
							rows={3}
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='totalKwh'>Jami kWh</Label>
							<Input
								id='totalKwh'
								type='number'
								step='0.01'
								min='0.01'
								placeholder='100'
								value={form.totalKwh || ''}
								onChange={e =>
									setForm(f => ({ ...f, totalKwh: Number(e.target.value) }))
								}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='pricePerKwh'>Narx (har kWh uchun)</Label>
							<Input
								id='pricePerKwh'
								type='number'
								step='0.01'
								min='0.01'
								placeholder='500'
								value={form.pricePerKwh || ''}
								onChange={e =>
									setForm(f => ({
										...f,
										pricePerKwh: Number(e.target.value),
									}))
								}
								required
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label>Valyuta</Label>
							<Select
								value={form.currency}
								onValueChange={v =>
									setForm(f => ({ ...f, currency: v as 'UZS' | 'USD' }))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='UZS'>UZS (so&apos;m)</SelectItem>
									<SelectItem value='USD'>USD ($)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2'>
							<Label>Davr</Label>
							<Select
								value={form.period}
								onValueChange={v =>
									setForm(f => ({
										...f,
										period: v as 'DAILY' | 'WEEKLY' | 'MONTHLY',
									}))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='DAILY'>Kunlik</SelectItem>
									<SelectItem value='WEEKLY'>Haftalik</SelectItem>
									<SelectItem value='MONTHLY'>Oylik</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='location'>Joylashuv</Label>
						<Input
							id='location'
							placeholder='Masalan: Toshkent, Chilonzor tumani'
							value={form.location ?? ''}
							onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
						/>
					</div>

					<div className='flex justify-end gap-2 pt-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							Bekor qilish
						</Button>
						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting
								? 'Saqlanmoqda...'
								: isEdit
									? 'Saqlash'
									: 'Yaratish'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

function ListingsTable({
	listings,
	isLoading,
	onEdit,
	onDelete,
}: {
	listings: Listing[]
	isLoading: boolean
	onEdit: (listing: Listing) => void
	onDelete: (id: string) => void
}) {
	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className='h-14 w-full' />
				))}
			</div>
		)
	}

	if (listings.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-12 text-center'>
				<Package className='size-12 text-muted-foreground/50 mb-3' />
				<h3 className='font-semibold'>Listinglar yo&apos;q</h3>
				<p className='text-sm text-muted-foreground'>
					Yangi listing yaratishni boshlang
				</p>
			</div>
		)
	}

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Sarlavha</TableHead>
						<TableHead className='hidden md:table-cell'>Joylashuv</TableHead>
						<TableHead className='text-right'>Narx</TableHead>
						<TableHead className='text-right hidden sm:table-cell'>
							Mavjud kWh
						</TableHead>
						<TableHead>Holat</TableHead>
						<TableHead className='text-right'>Amallar</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{listings.map(listing => (
						<TableRow key={listing.id}>
							<TableCell>
								<div>
									<p className='font-medium'>{listing.title}</p>
									<p className='text-xs text-muted-foreground'>
										{periodLabels[listing.period]}
									</p>
								</div>
							</TableCell>
							<TableCell className='hidden md:table-cell text-muted-foreground text-sm'>
								{listing.location || '—'}
							</TableCell>
							<TableCell className='text-right font-medium'>
								{formatCurrency(listing.pricePerKwh)}{' '}
								<span className='text-xs text-muted-foreground'>
									{listing.currency}/kWh
								</span>
							</TableCell>
							<TableCell className='text-right hidden sm:table-cell'>
								{formatCurrency(listing.availableKwh)} /{' '}
								{formatCurrency(listing.totalKwh)}
							</TableCell>
							<TableCell>
								<Badge
									variant='outline'
									className={statusColors[listing.status]}
								>
									{statusLabels[listing.status]}
								</Badge>
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex justify-end gap-1'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => onEdit(listing)}
									>
										<Edit className='size-4' />
									</Button>
									{listing.status !== 'CANCELLED' && (
										<Button
											variant='ghost'
											size='icon'
											className='text-destructive hover:text-destructive'
											onClick={() => onDelete(listing.id)}
										>
											<Trash2 className='size-4' />
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export function SellerListings() {
	const [data, setData] = useState<ListingsResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingListing, setEditingListing] = useState<Listing | null>(null)

	const loadListings = useCallback(async (status?: string) => {
		setIsLoading(true)
		const params = new URLSearchParams({ limit: '50' })
		if (status && status !== 'all') params.set('status', status)

		try {
			const res = await fetch(`/api/listings?${params}&sellerId=me`)
			// If sellerId=me not supported, fall back to default
			const json = await res.json()
			setData(json)
		} catch {
			toast.error('Listinglarni yuklashda xatolik')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadListings(activeTab)
	}, [activeTab, loadListings])

	function handleEdit(listing: Listing) {
		setEditingListing(listing)
		setDialogOpen(true)
	}

	async function handleDelete(id: string) {
		try {
			const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
			if (!res.ok) {
				const data = await res.json()
				toast.error(data.error || 'Xatolik yuz berdi')
				return
			}
			toast.success("Listing o'chirildi")
			loadListings(activeTab)
		} catch {
			toast.error('Tarmoq xatoligi')
		}
	}

	function handleCreateNew() {
		setEditingListing(null)
		setDialogOpen(true)
	}

	const listings = data?.listings ?? []

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value='all'>Barchasi</TabsTrigger>
						<TabsTrigger value='ACTIVE'>Faol</TabsTrigger>
						<TabsTrigger value='PENDING'>Kutilmoqda</TabsTrigger>
						<TabsTrigger value='SOLD'>Sotilgan</TabsTrigger>
					</TabsList>
				</Tabs>

				<Button onClick={handleCreateNew} size='sm'>
					<Plus className='size-4 mr-1' />
					Yangi listing
				</Button>
			</div>

			<ListingsTable
				listings={listings}
				isLoading={isLoading}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			{data?.pagination && data.pagination.totalPages > 1 && (
				<div className='flex justify-center gap-2 pt-2'>
					<p className='text-sm text-muted-foreground'>
						{data.pagination.total} ta listingdan{' '}
						{Math.min(
							data.pagination.page * data.pagination.limit,
							data.pagination.total,
						)}{' '}
						tasi ko&apos;rsatilmoqda
					</p>
				</div>
			)}

			<ListingFormDialog
				listing={editingListing}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSuccess={() => loadListings(activeTab)}
			/>
		</div>
	)
}
