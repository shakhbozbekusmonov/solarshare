export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import {
	ArrowRight,
	BarChart3,
	ChevronDown,
	ChevronUp,
	Leaf,
	Shield,
	Sun,
	Users,
	Zap,
} from 'lucide-react'
import Link from 'next/link'

/* ───────── Navbar ───────── */
function Navbar() {
	return (
		<header className='fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl'>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				<Link href='/' className='flex items-center gap-2'>
					<Sun className='size-7 text-amber-500' />
					<span className='text-xl font-bold tracking-tight'>SolarShare</span>
				</Link>

				<nav className='hidden items-center gap-8 text-sm font-medium md:flex'>
					<a
						href='#how-it-works'
						className='text-muted-foreground transition hover:text-foreground'
					>
						Qanday ishlaydi
					</a>
					<a
						href='#stats'
						className='text-muted-foreground transition hover:text-foreground'
					>
						Statistika
					</a>
					<a
						href='#faq'
						className='text-muted-foreground transition hover:text-foreground'
					>
						FAQ
					</a>
				</nav>

				<div className='flex items-center gap-3'>
					<Link href='/login'>
						<Button variant='ghost' size='sm'>
							Kirish
						</Button>
					</Link>
					<Link href='/register'>
						<Button
							size='sm'
							className='bg-amber-500 hover:bg-amber-600 text-white'
						>
							Boshlash
						</Button>
					</Link>
				</div>
			</div>
		</header>
	)
}

