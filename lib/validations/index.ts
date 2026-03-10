import { z } from 'zod/v4'

export const registerSchema = z.object({
	name: z
		.string()
		.min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak")
		.max(100),
	email: z.email("Noto'g'ri email format"),
	password: z
		.string()
		.min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak")
		.max(100),
	role: z.enum(['SELLER', 'BUYER', 'BOTH']),
})

export const loginSchema = z.object({
	email: z.email("Noto'g'ri email format"),
	password: z.string().min(1, 'Parol kiritish majburiy'),
})

export const listingSchema = z.object({
	title: z
		.string()
		.min(3, "Sarlavha kamida 3 ta belgidan iborat bo'lishi kerak")
		.max(200),
	description: z.string().max(2000).optional(),
	totalKwh: z.number().positive("kWh 0 dan katta bo'lishi kerak"),
	pricePerKwh: z.number().positive("Narx 0 dan katta bo'lishi kerak"),
	currency: z.enum(['UZS', 'USD']),
	period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
	location: z.string().max(500).optional(),
})

export const orderSchema = z.object({
	listingId: z.string().min(1),
	requestedKwh: z.number().positive("Miqdor 0 dan katta bo'lishi kerak"),
	paymentMethod: z.enum(['PAYME', 'CLICK', 'STRIPE']),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ListingInput = z.infer<typeof listingSchema>
export type OrderInput = z.infer<typeof orderSchema>
