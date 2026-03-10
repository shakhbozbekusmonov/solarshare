# Epic Breakdown — SolarShare MVP

---

## EPIC-01: Project Foundation & Infrastructure

**Goal**: Loyihaning texnik asosini yaratish — barcha agentlar ishlay oladigan muhit tayyorlash
**Success Metric**: Dev server ishlaydi, DB connected, CI lint passing, barcha agentlar scaffold ustida ishlashni boshlashi mumkin
**Priority**: P0 | **Effort**: M

### STORY-01-01: Next.js loyiha konfiguratsiyasi

**As a** developer **I want** loyiha to'g'ri sozlangan bo'lishini **so that** jamoa a'zolari darhol ishlay boshlashi mumkin

#### Acceptance Criteria

- GIVEN loyiha WHEN `npm run dev` THEN localhost:3000 da sahifa ochiladi
- GIVEN loyiha WHEN `npm run build` THEN xatosiz build bo'ladi
- GIVEN loyiha WHEN `npm run lint` THEN ESLint xatolar ko'rsatmaydi

#### Definition of Done

- [x] Next.js 16 + TypeScript scaffold (allaqachon mavjud)
- [ ] Tailwind CSS v4 sozlangan (allaqachon mavjud)
- [ ] shadcn/ui o'rnatilgan va konfiguratsiya qilingan
- [ ] Path aliases (`@/`) sozlangan
- [ ] `.env.example` fayli yaratilgan
- [ ] `.gitignore` yangilangan

**Story Points**: 2 | **Owner**: frontend-lead

---

### STORY-01-02: Prisma ORM + PostgreSQL sozlash

**As a** developer **I want** ma'lumotlar bazasi ulanishini **so that** modellarni yaratish va migration qilish mumkin

#### Acceptance Criteria

- GIVEN Prisma WHEN `npx prisma migrate dev` THEN migrasiya muvaffaqiyatli bajariladi
- GIVEN Prisma WHEN `npx prisma studio` THEN DB GUI ochiladi
- GIVEN PostgreSQL WHEN ulanish THEN connection pooling ishlaydi

#### Definition of Done

- [ ] Prisma o'rnatilgan va `prisma/schema.prisma` yaratilgan
- [ ] PostgreSQL docker-compose yoki local instance tayyor
- [ ] `lib/prisma.ts` — singleton Prisma Client
- [ ] Initial migration yaratilgan

**Story Points**: 3 | **Owner**: frontend-lead

---

### STORY-01-03: Prisma Schema — barcha modellar

**As a** developer **I want** barcha asosiy modellar aniqlangan bo'lishini **so that** API va UI uchun type-safe query yozish mumkin

#### Acceptance Criteria

- GIVEN schema WHEN migrate qilinsa THEN User, Listing, Order, Transaction jadvallar yaratiladi
- GIVEN schema WHEN Prisma generate THEN TypeScript tiplari to'g'ri hosil bo'ladi
- GIVEN User modeli WHEN ko'rilsa THEN role enum (SELLER, BUYER, BOTH, ADMIN) mavjud

#### Definition of Done

- [ ] User modeli: id, email, password, name, role, isVerified, isBlocked, createdAt, updatedAt
- [ ] Listing modeli: id, sellerId, title, description, totalKwh, availableKwh, pricePerKwh, currency, period, status, location, createdAt, updatedAt, expiresAt
- [ ] Order modeli: id, buyerId, listingId, requestedKwh, totalPrice, status, paymentMethod, paymentId, createdAt, updatedAt
- [ ] Transaction modeli: id, orderId, amount, currency, status, providerResponse, createdAt
- [ ] Enumlar: Role, ListingStatus, OrderStatus, PaymentMethod, Currency, Period
- [ ] Relatsiyalar to'g'ri aniqlangan (foreign keys, cascades)
- [ ] Seed script (`prisma/seed.ts`) — admin user + demo data

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-01-04: Loyiha papka tuzilmasi

**As a** developer **I want** aniq papka tuzilmasi **so that** kod toza va mantiqiy joylashgan bo'lsin

#### Acceptance Criteria

- GIVEN papka tuzilmasi WHEN ko'rilsa THEN PRD dagi arxitekturaga mos keladi
- GIVEN yangi fayl WHEN yaratilsa THEN qayerga joylash aniq

