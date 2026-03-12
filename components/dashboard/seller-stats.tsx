'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
	DollarSign,
	Package,
	ShoppingCart,
	TrendingUp,
	Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface SellerStats {
	totalListings: number
	activeListings: number
	totalOrders: number
	completedOrders: number
	totalRevenue: number
	totalKwhSold: number
	recentTransactions: Array<{
		id: string
		amount: string
		status: string
		createdAt: string
		order: {
			requestedKwh: string
			listing: { title: string }
			buyer: { name: string }
		}
	}>
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat('uz-UZ', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount)
}

function StatCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
}: {
	title: string
	value: string
	description: string
	icon: React.ComponentType<{ className?: string }>
	trend?: string
}) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium text-muted-foreground'>
					{title}
				</CardTitle>
				<Icon className='size-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{value}</div>
				<p className='text-xs text-muted-foreground mt-1'>
					{trend && (
						<span className='text-emerald-600 font-medium'>{trend} </span>
					)}
					{description}
				</p>
			</CardContent>
		</Card>
	)
}

function StatsLoading() {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{Array.from({ length: 4 }).map((_, i) => (
				<Card key={i}>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='size-4' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-7 w-20 mb-1' />
						<Skeleton className='h-3 w-32' />
					</CardContent>
				</Card>
			))}
		</div>
	)
}

export function SellerStatsCards() {
	const [stats, setStats] = useState<SellerStats | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetch('/api/seller/stats')
			.then(res => res.json())
			.then(setStats)
			.finally(() => setIsLoading(false))
	}, [])

	if (isLoading) return <StatsLoading />

	if (!stats) {
		return (
			<div className='text-center py-8 text-muted-foreground'>
				Ma&apos;lumotlarni yuklashda xatolik
			</div>
		)
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<StatCard
				title='Jami Daromad'
				value={`${formatCurrency(stats.totalRevenue)} UZS`}
				description='barcha vaqt mobaynida'
				icon={DollarSign}
			/>
			<StatCard
				title='Faol Listinglar'
				value={`${stats.activeListings}`}
				description={`jami ${stats.totalListings} ta listing`}
				icon={Package}
			/>
			<StatCard
				title='Buyurtmalar'
				value={`${stats.completedOrders}`}
				description={`jami ${stats.totalOrders} ta buyurtma`}
				icon={ShoppingCart}
			/>
			<StatCard
				title='Sotilgan kWh'
				value={`${formatCurrency(stats.totalKwhSold)} kWh`}
				description='yetkazilgan energiya'
				icon={Zap}
			/>
		</div>
	)
}

export function RecentTransactions() {
	const [stats, setStats] = useState<SellerStats | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetch('/api/seller/stats')
			.then(res => res.json())
			.then(setStats)
			.finally(() => setIsLoading(false))
	}, [])

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base'>Oxirgi Tranzaksiyalar</CardTitle>
				</CardHeader>
				<CardContent className='space-y-3'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className='flex items-center gap-3'>
							<Skeleton className='size-8 rounded-full' />
							<div className='flex-1 space-y-1'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-3 w-20' />
							</div>
							<Skeleton className='h-4 w-16' />
						</div>
					))}
				</CardContent>
			</Card>
		)
	}

	const transactions = stats?.recentTransactions ?? []

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base flex items-center gap-2'>
					<TrendingUp className='size-4' />
					Oxirgi Tranzaksiyalar
				</CardTitle>
			</CardHeader>
			<CardContent>
				{transactions.length === 0 ? (
					<p className='text-sm text-muted-foreground text-center py-6'>
						Hali tranzaksiyalar yo&apos;q
					</p>
				) : (
					<div className='space-y-3'>
						{transactions.map(tx => (
							<div
								key={tx.id}
								className='flex items-center justify-between gap-3 rounded-lg border p-3'
							>
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium truncate'>
										{tx.order.listing.title}
									</p>
									<p className='text-xs text-muted-foreground'>
										{tx.order.buyer.name} · {Number(tx.order.requestedKwh)} kWh
									</p>
								</div>
								<div className='text-right'>
									<p className='text-sm font-semibold text-emerald-600'>
										+{formatCurrency(Number(tx.amount))} UZS
									</p>
									<p className='text-xs text-muted-foreground'>
										{new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
