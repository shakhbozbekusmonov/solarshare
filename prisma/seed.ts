import { PrismaPg } from '@prisma/adapter-pg'
import { hashSync } from 'bcryptjs'
import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma/client.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
	console.log('🌱 Seeding database...')

	// Clean existing data
	await prisma.transaction.deleteMany()
	await prisma.order.deleteMany()
	await prisma.listing.deleteMany()
	await prisma.user.deleteMany()

	// Create Admin user
	const admin = await prisma.user.create({
		data: {
			email: 'admin@solarshare.uz',
			password: hashSync('Admin123!', 12),
			name: 'Admin',
			role: 'ADMIN',
			isVerified: true,
		},
	})
	console.log(`✅ Admin yaratildi: ${admin.email}`)

	// Create Seller user
	const seller = await prisma.user.create({
		data: {
			email: 'seller@solarshare.uz',
			password: hashSync('Seller123!', 12),
			name: 'Akbar Karimov',
			role: 'SELLER',
			isVerified: true,
		},
	})
	console.log(`✅ Seller yaratildi: ${seller.email}`)

	// Create Buyer user
	const buyer = await prisma.user.create({
		data: {
			email: 'buyer@solarshare.uz',
			password: hashSync('Buyer123!', 12),
			name: 'Nodira Aliyeva',
			role: 'BUYER',
			isVerified: true,
		},
	})
	console.log(`✅ Buyer yaratildi: ${buyer.email}`)

	// Create Both (Seller+Buyer) user
	const both = await prisma.user.create({
		data: {
			email: 'both@solarshare.uz',
			password: hashSync('Both123!', 12),
			name: 'Jamshid Toshmatov',
			role: 'BOTH',
			isVerified: true,
		},
	})
	console.log(`✅ Both roli yaratildi: ${both.email}`)

	// Create demo listings
	const listings = await Promise.all([
		prisma.listing.create({
			data: {
				sellerId: seller.id,
				title: 'Toshkent shahar — 50 kWh quyosh energiyasi',
				description:
					"Sergeli tumanida joylashgan 10kW quyosh panelidan ortiqcha energiya. Kuniga 50 kWh gacha ta'minlash mumkin.",
				totalKwh: 50,
				availableKwh: 50,
				pricePerKwh: 800,
				currency: 'UZS',
				period: 'DAILY',
				status: 'ACTIVE',
				location: 'Toshkent, Sergeli tumani',
			},
		}),
		prisma.listing.create({
			data: {
				sellerId: seller.id,
				title: 'Samarqand — 200 kWh oylik paket',
				description:
					'Samarqand shahridagi 20kW quyosh stansiyasidan oylik energiya paketi.',
				totalKwh: 200,
				availableKwh: 200,
				pricePerKwh: 750,
				currency: 'UZS',
				period: 'MONTHLY',
				status: 'ACTIVE',
				location: 'Samarqand shahri',
			},
		}),
		prisma.listing.create({
			data: {
				sellerId: both.id,
				title: 'Buxoro — 100 kWh haftalik',
				description:
					"Buxoro viloyatidagi fermer xo'jaligiga o'rnatilgan quyosh panellaridan haftalik energiya.",
				totalKwh: 100,
				availableKwh: 100,
				pricePerKwh: 700,
				currency: 'UZS',
				period: 'WEEKLY',
				status: 'ACTIVE',
				location: 'Buxoro viloyati',
			},
		}),
		prisma.listing.create({
			data: {
				sellerId: seller.id,
				title: 'Navoiy — 500 kWh sanoat energiyasi',
				description:
					'Navoiy erkin iqtisodiy zonasidagi katta quyosh stansiyasidan sanoat uchun energiya.',
				totalKwh: 500,
				availableKwh: 500,
				pricePerKwh: 650,
				currency: 'UZS',
				period: 'MONTHLY',
				status: 'PENDING',
				location: 'Navoiy EIZ',
			},
		}),
		prisma.listing.create({
			data: {
				sellerId: both.id,
				title: "Farg'ona — 30 kWh kunlik",
				description: "Farg'ona shahridagi uy panelidan ortiqcha energiya.",
				totalKwh: 30,
				availableKwh: 30,
				pricePerKwh: 850,
				currency: 'UZS',
				period: 'DAILY',
				status: 'ACTIVE',
				location: "Farg'ona shahri",
			},
		}),
	])

	console.log(`✅ ${listings.length} ta listing yaratildi`)

	console.log('\n🎉 Seed muvaffaqiyatli yakunlandi!')
	console.log('┌─────────────────────────────────────────┐')
	console.log("│ Login ma'lumotlari:                      │")
	console.log('│ Admin:  admin@solarshare.uz / Admin123!  │')
	console.log('│ Seller: seller@solarshare.uz / Seller123!│')
	console.log('│ Buyer:  buyer@solarshare.uz / Buyer123!  │')
	console.log('│ Both:   both@solarshare.uz / Both123!    │')
	console.log('└─────────────────────────────────────────┘')
}

main()
	.catch(e => {
		console.error('❌ Seed xatosi:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
