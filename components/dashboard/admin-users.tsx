'use client'

import { LoadErrorState } from '@/components/dashboard/load-error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
	Search,
	Shield,
	ShieldOff,
	UserCog,
	Users,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface AdminUser {
	id: string
	name: string
	email: string
	role: string
	isBlocked: boolean
	isVerified: boolean
	createdAt: string
	_count: {
		listings: number
		orders: number
	}
}

interface UsersResponse {
	users: AdminUser[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

const roleColors: Record<string, string> = {
	ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
	SELLER: 'bg-blue-100 text-blue-700 border-blue-200',
	BUYER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	BOTH: 'bg-amber-100 text-amber-700 border-amber-200',
}

const roleLabels: Record<string, string> = {
	ADMIN: 'Admin',
	SELLER: 'Sotuvchi',
	BUYER: 'Xaridor',
	BOTH: 'Ikkalasi',
}

export function AdminUsersList() {
	const [data, setData] = useState<UsersResponse | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [searchInput, setSearchInput] = useState('')
	const [roleFilter, setRoleFilter] = useState('all')
	const [page, setPage] = useState(1)

	const fetchUsers = useCallback(async () => {
		setIsLoading(true)
		setErrorMessage(null)
		const params = new URLSearchParams({ page: String(page), limit: '20' })
		if (search) params.set('search', search)
		if (roleFilter !== 'all') params.set('role', roleFilter)

		try {
			const res = await fetch(`/api/admin/users?${params}`)
			if (!res.ok) {
				const json = await res.json().catch(() => null)
				throw new Error(json?.error || 'Foydalanuvchilarni yuklashda xatolik')
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
	}, [page, search, roleFilter])

	useEffect(() => {
		fetchUsers()
	}, [fetchUsers])

	async function handleAction(userId: string, action: string, role?: string) {
		try {
			const res = await fetch('/api/admin/users', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, action, role }),
			})
			if (res.ok) {
				toast.success(
					action === 'block'
						? 'Foydalanuvchi bloklandi'
						: action === 'unblock'
							? 'Blokdan chiqarildi'
							: "Rol o'zgartirildi",
				)
				fetchUsers()
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
			{/* Search & Filters */}
			<div className='flex gap-2'>
				<form onSubmit={handleSearch} className='flex-1 flex gap-2'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
						<Input
							placeholder="Ism yoki email bo'yicha qidirish..."
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className='pl-9'
						/>
					</div>
					<Button type='submit' variant='secondary'>
						Qidirish
					</Button>
				</form>
				<Select
					value={roleFilter}
					onValueChange={v => {
						setRoleFilter(v)
						setPage(1)
					}}
				>
					<SelectTrigger className='w-40'>
						<SelectValue placeholder='Rol' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Barcha rollar</SelectItem>
						<SelectItem value='ADMIN'>Admin</SelectItem>
						<SelectItem value='SELLER'>Sotuvchi</SelectItem>
						<SelectItem value='BUYER'>Xaridor</SelectItem>
						<SelectItem value='BOTH'>Ikkalasi</SelectItem>
					</SelectContent>
				</Select>
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
					title="Foydalanuvchilarni yuklab bo'lmadi"
					description={errorMessage}
					onRetry={fetchUsers}
				/>
			) : data && data.users.length > 0 ? (
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Foydalanuvchi</TableHead>
								<TableHead>Rol</TableHead>
								<TableHead className='text-center'>Listinglar</TableHead>
								<TableHead className='text-center'>Buyurtmalar</TableHead>
								<TableHead>Holat</TableHead>
								<TableHead>Ro&apos;yxatdan</TableHead>
								<TableHead className='w-12' />
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.users.map(user => (
								<TableRow key={user.id}>
									<TableCell>
										<div>
											<p className='font-medium'>{user.name}</p>
											<p className='text-sm text-muted-foreground'>
												{user.email}
											</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant='outline' className={roleColors[user.role]}>
											{roleLabels[user.role]}
										</Badge>
									</TableCell>
									<TableCell className='text-center'>
										{user._count.listings}
									</TableCell>
									<TableCell className='text-center'>
										{user._count.orders}
									</TableCell>
									<TableCell>
										{user.isBlocked ? (
											<Badge variant='destructive'>Bloklangan</Badge>
										) : (
											<Badge
												variant='outline'
												className='bg-emerald-50 text-emerald-700 border-emerald-200'
											>
												Faol
											</Badge>
										)}
									</TableCell>
									<TableCell className='text-muted-foreground'>
										{new Date(user.createdAt).toLocaleDateString('uz-UZ')}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreHorizontal className='size-4' />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												{user.isBlocked ? (
													<DropdownMenuItem
														onClick={() => handleAction(user.id, 'unblock')}
													>
														<Shield className='size-4 mr-2' />
														Blokdan chiqarish
													</DropdownMenuItem>
												) : (
													<DropdownMenuItem
														onClick={() => handleAction(user.id, 'block')}
														className='text-red-600'
													>
														<ShieldOff className='size-4 mr-2' />
														Bloklash
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												{['SELLER', 'BUYER', 'BOTH', 'ADMIN'].map(
													role =>
														role !== user.role && (
															<DropdownMenuItem
																key={role}
																onClick={() =>
																	handleAction(user.id, 'changeRole', role)
																}
															>
																<UserCog className='size-4 mr-2' />
																{roleLabels[role]} qilish
															</DropdownMenuItem>
														),
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Users className='size-16 text-muted-foreground/30 mb-4' />
					<h3 className='text-lg font-semibold'>Foydalanuvchilar topilmadi</h3>
					<p className='text-sm text-muted-foreground mt-1'>
						Qidiruv bo&apos;yicha natija yo&apos;q
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
