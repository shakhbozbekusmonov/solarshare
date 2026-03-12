'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface AnalyticsData {
	stats: {
		totalUsers: number
		totalListings: number
		totalOrders: number
		totalRevenue: number
		successfulTransactions: number
	}
	usersByRole: Array<{ role: string; count: number }>
	ordersByStatus: Array<{ status: string; count: number }>
	recentUsers: Array<{
		id: string
		name: string
		email: string
		role: string
		createdAt: string
	}>
	monthlyRevenue: Array<{ month: string; count: number; revenue: number }>
	monthlyUsers: Array<{ month: string; count: number }>
}

const roleLabels: Record<string, string> = {
	ADMIN: 'Admin',
	SELLER: 'Sotuvchi',
	BUYER: 'Xaridor',
	BOTH: 'Ikkalasi',
}

const roleColors: Record<string, string> = {
	ADMIN: '#8b5cf6',
	SELLER: '#3b82f6',
	BUYER: '#10b981',
	BOTH: '#f59e0b',
}

const roleBadgeColors: Record<string, string> = {
	ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
	SELLER: 'bg-blue-100 text-blue-700 border-blue-200',
	BUYER: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	BOTH: 'bg-amber-100 text-amber-700 border-amber-200',
}

const statusLabels: Record<string, string> = {
	PENDING: 'Kutilmoqda',
	PAID: "To'langan",
	DELIVERED: 'Yetkazilgan',
	CANCELLED: 'Bekor qilingan',
	REFUNDED: 'Qaytarilgan',
}

const statusColors: Record<string, string> = {
	PENDING: '#f59e0b',
	PAID: '#10b981',
	DELIVERED: '#3b82f6',
	CANCELLED: '#ef4444',
	REFUNDED: '#6b7280',
}

const monthNames: Record<string, string> = {
	'01': 'Yan',
	'02': 'Fev',
	'03': 'Mar',
	'04': 'Apr',
	'05': 'May',
	'06': 'Iyun',
	'07': 'Iyul',
	'08': 'Avg',
	'09': 'Sen',
	'10': 'Okt',
	'11': 'Noy',
	'12': 'Dek',
}

function formatMonth(month: unknown) {
	const str = String(month)
	const [, m] = str.split('-')
	return monthNames[m] || str
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat('uz-UZ').format(Math.round(amount))
}

