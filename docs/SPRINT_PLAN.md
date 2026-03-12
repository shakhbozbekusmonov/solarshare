# Sprint Plan — SolarShare MVP

**Jami davomiylik**: ~9 hafta (6 sprint)
**Sprint uzunligi**: Sprint 0 = 1 hafta, Sprint 1–5 = 1.5–2 hafta
**Tech Stack**: Next.js 16 · TypeScript · Prisma · PostgreSQL · Auth.js v5 · shadcn/ui · Tailwind CSS v4

---

## Sprint 0 (1 hafta): Foundation — Loyiha Asosi

**Goal**: Barcha texnik infratuzilma tayyor, jamoa ishlashni boshlashi mumkin

| #   | Task                                                        | Story       | Points | Priority | Owner         |
| --- | ----------------------------------------------------------- | ----------- | ------ | -------- | ------------- |
| 1   | shadcn/ui o'rnatish va konfiguratsiya                       | STORY-01-01 | 2      | P0       | frontend-lead |
| 2   | Prisma ORM + PostgreSQL sozlash (docker-compose)            | STORY-01-02 | 3      | P0       | frontend-lead |
| 3   | Prisma Schema — User, Listing, Order, Transaction + enumlar | STORY-01-03 | 5      | P0       | frontend-lead |
| 4   | Papka tuzilmasi yaratish (app/, components/, lib/, types/)  | STORY-01-04 | 2      | P0       | frontend-lead |
| 5   | `.env.example`, seed script (admin + demo data)             | STORY-01-03 | —      | P0       | frontend-lead |

**Sprint Points**: 12
**Definition of Done**: `npm run dev` ishlaydi, `prisma migrate dev` muvaffaqiyatli, `prisma studio` ochiladi, shadcn komponentlar import qilinadi

**Deliverables**:

- [x] Next.js 16 + Tailwind v4 (allaqachon mavjud)
- [x] shadcn/ui to'liq sozlangan
- [ ] PostgreSQL docker-compose yoki local
- [ ] Prisma schema + initial migration
- [ ] Seed data (admin user + 5 ta demo listing)
- [ ] Papka tuzilmasi tayyor
- [ ] `.env.example` fayli

---

## Sprint 1 (2 hafta): Auth + Landing Page

**Goal**: Foydalanuvchilar ro'yxatdan o'tishi, kirishi, Landing page marketing uchun tayyor

### Auth tizimi

| #   | Task                                                  | Story       | Points | Priority | Owner         |
| --- | ----------------------------------------------------- | ----------- | ------ | -------- | ------------- |
| 1   | Auth.js v5 konfiguratsiya (Credentials, JWT, session) | STORY-02-01 | 5      | P0       | frontend-lead |
| 2   | Register sahifa + `POST /api/auth/register`           | STORY-02-02 | 5      | P0       | frontend-lead |
| 3   | Login sahifa + Auth.js signIn                         | STORY-02-03 | 3      | P0       | frontend-lead |
| 4   | Middleware — role-based route protection              | STORY-02-04 | 3      | P0       | frontend-lead |
| 5   | Forgot Password sahifa (asosiy flow)                  | STORY-02-05 | 3      | P1       | frontend-lead |

### Landing Page

| #   | Task                                | Story       | Points | Priority | Owner         |
| --- | ----------------------------------- | ----------- | ------ | -------- | ------------- |
| 6   | Hero Section + Navbar + CTA         | STORY-03-01 | 3      | P0       | frontend-lead |
| 7   | How it Works + Stats + FAQ + Footer | STORY-03-02 | 3      | P0       | frontend-lead |

**Sprint Points**: 25
**Definition of Done**: Register → Login → Dashboard redirect ishlaydi, Landing page responsiv, FCP < 2s

**Deliverables**:

- [ ] `/register` — ism, email, parol, rol tanlash
- [ ] `/login` — email, parol, role-based redirect
- [ ] `/forgot-password` — email orqali tiklash (basic)
- [ ] `middleware.ts` — protected routes
- [ ] Landing page — to'liq (hero, how it works, stats, faq, footer)
- [ ] Mobile-first responsive dizayn

---

## Sprint 2 (2 hafta): Seller Dashboard

**Goal**: Seller listing yaratishi, boshqarishi, daromadini ko'rishi mumkin

| #   | Task                                                | Story       | Points | Priority | Owner         |
| --- | --------------------------------------------------- | ----------- | ------ | -------- | ------------- |
| 1   | Dashboard umumiy layout (sidebar, header, content)  | STORY-04-01 | 5      | P0       | frontend-lead |
| 2   | Seller Overview sahifasi + stat widgetlar           | STORY-04-02 | 5      | P0       | frontend-lead |
| 3   | Listing CRUD — yaratish + ko'rish (tabs, form, API) | STORY-04-03 | 8      | P0       | frontend-lead |
| 4   | Listing CRUD — tahrirlash + o'chirish + status      | STORY-04-04 | 5      | P0       | frontend-lead |
| 5   | Seller Earnings sahifasi + grafik                   | STORY-04-05 | 5      | P1       | frontend-lead |

