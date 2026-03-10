# Product Requirements Document — SolarShare

## Problem Statement

O'zbekistonda quyosh paneli egalari ortiqcha ishlab chiqargan energiyani sotish imkoniyatiga ega emas. Peer-to-peer energiya savdosi uchun mahalliy platformalar mavjud emas. Natijada ortiqcha energiya isrof bo'lmoqda, iste'molchilar esa arzon va toza energiya manbalariga kirisha olmaydi.

## Target Users

- **Primary (Seller):** Quyosh paneli egalari — ortiqcha energiyani monetizatsiya qilmoqchi bo'lgan uy/biznes egalari
- **Primary (Buyer):** Energiya iste'molchilari — arzonroq va ekologik toza energiya izlayotgan shaxslar/kompaniyalar
- **Secondary (Admin):** Platforma operatorlari — foydalanuvchilar, tranzaksiyalar va kontentni boshqaruvchilar

## Success Metrics

| Metrika                            | 1 oy   | 3 oy   |
| ---------------------------------- | ------ | ------ |
| Ro'yxatdan o'tgan foydalanuvchilar | 100+   | 500+   |
| Faol listinglar                    | 20+    | 150+   |
| Muvaffaqiyatli tranzaksiyalar      | 10+    | 100+   |
| Platforma uptime                   | 99%+   | 99.5%+ |
| To'lov muvaffaqiyat darajasi       | >90%   | >95%   |
| Landing page FCP                   | <2s    | <2s    |
| API GET response                   | <300ms | <300ms |

---

## Scope — MVP

### MUST HAVE (launch blockers)

- Auth tizimi: register, login, logout, rol tanlash (Seller/Buyer/Both/Admin)
- Prisma schema: User, Listing, Order, Transaction modellari
- Landing page: Hero, How it works, Stats, FAQ, Footer
- Seller dashboard: listing CRUD, daromad ko'rish, tranzaksiya tarixi
- Buyer dashboard: marketplace (filter, search, pagination), buyurtma berish
- Checkout oqimi: miqdor tanlash, narx kalkulyatsiya, to'lov tanlash
- Kamida 1 ta to'lov integratsiya (Payme yoki Click)
- Admin panel: foydalanuvchilar boshqaruvi, listinglar moderatsiyasi, tranzaksiyalar ko'rish
- Role-based access control (middleware)
- Responsive dizayn (mobile-first)

### SHOULD HAVE (high value)

- Email verification
- Forgot password oqimi
- Stripe integratsiya (xalqaro to'lovlar)
- Admin analytics dashboard (grafiklar, KPI widgetlar)
- Bildirishnomalar tizimi (in-app)
- CSV eksport (admin tranzaksiyalar)
- Skeleton/loading states barcha async operatsiyalar uchun
- Toast notifikatsiyalar

### COULD HAVE (nice to have)

- Seller/Buyer wishlist
- Dark mode
- Seller payout so'rovi
- Joylashuvga asoslangan listing tartiblash
- SEO optimizatsiya (meta tags, OG)

### WON'T HAVE (v1 exclusions)

- Real-time energiya monitoring (IoT)
- Smart metr integratsiyasi
- Ko'p valyuta qo'llab-quvvatlash (faqat UZS va USD)
- Mobil ilova (React Native)
- AI asosida narx tavsiyasi
- Shartnoma/hujjat generatsiya
- Chat tizimi (seller-buyer orasida)

---

## Technical Constraints

| Constraint        | Tafsilot                                                   |
| ----------------- | ---------------------------------------------------------- |
| **Framework**     | Next.js 16 (App Router) — allaqachon scaffold qilingan     |
| **Language**      | TypeScript strict mode                                     |
| **ORM**           | Prisma ORM — PostgreSQL bilan                              |
| **DB**            | PostgreSQL (local dev, Vercel Postgres yoki Supabase prod) |
| **Auth**          | Auth.js v5 (NextAuth) — session-based                      |
| **UI**            | shadcn/ui + Tailwind CSS v4                                |
| **Validation**    | Zod — server-side + form validation                        |
| **Forms**         | react-hook-form + zod resolver                             |
| **Charts**        | Recharts yoki Chart.js                                     |
| **Payments**      | Payme Merchant API v2 + Click Merchant API + Stripe        |
| **Deploy**        | Vercel (MVP), Docker (keyinroq)                            |
| **Passwords**     | bcrypt, salt rounds >= 12                                  |
| **Rate Limiting** | Auth endpointlarda (upstash yoki in-memory)                |

---

## Open Questions

| #   | Question                                                                     | Owner     | Deadline |
| --- | ---------------------------------------------------------------------------- | --------- | -------- |
| 1   | PostgreSQL hosting qayerda? (Vercel Postgres, Supabase, yoki local?)         | DevOps    | Sprint 0 |
| 2   | Payme/Click sandbox credentials tayyor bormi?                                | PM        | Sprint 2 |
| 3   | Seller verification jarayoni qanday? (hujjat tekshiruvi kerakmi?)            | PM        | Sprint 1 |
| 4   | Energiya yetkazib berish qanday tasdiqlanadi? (manual yoki avtomatik?)       | PM        | Sprint 2 |
| 5   | Admin rolini kim yaratadi? (seed yoki super-admin endpoint?)                 | Backend   | Sprint 0 |
| 6   | Listing approval jarayoni bor-yo'qligi (auto-publish yoki admin tasdiqlash?) | PM        | Sprint 1 |
| 7   | To'lov komissiyasi qancha? (platforma fee %)                                 | PM/Biznes | Sprint 2 |
