import { Sun } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='grid min-h-screen lg:grid-cols-2'>
			{/* Left — Branding panel */}
			<div className='hidden lg:flex flex-col justify-between bg-linear-to-br from-amber-500 via-orange-500 to-yellow-600 p-10 text-white'>
				<Link href='/' className='flex items-center gap-2 text-lg font-bold'>
					<Sun className='size-6' />
					SolarShare
				</Link>
				<div className='space-y-4'>
					<h2 className='text-3xl font-bold leading-tight'>
						Quyosh energiyasini <br />
						birga almashamiz ☀️
					</h2>
					<p className='text-white/80 max-w-md'>
						O&apos;zbekistonning birinchi peer-to-peer quyosh energiya bozori.
						Ortiqcha energiyangizni soting yoki arzon quyosh energiyasi sotib
						oling.
					</p>
				</div>
				<p className='text-sm text-white/60'>
					© 2026 SolarShare. Barcha huquqlar himoyalangan.
				</p>
			</div>

			{/* Right — Form area */}
			<div className='flex items-center justify-center p-6 sm:p-10'>
				<div className='w-full max-w-md'>{children}</div>
			</div>
		</div>
	)
}