**Sprint Points**: 28
**Definition of Done**: Seller listing CRUD to'liq ishlaydi, earnings sahifasida grafik va tranzaksiyalar ko'rinadi

**Deliverables**:

- [ ] Dashboard layout — sidebar navigation (rol-based)
- [ ] `/seller/overview` — 4 ta stat widget + oxirgi tranzaksiyalar
- [ ] `/seller/listings` — tabs, yaratish form, tahrirlash, o'chirish
- [ ] `/seller/earnings` — grafik (Recharts) + tranzaksiyalar jadval
- [ ] API endpointlar: `POST/GET/PUT/DELETE /api/listings`, `GET /api/seller/stats`, `GET /api/seller/earnings`
- [ ] Zod validation barcha formlarda
- [ ] Loading skeleton states

---

## Sprint 3 (2 hafta): Buyer Dashboard + Marketplace + Checkout

**Goal**: Buyer bozordan listing topib, buyurtma berib, to'lov oqimini boshlashi mumkin

| #   | Task                                                          | Story       | Points | Priority | Owner         |
| --- | ------------------------------------------------------------- | ----------- | ------ | -------- | ------------- |
| 1   | Marketplace sahifasi (grid, filter, search, pagination)       | STORY-05-01 | 8      | P0       | frontend-lead |
| 2   | Checkout oqimi (miqdor, narx, to'lov tanlash, order yaratish) | STORY-05-02 | 8      | P0       | frontend-lead |
| 3   | Buyer Orders sahifasi (tabs, order tarixi)                    | STORY-05-03 | 3      | P0       | frontend-lead |
| 4   | To'lov umumiy infratuzilmasi (helpers)                        | STORY-06-03 | 3      | P0       | frontend-lead |

**Sprint Points**: 22
**Definition of Done**: Buyer marketplace bilan ishlaydi, checkout oqimi order yaratadi, orders tarixda ko'rinadi

**Deliverables**:

- [ ] `/buyer/marketplace` — grid layout, search, filter (narx, miqdor), pagination (20/sahifa)
- [ ] Checkout modal/sahifa — miqdor slider, narx kalkulyatsiya, to'lov usuli tanlash
- [ ] `/buyer/orders` — tabs (Active, Completed, Cancelled)
- [ ] API endpointlar: `GET /api/listings` (public, paginated), `POST /api/orders`, `GET /api/orders`
- [ ] `lib/payments/` — umumiy to'lov utility funksiyalar
- [ ] Empty states, loading skeletons

---

## Sprint 4 (2 hafta): Payment Integration + Admin Panel

**Goal**: To'lov oqimi end-to-end ishlaydi, Admin platforma boshqaradi

### To'lov integratsiya

| #   | Task                                             | Story       | Points | Priority | Owner         |
| --- | ------------------------------------------------ | ----------- | ------ | -------- | ------------- |
| 1   | Payme integratsiya (session, webhook, HMAC)      | STORY-06-01 | 8      | P0       | frontend-lead |
| 2   | Click integratsiya (session, webhook, signature) | STORY-06-02 | 5      | P1       | frontend-lead |

### Admin Panel

| #   | Task                                                  | Story       | Points | Priority | Owner         |
| --- | ----------------------------------------------------- | ----------- | ------ | -------- | ------------- |
| 3   | Admin Users sahifasi (jadval, qidiruv, bloklash, rol) | STORY-07-01 | 5      | P0       | frontend-lead |
| 4   | Admin Listings sahifasi (moderatsiya, tasdiqlash/rad) | STORY-07-02 | 3      | P0       | frontend-lead |
| 5   | Admin Transactions sahifasi (jadval, CSV eksport)     | STORY-07-03 | 5      | P1       | frontend-lead |

**Sprint Points**: 26
**Definition of Done**: Payme to'lov PENDING → PAID o'tadi, Admin barcha foydalanuvchi/listing/tranzaksiyalarni boshqaradi

**Deliverables**:

- [ ] `POST /api/payments/payme` + webhook callback + HMAC
- [ ] `POST /api/payments/click` + webhook callback + signature
- [ ] Order → PAID → Listing.availableKwh kamaytirish → Transaction log
- [ ] `/admin/users` — jadval, qidiruv, bloklash, rol o'zgartirish
- [ ] `/admin/listings` — moderatsiya (tasdiqlash/rad etish)
- [ ] `/admin/transactions` — jadval, sana filter, CSV eksport
- [ ] Admin middleware himoyasi

---

## Sprint 5 (1 hafta): Analytics, Polish & Deploy

**Goal**: Admin analitika tayyor, UI polish, production deploy, beta test uchun tayyor

| #   | Task                                      | Story       | Points | Priority | Owner         |
| --- | ----------------------------------------- | ----------- | ------ | -------- | ------------- |
| 1   | Admin Analytics sahifasi (KPI, grafiklar) | STORY-07-04 | 5      | P1       | frontend-lead |
| 2   | Bildirishnomalar tizimi (in-app toast)    | —           | 2      | P1       | frontend-lead |
| 3   | Error boundaries barcha sahifalarda       | —           | 2      | P1       | frontend-lead |
| 4   | SEO meta tags (Landing page)              | —           | 1      | P2       | frontend-lead |
| 5   | Production deploy (Vercel)                | —           | 2      | P0       | frontend-lead |
| 6   | End-to-end oqim test (manual)             | —           | 3      | P0       | qa-engineer   |
| 7   | Bug fix va UI polish                      | —           | 3      | P0       | frontend-lead |

**Sprint Points**: 18
**Definition of Done**: Vercel da deploy, E2E oqim 100% ishlaydi, beta test tayyor

**Deliverables**:

- [ ] `/admin/analytics` — KPI widgetlar, foydalanuvchi o'sish grafik, savdo grafik
- [ ] Toast notification tizimi (sonner yoki shadcn toast)
- [ ] Error boundary komponentlar
- [ ] Vercel production deploy
- [ ] E2E manual test: Register → Login → Create Listing → Buy → Pay → Admin review
- [ ] Critical buglar tuzatilgan

---

## Sprint Summary

| Sprint       | Hafta         | Goal                | Points  | Epic(lar)        |
| ------------ | ------------- | ------------------- | ------- | ---------------- |
| **Sprint 0** | 1             | Foundation          | 12      | EPIC-01          |
| **Sprint 1** | 2–3           | Auth + Landing      | 25      | EPIC-02, EPIC-03 |
| **Sprint 2** | 4–5           | Seller Dashboard    | 28      | EPIC-04          |
| **Sprint 3** | 6–7           | Buyer + Marketplace | 22      | EPIC-05          |
| **Sprint 4** | 8–9           | Payments + Admin    | 26      | EPIC-06, EPIC-07 |
| **Sprint 5** | 10            | Analytics + Deploy  | 18      | EPIC-07, Polish  |
| **JAMI**     | **~10 hafta** | **MVP Ready**       | **131** | **7 Epic**       |

---

## Velocity Assumption

- 1 developer (frontend-lead) asosiy executor
- Haftasiga ~13–15 story point kapasiteti
- Sprint 0 va Sprint 5 qisqaroq (1 hafta) — setup va polish
- Sprint 2 eng og'iri (28 SP) — kerak bo'lsa 2.5 haftaga cho'zilishi mumkin

---

## Dependencies Diagram

```
Sprint 0: Foundation
    ├── Prisma Schema ──────────┐
    └── shadcn/ui + Layout ─────┤
                                ▼
Sprint 1: Auth + Landing ───────┐
    ├── Auth.js setup ──────────┤
    ├── Register/Login ─────────┤
    ├── Middleware ──────────────┤
    └── Landing Page ───────────┤
                                ▼
Sprint 2: Seller Dashboard ─────┐
    ├── Dashboard Layout ───────┤ (reused by Buyer + Admin)
    ├── Listing CRUD ───────────┤ (needed for Marketplace)
    └── Earnings ───────────────┤
                                ▼
Sprint 3: Buyer + Marketplace ──┐
    ├── Marketplace ────────────┤ (depends on Listings API)
    ├── Checkout ───────────────┤ (depends on Orders API)
    └── Payment Helpers ────────┤
                                ▼
Sprint 4: Payments + Admin ─────┐
    ├── Payme/Click ────────────┤ (depends on Checkout + Helpers)
    └── Admin CRUD ─────────────┤ (depends on all models)
                                ▼
Sprint 5: Polish + Deploy ──────→ Production 🚀
```

---

## Agent Coordination

| Sprint   | Chaqiriladigan Agent              | Vazifasi                           |
| -------- | --------------------------------- | ---------------------------------- |
| Sprint 0 | `#frontend-lead`                  | shadcn/ui, Prisma, papka tuzilmasi |
| Sprint 1 | `#frontend-lead`                  | Auth sahifalar, Landing page       |
| Sprint 2 | `#frontend-lead`                  | Seller dashboard, API endpointlar  |
| Sprint 3 | `#frontend-lead`                  | Buyer UI, marketplace, checkout    |
| Sprint 4 | `#frontend-lead`                  | To'lov integratsiya, Admin panel   |
| Sprint 5 | `#frontend-lead` + `#qa-engineer` | Polish, test, deploy               |

> **Eslatma**: Bu loyiha Next.js full-stack (API Routes) bo'lgani uchun `frontend-lead` backend API va frontend UI ni birgalikda yozadi. Alohida `backend-lead` kerak emas.

---

## Critical Path

**Eng muhim ketma-ketlik** (bu bloklansa, loyiha kechikadi):

```
Prisma Schema → Auth → Dashboard Layout → Listing CRUD → Marketplace → Checkout → Payment → Deploy
```

Bu zanjirdagi har bir element keyingisiga bog'liq. Agar Prisma Schema kechiksa, hamma narsa kechikadi. Agar Listing CRUD tayyor bo'lmasa, Marketplace ishlay olmaydi.

---

_Sprint Plan v1.0 — SolarShare MVP_
_Yaratilgan: 2025 | Taxminiy muddat: ~10 hafta_