export function AdminAnalytics() {
	const [data, setData] = useState<AnalyticsData | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetch('/api/admin/analytics')
			.then(res => res.json())
			.then(setData)
			.finally(() => setIsLoading(false))
	}, [])

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<div className='grid gap-4 md:grid-cols-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className='pb-2'>
								<Skeleton className='h-4 w-24' />
							</CardHeader>
							<CardContent>
								<Skeleton className='h-8 w-20' />
							</CardContent>
						</Card>
					))}
				</div>
				<div className='grid gap-6 md:grid-cols-2'>
					<Skeleton className='h-72' />
					<Skeleton className='h-72' />
				</div>
			</div>
		)
	}

	if (!data) return null

	const kpiCards = [
		{
			title: 'Foydalanuvchilar',
			value: data.stats.totalUsers,
			icon: Users,
			color: 'text-blue-600',
			bg: 'bg-blue-50',
		},
		{
			title: 'Listinglar',
			value: data.stats.totalListings,
			icon: Package,
			color: 'text-emerald-600',
			bg: 'bg-emerald-50',
		},
		{
			title: 'Buyurtmalar',
			value: data.stats.totalOrders,
			icon: ShoppingCart,
			color: 'text-amber-600',
			bg: 'bg-amber-50',
		},
		{
			title: 'Jami daromad',
			value: `${formatCurrency(data.stats.totalRevenue)} so'm`,
			icon: DollarSign,
			color: 'text-purple-600',
			bg: 'bg-purple-50',
		},
	]

	return (
		<div className='space-y-6'>
			{/* KPI Cards */}
			<div className='grid gap-4 md:grid-cols-4'>
				{kpiCards.map(card => (
					<Card key={card.title}>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium text-muted-foreground'>
								{card.title}
							</CardTitle>
							<div className={`p-2 rounded-lg ${card.bg}`}>
								<card.icon className={`size-4 ${card.color}`} />
							</div>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold'>{card.value}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Row */}
			<div className='grid gap-6 md:grid-cols-2'>
				{/* Revenue Chart */}
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Oylik Daromad</CardTitle>
					</CardHeader>
					<CardContent>
						{data.monthlyRevenue.length > 0 ? (
							<ResponsiveContainer width='100%' height={250}>
								<AreaChart data={data.monthlyRevenue}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey='month'
										tickFormatter={formatMonth}
										fontSize={12}
									/>
									<YAxis fontSize={12} />
									<Tooltip
										labelFormatter={formatMonth}
										formatter={value => [
											`${formatCurrency(Number(value))} so'm`,
											'Daromad',
										]}
									/>
									<Area
										type='monotone'
										dataKey='revenue'
										stroke='#10b981'
										fill='#10b98130'
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						) : (
							<div className='flex items-center justify-center h-60 text-muted-foreground text-sm'>
								Hali daromad ma&apos;lumotlari yo&apos;q
							</div>
						)}
					</CardContent>
				</Card>

				{/* User Growth Chart */}
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>
							Foydalanuvchi O&apos;sishi
						</CardTitle>
					</CardHeader>
					<CardContent>
						{data.monthlyUsers.length > 0 ? (
							<ResponsiveContainer width='100%' height={250}>
								<BarChart data={data.monthlyUsers}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis
										dataKey='month'
										tickFormatter={formatMonth}
										fontSize={12}
									/>
									<YAxis fontSize={12} />
									<Tooltip
										labelFormatter={formatMonth}
										formatter={value => [Number(value), 'Yangi foydalanuvchi']}
									/>
									<Bar dataKey='count' fill='#3b82f6' radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className='flex items-center justify-center h-60 text-muted-foreground text-sm'>
								Hali ma&apos;lumotlar yo&apos;q
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Breakdown Row */}
			<div className='grid gap-6 md:grid-cols-2'>
				{/* Users by Role */}
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Rollar Bo&apos;yicha</CardTitle>
					</CardHeader>
					<CardContent>
						{data.usersByRole.length > 0 ? (
							<div className='flex items-center gap-6'>
								<ResponsiveContainer width={160} height={160}>
									<PieChart>
										<Pie
											data={data.usersByRole.map(r => ({
												name: roleLabels[r.role],
												value: r.count,
												fill: roleColors[r.role] || '#6b7280',
											}))}
											dataKey='value'
											cx='50%'
											cy='50%'
											innerRadius={40}
											outerRadius={70}
										>
											{data.usersByRole.map(r => (
												<Cell
													key={r.role}
													fill={roleColors[r.role] || '#6b7280'}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
								<div className='space-y-2'>
									{data.usersByRole.map(r => (
										<div
											key={r.role}
											className='flex items-center gap-2 text-sm'
										>
											<div
												className='size-3 rounded-full'
												style={{
													backgroundColor: roleColors[r.role] || '#6b7280',
												}}
											/>
											<span className='text-muted-foreground'>
												{roleLabels[r.role]}:
											</span>
											<span className='font-medium'>{r.count}</span>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className='flex items-center justify-center h-40 text-muted-foreground text-sm'>
								Ma&apos;lumotlar yo&apos;q
							</div>
						)}
					</CardContent>
				</Card>

				{/* Orders by Status */}
				<Card>
					<CardHeader>
						<CardTitle className='text-base'>Buyurtmalar Holati</CardTitle>
					</CardHeader>
					<CardContent>
						{data.ordersByStatus.length > 0 ? (
							<div className='flex items-center gap-6'>
								<ResponsiveContainer width={160} height={160}>
									<PieChart>
										<Pie
											data={data.ordersByStatus.map(o => ({
												name: statusLabels[o.status] || o.status,
												value: o.count,
												fill: statusColors[o.status] || '#6b7280',
											}))}
											dataKey='value'
											cx='50%'
											cy='50%'
											innerRadius={40}
											outerRadius={70}
										>
											{data.ordersByStatus.map(o => (
												<Cell
													key={o.status}
													fill={statusColors[o.status] || '#6b7280'}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
								<div className='space-y-2'>
									{data.ordersByStatus.map(o => (
										<div
											key={o.status}
											className='flex items-center gap-2 text-sm'
										>
											<div
												className='size-3 rounded-full'
												style={{
													backgroundColor: statusColors[o.status] || '#6b7280',
												}}
											/>
											<span className='text-muted-foreground'>
												{statusLabels[o.status] || o.status}:
											</span>
											<span className='font-medium'>{o.count}</span>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className='flex items-center justify-center h-40 text-muted-foreground text-sm'>
								Hali buyurtmalar yo&apos;q
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Recent Users */}
			<Card>
				<CardHeader>
					<CardTitle className='text-base'>
						So&apos;nggi Ro&apos;yxatdan O&apos;tganlar
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Ism</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Rol</TableHead>
									<TableHead>Sana</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.recentUsers.map(user => (
									<TableRow key={user.id}>
										<TableCell className='font-medium'>{user.name}</TableCell>
										<TableCell className='text-muted-foreground'>
											{user.email}
										</TableCell>
										<TableCell>
											<Badge
												variant='outline'
												className={roleBadgeColors[user.role]}
											>
												{roleLabels[user.role]}
											</Badge>
										</TableCell>
										<TableCell className='text-muted-foreground'>
											{new Date(user.createdAt).toLocaleDateString('uz-UZ')}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