#### Definition of Done

- [ ] `app/(auth)/` — login, register, forgot-password
- [ ] `app/(dashboard)/seller/` — overview, listings, earnings
- [ ] `app/(dashboard)/buyer/` — marketplace, orders
- [ ] `app/(dashboard)/admin/` — users, listings, transactions, analytics
- [ ] `app/api/` — auth, listings, orders, payments
- [ ] `components/ui/` — shadcn komponentlar
- [ ] `components/forms/` — form komponentlar
- [ ] `components/dashboard/` — dashboard komponentlar
- [ ] `lib/` — prisma.ts, auth.ts, utils.ts, validations/
- [ ] `types/` — index.ts, global tiplar

**Story Points**: 2 | **Owner**: frontend-lead

---

## EPIC-02: Authentication & Authorization

**Goal**: Foydalanuvchilar xavfsiz ro'yxatdan o'tishi va kirishi, rolga asoslangan huquqlar ishlashi
**Success Metric**: Register → Login → Dashboard → Logout oqimi 100% ishlaydi, noto'g'ri rol bilan himoyalangan sahifaga kirish 403 qaytaradi
**Priority**: P0 | **Effort**: H

### STORY-02-01: Auth.js v5 sozlash

**As a** developer **I want** Auth.js integratsiyasi **so that** session boshqaruvi tayyor bo'lsin

#### Acceptance Criteria

- GIVEN Auth.js WHEN sozlansa THEN Credentials provider ishlaydi
- GIVEN session WHEN tekshirilsa THEN user.id va user.role mavjud
- GIVEN JWT WHEN yaratilsa THEN maxfiy kalit `.env` dan olinadi

#### Definition of Done

- [ ] `auth.ts` — Auth.js v5 konfiguratsiya
- [ ] Credentials provider (email + password)
- [ ] JWT callback — role va id qo'shish
- [ ] Session callback — role va id expose qilish
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `middleware.ts` — protected routes

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-02-02: Register sahifasi va API

**As a** yangi foydalanuvchi **I want** ro'yxatdan o'tish **so that** platformadan foydalanishni boshlashim mumkin

#### Acceptance Criteria

- GIVEN `/register` sahifasi WHEN form to'ldirilsa THEN ism, email, parol, rol kiritiladi
- GIVEN valid form WHEN yuborilsa THEN foydalanuvchi yaratiladi va login sahifasiga redirect bo'ladi
- GIVEN mavjud email WHEN register qilinsa THEN "Email allaqachon ro'yxatdan o'tgan" xatosi
- GIVEN parol WHEN saqlanayotganda THEN bcrypt (salt 12) bilan hash qilinadi
- GIVEN form WHEN validation xatosi THEN real-time xato xabarlari ko'rsatiladi

#### Definition of Done

- [ ] `/register` sahifa — react-hook-form + zod validation
- [ ] `POST /api/auth/register` endpoint
- [ ] Parol bcrypt hashing
- [ ] Email uniqueness tekshiruvi
- [ ] Zod schema: RegisterSchema
- [ ] Success → login sahifasiga redirect
- [ ] Error toast xabarlari

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-02-03: Login sahifasi va API

**As a** ro'yxatdan o'tgan foydalanuvchi **I want** kirish **so that** o'z dashboardimga kirishim mumkin

#### Acceptance Criteria

- GIVEN `/login` sahifasi WHEN email va parol kiritilsa THEN sign-in qilinadi
- GIVEN to'g'ri credentials WHEN login THEN rolga qarab dashboard redirect (seller/buyer/admin)
- GIVEN noto'g'ri parol WHEN login THEN "Email yoki parol noto'g'ri" xatosi
- GIVEN blocked user WHEN login THEN "Akkaunt bloklangan" xatosi

#### Definition of Done

- [ ] `/login` sahifa — react-hook-form + zod
- [ ] Auth.js signIn call
- [ ] Role-based redirect logic
- [ ] "Meni eslab qol" checkbox
- [ ] Error handling va toast
- [ ] Forgot password linkka havola

**Story Points**: 3 | **Owner**: frontend-lead

---

### STORY-02-04: Middleware — Role-based Route Protection

**As a** developer **I want** route himoyasi **so that** faqat ruxsat berilgan foydalanuvchilar o'z sahifalariga kirsin

