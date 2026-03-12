'use client'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import {
	BarChart3,
	DollarSign,
	LayoutDashboard,
	ListChecks,
	LogOut,
	Package,
	Settings,
	ShoppingCart,
	Sun,
	Users,
	Wallet,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
	title: string
	href: string
	icon: React.ComponentType<{ className?: string }>
}

const sellerNav: NavItem[] = [
	{ title: 'Umumiy', href: '/seller/overview', icon: LayoutDashboard },
	{ title: 'Listinglar', href: '/seller/listings', icon: Package },
	{ title: 'Daromadlar', href: '/seller/earnings', icon: Wallet },
]

const buyerNav: NavItem[] = [
	{ title: 'Bozor', href: '/buyer/marketplace', icon: ShoppingCart },
	{ title: 'Buyurtmalar', href: '/buyer/orders', icon: ListChecks },
]

const adminNav: NavItem[] = [
	{ title: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
	{ title: 'Listinglar', href: '/admin/listings', icon: Package },
	{ title: 'Tranzaksiyalar', href: '/admin/transactions', icon: DollarSign },
	{ title: 'Analitika', href: '/admin/analytics', icon: BarChart3 },
]

function getNavSections(role: string) {
	const sections: { label: string; items: NavItem[] }[] = []

	if (['SELLER', 'BOTH', 'ADMIN'].includes(role)) {
		sections.push({ label: 'Sotuvchi', items: sellerNav })
	}
	if (['BUYER', 'BOTH', 'ADMIN'].includes(role)) {
		sections.push({ label: 'Xaridor', items: buyerNav })
	}
	if (role === 'ADMIN') {
		sections.push({ label: 'Admin', items: adminNav })
	}

	return sections
}

export function AppSidebar() {
	const pathname = usePathname()
	const { data: session } = useSession()
	const role = session?.user?.role ?? 'BUYER'
	const sections = getNavSections(role)

	return (
		<Sidebar collapsible='icon'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 text-white'>
									<Sun className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>SolarShare</span>
									<span className='truncate text-xs text-muted-foreground'>
										Energiya bozori
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{sections.map(section => (
					<SidebarGroup key={section.label}>
						<SidebarGroupLabel>{section.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{section.items.map(item => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={pathname === item.href}
											tooltip={item.title}
										>
											<Link href={item.href}>
												<item.icon className='size-4' />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip='Sozlamalar' asChild>
							<Link href='#'>
								<Settings className='size-4' />
								<span>Sozlamalar</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip='Chiqish'
							onClick={() => signOut({ redirectTo: '/login' })}
						>
							<LogOut className='size-4' />
							<span>Chiqish</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