/* ───────── Hero ───────── */
function Hero() {
	return (
		<section className='relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28'>
			{/* Background gradient orbs */}
			<div className='pointer-events-none absolute inset-0'>
				<div className='absolute -top-24 left-1/2 h-125 w-175 -translate-x-1/2 rounded-full bg-linear-to-br from-amber-200/40 via-orange-100/30 to-transparent blur-3xl' />
				<div className='absolute top-48 -right-20 h-75 w-100 rounded-full bg-linear-to-l from-yellow-100/40 to-transparent blur-3xl' />
			</div>

			<div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-3xl text-center'>
					{/* Badge */}
					<div className='mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700'>
						<Leaf className='size-4' />
						O&apos;zbekistonning birinchi quyosh energiya bozori
					</div>

					<h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
						Quyosh energiyasini{' '}
						<span className='bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent'>
							birga almashamiz
						</span>
					</h1>

					<p className='mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl'>
						Ortiqcha quyosh energiyangizni soting yoki arzon, toza energiya
						sotib oling. SolarShare — yashil kelajak uchun peer-to-peer energiya
						bozori.
					</p>

					<div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
						<Link href='/register?role=seller'>
							<Button
								size='lg'
								className='bg-amber-500 hover:bg-amber-600 text-white gap-2 px-8 h-12 text-base'
							>
								<Zap className='size-5' />
								Sotishni Boshlash
							</Button>
						</Link>
						<Link href='/register?role=buyer'>
							<Button
								size='lg'
								variant='outline'
								className='gap-2 px-8 h-12 text-base'
							>
								Energiya Sotib Olish
								<ArrowRight className='size-4' />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

/* ───────── How it Works ───────── */
const steps = [
	{
		icon: Users,
		title: "Ro'yxatdan o'ting",
		desc: 'Sotuvchi yoki xaridor sifatida bepul akkaunt yarating. Jarayon 1 daqiqa oladi.',
		color: 'bg-amber-100 text-amber-600',
	},
	{
		icon: Sun,
		title: 'Listing yarating yoki toping',
		desc: "Sotuvchilar ortiqcha energiyani e'lon qiladi, xaridorlar esa bozordan qulay narx topadi.",
		color: 'bg-orange-100 text-orange-600',
	},
	{
		icon: Shield,
		title: "Xavfsiz to'lov qiling",
		desc: "Payme, Click yoki Stripe orqali xavfsiz to'lov. Platforma tranzaksiyani kafolatlaydi.",
		color: 'bg-yellow-100 text-yellow-700',
	},
]

function HowItWorks() {
	return (
		<section id='how-it-works' className='py-20 sm:py-28 bg-muted/30'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl text-center'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						Qanday ishlaydi?
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						3 oddiy qadamda quyosh energiya savdosini boshlang
					</p>
				</div>

				<div className='mt-16 grid gap-8 sm:grid-cols-3'>
					{steps.map((step, i) => (
						<div
							key={step.title}
							className='group relative rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg'
						>
							<div className='absolute -top-4 left-6 flex size-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white'>
								{i + 1}
							</div>
							<div className={`mb-4 inline-flex rounded-xl p-3 ${step.color}`}>
								<step.icon className='size-6' />
							</div>
							<h3 className='text-lg font-semibold'>{step.title}</h3>
							<p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
								{step.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

/* ───────── Stats ───────── */
async function Stats() {
	let userCount = 0
	let totalKwh = 0
	let listingCount = 0

	try {
		const [count, listingStats] = await Promise.all([
			prisma.user.count(),
			prisma.listing.aggregate({
				_sum: { totalKwh: true },
				_count: true,
			}),
		])
		userCount = count
		totalKwh = Number(listingStats._sum.totalKwh ?? 0)
		listingCount = listingStats._count
	} catch {
		// DB unavailable (e.g. dev without Docker) — show zeros gracefully
	}

	const co2Saved = (totalKwh * 0.7) / 1000 // approx 0.7 kg CO₂ per kWh

	const stats = [
		{ value: `${userCount}`, label: 'Foydalanuvchilar', icon: Users },
		{
			value:
				totalKwh >= 1000 ? `${(totalKwh / 1000).toFixed(1)}k` : `${totalKwh}`,
			label: 'kWh jami',
			icon: Zap,
		},
		{
			value:
				co2Saved >= 1
					? `${co2Saved.toFixed(1)} t`
					: `${(co2Saved * 1000).toFixed(0)} kg`,
			label: 'CO₂ tejaldi',
			icon: Leaf,
		},
		{ value: `${listingCount}`, label: 'Listinglar', icon: BarChart3 },
	]

	return (
		<section id='stats' className='py-20 sm:py-28'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto max-w-2xl text-center'>
					<div className='mb-2 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700'>
						Beta — real vaqt ma&apos;lumotlar
					</div>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						Raqamlarda SolarShare
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						Platformamiz o&apos;sish davom etmoqda
					</p>
				</div>

				<div className='mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4'>
					{stats.map(s => (
						<div
							key={s.label}
							className='flex flex-col items-center rounded-2xl border bg-card p-6 text-center'
						>
							<div className='mb-3 inline-flex rounded-xl bg-amber-100 p-3 text-amber-600'>
								<s.icon className='size-6' />
							</div>
							<div className='text-3xl font-extrabold tracking-tight'>
								{s.value}
							</div>
							<div className='mt-1 text-sm text-muted-foreground'>
								{s.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

/* ───────── FAQ ───────── */
const faqItems = [
	{
		q: 'SolarShare nima va qanday ishlaydi?',
		a: "SolarShare — quyosh paneli egalari ortiqcha energiyalarini boshqa foydalanuvchilarga sotishi mumkin bo'lgan peer-to-peer bozor. Sotuvchilar listing yaratadi, xaridorlar esa bozordan kerakli hajmda energiya sotib oladi.",
	},
	{
		q: "Platformada ro'yxatdan o'tish bepulmi?",
		a: "Ha, to'liq bepul! Siz sotuvchi, xaridor yoki ikkalasi sifatida ro'yxatdan o'tishingiz mumkin. Platforma faqat muvaffaqiyatli tranzaksiyalardan kichik komissiya oladi.",
	},
	{
		q: "Qanday to'lov usullari qo'llab-quvvatlanadi?",
		a: "Payme, Click va Stripe to'lov tizimlari orqali xavfsiz to'lov qilish mumkin. Barcha tranzaksiyalar shifrlangan va himoyalangan.",
	},
	{
		q: 'Energiya qanday yetkazib beriladi?',
		a: "Hozirda energiya yetkazib berish mahalliy elektr tarmog'i orqali amalga oshiriladi. Platforma faqat savdo va to'lov jarayonini boshqaradi.",
	},
	{
		q: 'Minimal sotish/sotib olish hajmi bormi?',
		a: "Minimal hajm 1 kWh. Sotuvchilar o'zlari xohlagan hajm va narxni belgilaydi, xaridorlar esa kerakli hajmni tanlaydi.",
	},
]

function FAQ() {
	return (
		<section id='faq' className='py-20 sm:py-28 bg-muted/30'>
			<div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
						Ko&apos;p beriladigan savollar
					</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						SolarShare haqida bilishingiz kerak bo&apos;lgan narsalar
					</p>
				</div>

				<div className='mt-12 space-y-4'>
					{faqItems.map(item => (
						<FaqItem key={item.q} question={item.q} answer={item.a} />
					))}
				</div>
			</div>
		</section>
	)
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
	return (
		<details className='group rounded-xl border bg-card transition-shadow hover:shadow-sm'>
			<summary className='flex cursor-pointer items-center justify-between px-6 py-4 text-left font-medium [&::-webkit-details-marker]:hidden'>
				{question}
				<ChevronDown className='size-5 text-muted-foreground transition-transform group-open:hidden' />
				<ChevronUp className='hidden size-5 text-muted-foreground transition-transform group-open:block' />
			</summary>
			<div className='px-6 pb-4 text-sm leading-relaxed text-muted-foreground'>
				{answer}
			</div>
		</details>
	)
}

/* ───────── CTA Banner ───────── */
function CtaBanner() {
	return (
		<section className='py-20 sm:py-28'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='overflow-hidden rounded-3xl bg-linear-to-br from-amber-500 via-orange-500 to-yellow-500 p-10 text-center text-white sm:p-16'>
					<h2 className='text-3xl font-bold sm:text-4xl'>
						Yashil kelajakni birga quramiz
					</h2>
					<p className='mx-auto mt-4 max-w-xl text-lg text-white/80'>
						Hoziroq qo&apos;shiling va quyosh energiya inqilobining bir qismi
						bo&apos;ling. Toza, arzon va yashil energiya hamma uchun.
					</p>
					<div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
						<Link href='/register?role=seller'>
							<Button
								size='lg'
								className='bg-white text-amber-700 hover:bg-white/90 gap-2 h-12 px-8'
							>
								<Zap className='size-5' />
								Sotuvchi bo&apos;lish
							</Button>
						</Link>
						<Link href='/register?role=buyer'>
							<Button size='lg' variant='outline' className='bg-amber-500 gap-2 h-12 px-8'>
								Xaridor bo&apos;lish
								<ArrowRight className='size-4' />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

/* ───────── Footer ───────── */
function Footer() {
	return (
		<footer className='border-t bg-muted/20 py-12'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
					<div className='space-y-4'>
						<Link href='/' className='flex items-center gap-2'>
							<Sun className='size-6 text-amber-500' />
							<span className='text-lg font-bold'>SolarShare</span>
						</Link>
						<p className='text-sm text-muted-foreground'>
							O&apos;zbekistonning birinchi peer-to-peer quyosh energiya bozori.
						</p>
					</div>

					<div>
						<h4 className='mb-3 text-sm font-semibold'>Platforma</h4>
						<ul className='space-y-2 text-sm text-muted-foreground'>
							<li>
								<a href='#how-it-works' className='hover:text-foreground'>
									Qanday ishlaydi
								</a>
							</li>
							<li>
								<Link
									href='/register?role=seller'
									className='hover:text-foreground'
								>
									Sotuvchi bo&apos;lish
								</Link>
							</li>
							<li>
								<Link
									href='/register?role=buyer'
									className='hover:text-foreground'
								>
									Xaridor bo&apos;lish
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='mb-3 text-sm font-semibold'>Yordam</h4>
						<ul className='space-y-2 text-sm text-muted-foreground'>
							<li>
								<a href='#faq' className='hover:text-foreground'>
									FAQ
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-foreground'>
									Bog&apos;lanish
								</a>
							</li>
							<li>
								<a href='#' className='hover:text-foreground'>
									Shartlar
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='mb-3 text-sm font-semibold'>Aloqa</h4>
						<ul className='space-y-2 text-sm text-muted-foreground'>
							<li>info@solarshare.uz</li>
							<li>Toshkent, O&apos;zbekiston</li>
						</ul>
					</div>
				</div>

				<div className='mt-10 border-t pt-6 text-center text-sm text-muted-foreground'>
					© 2026 SolarShare. Barcha huquqlar himoyalangan.
				</div>
			</div>
		</footer>
	)
}

/* ───────── Main Page ───────── */
export default function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<Navbar />
			<Hero />
			<HowItWorks />
			<Stats />
			<FAQ />
			<CtaBanner />
			<Footer />
		</div>
	)
}