#### Acceptance Criteria

- GIVEN unauthorized user WHEN `/seller/*` ga kirsa THEN `/login` ga redirect
- GIVEN Buyer roli WHEN `/admin/*` ga kirsa THEN 403 yoki redirect
- GIVEN Admin roli WHEN istalgan sahifaga kirsa THEN kirish ruxsat etiladi
- GIVEN BOTH roli WHEN seller yoki buyer sahifaga kirsa THEN ikkalasiga ham ruxsat

#### Definition of Done

- [ ] `middleware.ts` — route matching va rol tekshiruvi
- [ ] Protected route patterns: `/seller/*`, `/buyer/*`, `/admin/*`
- [ ] Session-based auth check
- [ ] Unauthorized → login redirect
- [ ] Forbidden → 403 sahifa yoki dashboard redirect

**Story Points**: 3 | **Owner**: frontend-lead

---

### STORY-02-05: Forgot Password oqimi

**As a** foydalanuvchi **I want** parolni tiklash **so that** parolni unutsam akkauntga qayta kirishim mumkin

#### Acceptance Criteria

- GIVEN `/forgot-password` WHEN email kiritilsa THEN tiklash havolasi yuboriladi (mock MVP uchun)
- GIVEN email WHEN bazada mavjud emas THEN xato xabari ko'rsatilmaydi (xavfsizlik)

#### Definition of Done

- [ ] `/forgot-password` sahifasi
- [ ] `POST /api/auth/forgot-password` — token yaratish (MVP: console log)
- [ ] Token-based password reset logic (asosiy flow)
- [ ] Xavfsizlik: email mavjudligi oshkor qilinmaydi

**Story Points**: 3 | **Owner**: frontend-lead

---

## EPIC-03: Landing Page

**Goal**: Yangi tashrif buyuruvchilar platformani tushunishi va ro'yxatdan o'tishga undashi
**Success Metric**: Landing page FCP < 2s, CTA tugmalar register/login sahifalariga to'g'ri yo'naltiradi
**Priority**: P0 | **Effort**: M

### STORY-03-01: Hero Section + Navigation

**As a** tashrif buyuruvchi **I want** platformaning maqsadini tezda tushunish **so that** qiziqishim ortsin

#### Acceptance Criteria

- GIVEN landing page WHEN ochilsa THEN sarlavha, tavsif, 2 ta CTA tugma ko'rinadi
- GIVEN "Sotishni Boshlash" CTA WHEN bosilsa THEN `/register?role=seller` ga yo'naladi
- GIVEN "Energiya Sotib Olish" CTA WHEN bosilsa THEN `/register?role=buyer` ga yo'naladi
- GIVEN sahifa WHEN FCP o'lchansa THEN < 2 soniya

#### Definition of Done

- [ ] Navbar: Logo, nav links, Login/Register tugmalar
- [ ] Hero section: sarlavha, tavsif, 2 CTA
- [ ] Responsive: mobile va desktop
- [ ] Animatsiya (subtle fade-in)

**Story Points**: 3 | **Owner**: frontend-lead

---

### STORY-03-02: How it Works + Stats + FAQ + Footer

**As a** tashrif buyuruvchi **I want** platformaning ishlash mexanizmini va statistikasini ko'rish **so that** ishonch hosil qilsam

#### Acceptance Criteria

- GIVEN "Qanday ishlaydi" section WHEN ko'rilsa THEN 3 bosqichli tushuntirish bor
- GIVEN stats section WHEN ko'rilsa THEN foydalanuvchilar, kWh, CO₂ raqamlari bor
- GIVEN FAQ WHEN savolga bosilsa THEN javob accordion bilan ochiladi
- GIVEN Footer WHEN ko'rilsa THEN aloqa, ijtimoiy tarmoqlar, huquqiy havolalar bor

#### Definition of Done

- [ ] "Qanday Ishlaydi" — 3 ta step kartalar
- [ ] Stats section — animated counters (yoki static)
- [ ] FAQ accordion — kamida 5 ta savol/javob
- [ ] Footer — aloqa, social links, legal
- [ ] Responsive dizayn

**Story Points**: 3 | **Owner**: frontend-lead

---

## EPIC-04: Seller Dashboard

