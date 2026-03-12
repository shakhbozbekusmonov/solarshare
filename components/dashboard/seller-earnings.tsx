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
import { DollarSign, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface EarningsData {
	totalEarnings: number
	totalKwhSold: number
	totalTransactions: number
	monthlyEarnings: Array<{
		month: string
		revenue: number
		kwh: number
		count: number
	}>
	transactions: Array<{
		id: string
		amount: string
		currency: string
		status: string
		createdAt: string
		order: {
			requestedKwh: string
			totalPrice: string
			paymentMethod: string | null
			listing: { title: string; currency: string }
			buyer: { name: string }
		}
	}>
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

function formatCurrency(amount: number | string) {
	return new Intl.NumberFormat('uz-UZ').format(Number(amount))
}

function formatMonth(month: string) {
	const [, m] = month.split('-')
	return monthNames[m] || m
}

export function SellerEarnings() {
	const [data, setData] = useState<EarningsData | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetch('/api/seller/earnings')
			.then(res => res.json())
			.then(setData)
			.finally(() => setIsLoading(false))
	}, [])

	if (isLoading) {
		return (
			<div className='space-y-6'>
				<div className='grid gap-4 md:grid-cols-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className='pb-2'>
								<Skeleton className='h-4 w-24' />
							</CardHeader>
							<CardContent>
								<Skeleton className='h-7 w-28' />
							</CardContent>
						</Card>
					))}
				</div>
				<Card>
					<CardHeader>
						<Skeleton className='h-5 w-36' />
					</CardHeader>
					<CardContent>
						<Skeleton className='h-64 w-full' />
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!data) {
		return (
			<div className='text-center py-12 text-muted-foreground'>
				Ma&apos;lumotlarni yuklashda xatolik
			</div>
		)
	}

	const chartData = data.monthlyEarnings.map(m => ({
		name: formatMonth(m.month),
		daromad: m.revenue,
		kwh: m.kwh,
	}))

	return (
		<div className='space-y-6'>
			{/* Summary cards */}
			<div className='grid gap-4 md:grid-cols-3'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							Jami Daromad
						</CardTitle>
						<DollarSign className='size-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatCurrency(data.totalEarnings)} UZS
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							{data.totalTransactions} ta muvaffaqiyatli tranzaksiya
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							Sotilgan Energiya
						</CardTitle>
						<Zap className='size-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatCurrency(data.totalKwhSold)} kWh
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							jami yetkazilgan energiya
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							O&apos;rtacha Tranzaksiya
						</CardTitle>
						<TrendingUp className='size-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{data.totalTransactions > 0
								? formatCurrency(
										Math.round(data.totalEarnings / data.totalTransactions),
									)
								: 0}{' '}
							UZS
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							har bir tranzaksiya uchun
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Revenue chart */}
			<Card>
				<CardHeader>
					<CardTitle className='text-base'>Oylik Daromad</CardTitle>
				</CardHeader>
				<CardContent>
					{chartData.length === 0 ? (
						<div className='flex items-center justify-center h-64 text-muted-foreground'>
							Hali ma&apos;lumotlar yo&apos;q
						</div>
					) : (
						<ResponsiveContainer width='100%' height={300}>
							<AreaChart data={chartData}>
								<defs>
									<linearGradient
										id='revenueGradient'
										x1='0'
										y1='0'
										x2='0'
										y2='1'
									>
										<stop
											offset='5%'
											stopColor='hsl(38, 92%, 50%)'
											stopOpacity={0.3}
										/>
										<stop
											offset='95%'
											stopColor='hsl(38, 92%, 50%)'
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid
									strokeDasharray='3 3'
									className='stroke-border'
								/>
								<XAxis
									dataKey='name'
									className='text-xs'
									tick={{ fill: 'hsl(var(--muted-foreground))' }}
								/>
								<YAxis
									className='text-xs'
									tick={{ fill: 'hsl(var(--muted-foreground))' }}
									tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--card))',
										border: '1px solid hsl(var(--border))',
										borderRadius: '8px',
										fontSize: '13px',
									}}
									formatter={value => [
										`${formatCurrency(Number(value))} UZS`,
										'Daromad',
									]}
								/>
								<Area
									type='monotone'
									dataKey='daromad'
									stroke='hsl(38, 92%, 50%)'
									strokeWidth={2}
									fill='url(#revenueGradient)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>

			{/* Transactions table */}
			<Card>
				<CardHeader>
					<CardTitle className='text-base'>Tranzaksiyalar Tarixi</CardTitle>
				</CardHeader>
				<CardContent>
					{data.transactions.length === 0 ? (
						<p className='text-sm text-muted-foreground text-center py-8'>
							Hali tranzaksiyalar yo&apos;q
						</p>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Listing</TableHead>
										<TableHead>Xaridor</TableHead>
										<TableHead className='text-right'>kWh</TableHead>
										<TableHead className='text-right'>Summa</TableHead>
										<TableHead>To&apos;lov</TableHead>
										<TableHead>Sana</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.transactions.map(tx => (
										<TableRow key={tx.id}>
											<TableCell className='font-medium max-w-50 truncate'>
												{tx.order.listing.title}
											</TableCell>
											<TableCell>{tx.order.buyer.name}</TableCell>
											<TableCell className='text-right'>
												{formatCurrency(tx.order.requestedKwh)}
											</TableCell>
											<TableCell className='text-right font-medium text-emerald-600'>
												{formatCurrency(tx.amount)} {tx.order.listing.currency}
											</TableCell>
											<TableCell>
												<Badge variant='outline' className='text-xs'>
													{tx.order.paymentMethod || '—'}
												</Badge>
											</TableCell>
											<TableCell className='text-muted-foreground text-sm'>
												{new Date(tx.createdAt).toLocaleDateString('uz-UZ')}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
