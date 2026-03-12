'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
	'/seller/overview': "Umumiy ko'rish",
	'/seller/listings': 'Mening Listinglarim',
	'/seller/earnings': 'Daromadlarim',
	'/buyer/marketplace': 'Energiya Bozori',
	'/buyer/orders': 'Buyurtmalarim',
	'/admin/users': 'Foydalanuvchilar',
	'/admin/listings': 'Listinglar Moderatsiyasi',
	'/admin/transactions': 'Tranzaksiyalar',
	'/admin/analytics': 'Analitika',
}

export function DashboardHeader() {
	const pathname = usePathname()
	const { data: session } = useSession()
	const title = pageTitles[pathname] ?? 'Dashboard'
	const initials =
		session?.user?.name
			?.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2) ?? 'U'

	return (
		<header className='flex h-14 shrink-0 items-center gap-2 border-b px-4'>
			<SidebarTrigger className='-ml-1' />
			<Separator orientation='vertical' className='mr-2 h-4' />
			<h1 className='text-sm font-semibold'>{title}</h1>
			<div className='ml-auto flex items-center gap-3'>
				<span className='text-sm text-muted-foreground hidden sm:block'>
					{session?.user?.name}
				</span>
				<Avatar className='size-8'>
					<AvatarFallback className='text-xs bg-amber-100 text-amber-700'>
						{initials}
					</AvatarFallback>
				</Avatar>
			</div>
		</header>
	)
}