**Goal**: Seller energiya listinglarini yaratishi, boshqarishi va daromadini kuzatishi
**Success Metric**: Seller listing yaratish → faollashtirish → buyer ko'rishi mumkin; daromad sahifasida to'lovlar ko'rinadi
**Priority**: P0 | **Effort**: H

### STORY-04-01: Dashboard Layout (Umumiy)

**As a** ro'yxatdan o'tgan foydalanuvchi **I want** umumiy dashboard layout **so that** barcha dashboard sahifalari bir xil ko'rinishda bo'lsin

#### Acceptance Criteria

- GIVEN dashboard WHEN ochilsa THEN sidebar, header, main content area ko'rinadi
- GIVEN sidebar WHEN ko'rilsa THEN rolga qarab menu itemlar boshqacha
- GIVEN mobil WHEN ko'rilsa THEN sidebar hamburger menu orqali ochiladi

#### Definition of Done

- [ ] Dashboard layout component — sidebar + header + content
- [ ] Sidebar navigation — rolga qarab filtr
- [ ] User avatar + dropdown menu (profil, logout)
- [ ] Bildirishnomalar icon (placeholder)
- [ ] Mobile responsive — sidebar toggle

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-04-02: Seller Overview sahifasi

**As a** seller **I want** umumiy ko'rsatkichlarni ko'rish **so that** biznesim holatini tezda baholashim mumkin

#### Acceptance Criteria

- GIVEN `/seller/overview` WHEN ochilsa THEN 4 ta widget ko'rinadi: daromad, sotilgan kWh, faol listinglar, oxirgi tranzaksiyalar
- GIVEN widgetlar WHEN ko'rilsa THEN real ma'lumotlar API dan keladi

#### Definition of Done

- [ ] Overview sahifasi
- [ ] Stat widgetlar: umumiy daromad, bu oyda sotilgan kWh, faol listinglar soni
- [ ] Oxirgi tranzaksiyalar jadvali (so'nggi 5 ta)
- [ ] `GET /api/seller/stats` endpoint
- [ ] Loading skeleton states

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-04-03: Listing CRUD — yaratish va ko'rish

**As a** seller **I want** yangi listing yaratish **so that** ortiqcha energiyamni bozorga qo'yishim mumkin

#### Acceptance Criteria

- GIVEN `/seller/listings` WHEN ochilsa THEN barcha listinglar tabs bilan ko'rinadi (Active, Pending, Sold, Cancelled)
- GIVEN "Yangi listing" form WHEN to'ldirilsa THEN kWh, narx, davr, tavsif, joylashuv kiritiladi
- GIVEN valid form WHEN yuborilsa THEN listing PENDING holat bilan saqlanadi
- GIVEN listing yaratilsa WHEN bozorda ko'rilsa THEN kartochka sifatida ko'rinadi

#### Definition of Done

- [ ] Listinglar sahifasi — tabs (Active, Pending, Sold, Cancelled)
- [ ] Listing card component
- [ ] "Yangi listing" dialog/form — react-hook-form + zod
- [ ] `POST /api/listings` — listing yaratish
- [ ] `GET /api/listings?sellerId=` — seller listinglarini olish
- [ ] Form validation: kWh > 0, narx > 0, davr majburiy

**Story Points**: 8 | **Owner**: frontend-lead

---

### STORY-04-04: Listing CRUD — tahrirlash va o'chirish

**As a** seller **I want** listinglarni tahrirlash va o'chirish **so that** ma'lumotlarni yangilab turishim mumkin

#### Acceptance Criteria

- GIVEN listing WHEN "Tahrirlash" bosilsa THEN pre-filled form ochiladi
- GIVEN tahrirlangan form WHEN saqlanilsa THEN listing yangilanadi
- GIVEN listing WHEN "O'chirish" bosilsa THEN tasdiqlash so'raladi va o'chiriladi
- GIVEN ACTIVE listing WHEN "Faolsizlashtirish" bosilsa THEN CANCELLED holatiga o'tadi

#### Definition of Done

- [ ] Edit form — mavjud ma'lumotlar bilan pre-fill
- [ ] `PUT /api/listings/[id]` — yangilash (faqat o'z listingi)
- [ ] `DELETE /api/listings/[id]` — o'chirish (faqat o'z listingi)
- [ ] Status o'zgartirish (activate/deactivate)
- [ ] Ownership tekshiruvi backendda

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-04-05: Seller Earnings sahifasi

**As a** seller **I want** daromadlarimni ko'rish **so that** moliyaviy holatimni kuzatishim mumkin

#### Acceptance Criteria

- GIVEN `/seller/earnings` WHEN ochilsa THEN daromad grafigi va tranzaksiyalar ro'yxati ko'rinadi
- GIVEN grafik WHEN ko'rilsa THEN kunlik/haftalik/oylik o'tkazish mumkin
- GIVEN tranzaksiyalar WHEN ko'rilsa THEN sana, miqdor, holat ko'rinadi

#### Definition of Done

- [ ] Earnings sahifasi
- [ ] Daromad grafigi (Recharts) — kunlik, haftalik, oylik toggle
- [ ] Tranzaksiyalar jadvali — paginated
- [ ] `GET /api/seller/earnings` — earning data
- [ ] Loading states

**Story Points**: 5 | **Owner**: frontend-lead

---

## EPIC-05: Buyer Dashboard & Marketplace

**Goal**: Buyer mavjud energiya takliflarini topishi, buyurtma berishi va to'lov qilishi
**Success Metric**: Buyer bozordan listing topib, checkout qilib, to'lov qila oladi
**Priority**: P0 | **Effort**: H

### STORY-05-01: Marketplace sahifasi

**As a** buyer **I want** mavjud takliflarni ko'rish **so that** o'zimga mos energiya manbai topishim mumkin

#### Acceptance Criteria

- GIVEN `/buyer/marketplace` WHEN ochilsa THEN kartochkalar/grid ko'rinishda listinglar chiqadi
- GIVEN listinglar WHEN 20+ bo'lsa THEN pagination ishlaydi (20/sahifa)
- GIVEN filter WHEN narx bo'yicha tanlanilsa THEN ro'yxat filtrlangan
- GIVEN qidiruv WHEN matn kiritilsa THEN title va description bo'yicha filter

#### Definition of Done

- [ ] Marketplace sahifasi — grid layout
- [ ] Listing card: seller ismi, kWh, narx, davr, "Sotib Olish" tugma
- [ ] Filter panel: narx range, miqdor, mavjudlik davri
- [ ] Search input — debounced qidiruv
- [ ] `GET /api/listings` — public endpoint, pagination, filters
- [ ] Pagination component
- [ ] Loading skeleton

**Story Points**: 8 | **Owner**: frontend-lead

---

### STORY-05-02: Checkout oqimi

**As a** buyer **I want** buyurtma berish **so that** tanlagan energiyam uchun to'lov qilishim mumkin

#### Acceptance Criteria

- GIVEN listing WHEN "Sotib Olish" bosilsa THEN checkout sahifasi/modal ochiladi
- GIVEN checkout WHEN miqdor tanlansa THEN narx avtomatik hisoblanadi
- GIVEN checkout WHEN to'lov usuli tanlansa va tasdiqlanasa THEN order yaratiladi
- GIVEN order yaratilganda WHEN to'lov provider sahifasiga redirect bo'lsa THEN to'lov oqimi boshlanadi

#### Definition of Done

- [ ] Checkout modal/sahifa
- [ ] Miqdor input (slider yoki number) — max = availableKwh
- [ ] Narx kalkulyatsiya (miqdor × pricePerKwh)
- [ ] To'lov usuli tanlash (Payme/Click/Stripe radio)
- [ ] `POST /api/orders` — order yaratish (PENDING holat)
- [ ] Order yaratilgandan so'ng to'lov sahifasiga redirect
- [ ] Validation: miqdor > 0, miqdor <= availableKwh

**Story Points**: 8 | **Owner**: frontend-lead

---

### STORY-05-03: Buyer Orders sahifasi

**As a** buyer **I want** buyurtmalarim tarixini ko'rish **so that** oldingi xaridlarimni kuzatishim mumkin

#### Acceptance Criteria

- GIVEN `/buyer/orders` WHEN ochilsa THEN buyurtmalar tabs bilan ko'rinadi (Active, Completed, Cancelled)
- GIVEN buyurtma WHEN tafsilotlari ko'rilsa THEN sana, miqdor, narx, seller, holat bor

#### Definition of Done

- [ ] Orders sahifasi — tabs
- [ ] Order card/row: sana, listing title, miqdor, narx, holat
- [ ] `GET /api/orders?buyerId=` — buyer buyurtmalari
- [ ] Empty state — "Hali buyurtma yo'q"
- [ ] Loading skeleton

**Story Points**: 3 | **Owner**: frontend-lead

---

## EPIC-06: Payment Integration

**Goal**: Xavfsiz to'lov oqimini amalga oshirish — kamida bitta mahalliy provider
**Success Metric**: Buyer to'lov qiladi → webhook callback keladi → order PAID holatiga o'tadi → seller earnings yangilanadi
**Priority**: P0 | **Effort**: H

### STORY-06-01: Payme integratsiya

**As a** buyer **I want** Payme orqali to'lov qilish **so that** mahalliy karta bilan xarid qilishim mumkin

#### Acceptance Criteria

- GIVEN order WHEN Payme tanlansa THEN Payme checkout sahifasiga redirect bo'ladi
- GIVEN to'lov WHEN muvaffaqiyatli bo'lsa THEN webhook callback orqali order PAID ga o'tadi
- GIVEN to'lov WHEN muvaffaqiyatsiz bo'lsa THEN order CANCELLED ga o'tadi
- GIVEN webhook WHEN kelsa THEN HMAC signature tekshiriladi

#### Definition of Done

- [ ] `POST /api/payments/payme` — to'lov sessiya yaratish
- [ ] `POST /api/payments/payme/callback` — webhook handler
- [ ] HMAC signature verification
- [ ] Order status update (PENDING → PAID)
- [ ] Listing availableKwh kamaytirish
- [ ] Transaction yozuvi yaratish
- [ ] Xato holatlari uchun handling

**Story Points**: 8 | **Owner**: frontend-lead

---

### STORY-06-02: Click integratsiya

**As a** buyer **I want** Click orqali to'lov qilish **so that** muqobil to'lov usuli mavjud bo'lsin

#### Acceptance Criteria

- GIVEN order WHEN Click tanlansa THEN Click checkout ga redirect bo'ladi
- GIVEN webhook WHEN kelsa THEN signature tekshiriladi va order yangilanadi

#### Definition of Done

- [ ] `POST /api/payments/click` — to'lov sessiya yaratish
- [ ] `POST /api/payments/click/callback` — webhook handler
- [ ] Signature verification
- [ ] Order va Transaction yaratish/yangilash

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-06-03: To'lov umumiy infratuzilmasi

**As a** developer **I want** to'lov tizimining umumiy qismlarini ajratish **so that** har bir provider uchun kod takrorlanmasin

#### Acceptance Criteria

- GIVEN har qanday provider WHEN to'lov muvaffaqiyatli THEN bir xil Order/Transaction update logic ishlatiladi
- GIVEN to'lov WHEN xato bo'lsa THEN log yoziladi va foydalanuvchiga xabar beriladi

#### Definition of Done

- [ ] `lib/payments/index.ts` — umumiy to'lov utility
- [ ] Order status update helper
- [ ] Transaction yaratish helper
- [ ] Listing availableKwh update helper
- [ ] Error logging

**Story Points**: 3 | **Owner**: frontend-lead

---

## EPIC-07: Admin Dashboard

**Goal**: Admin platformani to'liq boshqarishi — foydalanuvchilar, listinglar, tranzaksiyalar, analitika
**Success Metric**: Admin har qanday foydalanuvchini bloklashi, listingni moderatsiya qilishi, tranzaksiyalarni ko'rishi mumkin
**Priority**: P1 | **Effort**: H

### STORY-07-01: Admin Users sahifasi

**As an** admin **I want** barcha foydalanuvchilarni ko'rish va boshqarish **so that** platformani moderatsiya qilishim mumkin

#### Acceptance Criteria

- GIVEN `/admin/users` WHEN ochilsa THEN foydalanuvchilar jadvali ko'rinadi
- GIVEN jadval WHEN qidirilsa THEN ism yoki email bo'yicha filter ishlaydi
- GIVEN foydalanuvchi WHEN "Bloklash" bosilsa THEN isBlocked = true bo'ladi
- GIVEN foydalanuvchi WHEN rol o'zgartirilsa THEN yangi rol saqlanadi

#### Definition of Done

- [ ] Users sahifasi — data table (sortable, searchable)
- [ ] `GET /api/admin/users` — pagination, search, filter
- [ ] `PATCH /api/admin/users/[id]` — rol o'zgartirish, bloklash
- [ ] Tasdiqlash modal (bloklash uchun)
- [ ] Admin middleware tekshiruvi

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-07-02: Admin Listings sahifasi

**As an** admin **I want** barcha listinglarni ko'rish va moderatsiya qilish **so that** sifatsiz takliflarni rad etishim mumkin

#### Acceptance Criteria

- GIVEN `/admin/listings` WHEN ochilsa THEN barcha listinglar (status bo'yicha tabs) ko'rinadi
- GIVEN PENDING listing WHEN "Tasdiqlash" bosilsa THEN ACTIVE holatiga o'tadi
- GIVEN listing WHEN "Rad etish" bosilsa THEN CANCELLED holatiga o'tadi

#### Definition of Done

- [ ] Admin listings sahifasi — tabs (All, Pending, Active, Cancelled)
- [ ] `GET /api/admin/listings` — barcha listinglar
- [ ] `PATCH /api/admin/listings/[id]` — status o'zgartirish
- [ ] Tasdiqlash/rad etish tugmalari bilan action column

**Story Points**: 3 | **Owner**: frontend-lead

---

### STORY-07-03: Admin Transactions sahifasi

**As an** admin **I want** barcha to'lovlar tarixini ko'rish **so that** moliyaviy nazoratni olib borishim mumkin

#### Acceptance Criteria

- GIVEN `/admin/transactions` WHEN ochilsa THEN barcha tranzaksiyalar jadvali ko'rinadi
- GIVEN jadval WHEN "Eksport" bosilsa THEN CSV fayl yuklab olinadi
- GIVEN filter WHEN sana oralig'i tanlansa THEN faqat o'sha davrning tranzaksiyalari ko'rinadi

#### Definition of Done

- [ ] Transactions sahifasi — data table
- [ ] `GET /api/admin/transactions` — pagination, date filter
- [ ] CSV eksport tugmasi
- [ ] Sana filter (date range picker)

**Story Points**: 5 | **Owner**: frontend-lead

---

### STORY-07-04: Admin Analytics sahifasi

**As an** admin **I want** platforma statistikasini grafiklar bilan ko'rish **so that** o'sish dinamikasini tushunishim mumkin

#### Acceptance Criteria

- GIVEN `/admin/analytics` WHEN ochilsa THEN KPI widgetlar va grafiklar ko'rinadi
- GIVEN grafiklar WHEN ko'rilsa THEN foydalanuvchilar o'sishi, kWh savdosi, daromad ko'rinadi

#### Definition of Done

- [ ] Analytics sahifasi
- [ ] KPI widgetlar: jami foydalanuvchilar, jami kWh, jami daromad, faol listinglar
- [ ] Foydalanuvchilar o'sish grafigi (Recharts)
- [ ] Oylik savdo grafigi
- [ ] `GET /api/admin/analytics` — aggregated stats

**Story Points**: 5 | **Owner**: frontend-lead

---

## Risk Register

| Risk                            | Probability | Impact   | Mitigation                                           | Owner         |
| ------------------------------- | ----------- | -------- | ---------------------------------------------------- | ------------- |
| Payme/Click sandbox tayyor emas | Medium      | High     | MVP da mock to'lov flow, keyinroq real integratsiya  | PM            |
| Scope creep                     | High        | Medium   | Qat'iy WON'T HAVE ro'yxati, PRD ga amal qilish       | PM            |
| PostgreSQL hosting muammolari   | Low         | High     | Docker Compose local dev, Vercel Postgres prod       | frontend-lead |
| Auth session xavfsizlik teshigi | Medium      | High     | Auth.js best practices, CSRF himoyasi, rate limiting | frontend-lead |
| To'lov webhook xavfsizligi      | Medium      | Critical | HMAC signature tekshiruvi, IP whitelist              | frontend-lead |
| Katta hajmda listinglar (100+)  | Medium      | Medium   | DB indexlar, pagination, caching                     | frontend-lead |
