# Booking Platform - Folder Structure

Tam folder strukturu Feature-Sliced Design (FSD) metodologiyasına əsaslanır.

## Root Səviyyə

```
booking-platform/
├── admin-panel/          # Admin Panel (React + TS + Vite)
├── customer-app/         # Customer UI (Next.js 14)
└── README.md
```

***

## Admin Panel Strukturu

```
admin-panel/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/              # App başlanğıcı və global konfiqurasiya
│   ├── shared/           # Tamamilə təkrar istifadə olunan kod
│   ├── entities/         # Biznes obyektlərinin UI building blocks
│   ├── features/         # İstifadəçi əməlləri (user actions)
│   ├── widgets/          # Kompleks UI kompozisiyalar
│   ├── pages/            # Route-spsesifik səhifələr
│   ├── assets/           # Statik fayllar
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Layer-lərin Detalları

#### 1. `app/` - Application Layer
Applikasiyanın başlanğıcı, app-wide konfiqurasiya və providers.

```bash
app/
├── providers/
│   ├── QueryProvider.tsx      # TanStack Query setup
│   ├── ThemeProvider.tsx      # Tema və dizayn tokenlər
│   ├── I18nProvider.tsx       # Dil localizasiya
│   └── ToastProvider.tsx      # Global toast notifications
├── router/
│   ├── routes.ts              # createBrowserRouter konfiqurasiyası
│   └── guards/
│       ├── AuthGuard.tsx      # Role-based access control
│       └── BusinessGuard.tsx  # Multi-tenant yoxlama
├── layouts/
│   ├── MainLayout/
│   │   ├── component.tsx      # Sidebar + Topbar + Outlet
│   │   ├── styles.module.css
│   │   └── index.ts           # Public API (export only)
│   └── AuthLayout/
│       └── ...
├── App.tsx                    # Root component
└── index.ts                   # Public API
```

#### 2. `shared/` - Shared Layer
Tamamilə təkrar istifadə olunan, app-agnostic kod.

```bash
shared/
├── ui/                        # UI primitives
│   ├── Button/
│   │   ├── component.tsx
│   │   ├── types.ts
│   │   ├── styles.module.css
│   │   └── index.ts
│   ├── Input/
│   ├── Select/
│   ├── Card/
│   ├── Badge/
│   ├── Modal/
│   ├── Drawer/
│   ├── Toast/
│   ├── Skeleton/
│   ├── EmptyState/
│   └── index.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useMedia.ts
│   ├── useHotkeys.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── theme.ts               # Dizayn tokenlər
│   ├── queryClient.ts
│   └── dateUtils.ts
├── config/
│   ├── app.ts
│   ├── nav.ts
│   └── featureFlags.ts
├── types/
│   ├── common.ts
│   └── api.ts
├── utils/
│   ├── formatters.ts
│   └── validators.ts
└── mocks/
    ├── bookings.ts
    ├── customers.ts
    ├── latency.ts
    └── index.ts
```

#### 3. `entities/` - Entities Layer
Biznes obyektlərinin UI building blocks.

```bash
entities/
├── booking/
│   ├── model/
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── ui/
│   │   ├── BookingCard/
│   │   ├── BookingBadge/
│   │   └── BookingList/
│   ├── lib/
│   │   └── bookingUtils.ts
│   └── index.ts
├── customer/
│   ├── model/
│   ├── ui/
│   │   ├── CustomerCard/
│   │   └── CustomerAvatar/
│   └── index.ts
├── staff/
│   ├── model/
│   ├── ui/
│   │   ├── StaffCard/
│   │   └── StaffBadge/
│   └── index.ts
├── service/
│   ├── model/
│   ├── ui/
│   │   └── ServiceCard/
│   └── index.ts
├── location/
│   ├── model/
│   ├── ui/
│   │   └── LocationCard/
│   └── index.ts
└── slot/
    ├── model/
│   ├── ui/
│   │   └── SlotGrid/
└── index.ts
```

#### 4. `features/` - Features Layer
İstifadəçi əməlləri (user actions).

```bash
features/
├── auth/
│   ├── model/
│   │   ├── store.ts
│   │   └── types.ts
│   ├── ui/
│   │   ├── LoginForm/
│   │   └── LogoutButton/
│   ├── lib/
│   │   └── authUtils.ts
│   └── index.ts
├── onboarding/
│   ├── model/
│   ├── ui/
│   │   ├── BusinessTypeStep/
│   │   ├── SoloForm/
│   │   └── MultiForm/
│   └── index.ts
├── booking-create/
│   ├── model/
│   │   └── store.ts
│   ├── ui/
│   │   ├── Stepper/
│   │   ├── ServiceStep/
│   │   ├── StaffStep/
│   │   ├── DateTimeStep/
│   │   └── ConfirmStep/
│   ├── lib/
│   │   └── validation.ts
│   └── index.ts
├── booking-status/
│   ├── model/
│   ├── ui/
│   │   ├── StatusChangeModal/
│   │   └── BulkStatusUpdate/
│   ├── lib/
│   │   └── statusUtils.ts
│   └── index.ts
├── staff-invite/
│   ├── model/
│   ├── ui/
│   │   ├── InviteModal/
│   │   └── TokenDisplay/
│   └── index.ts
├── filters/
│   ├── model/
│   │   └── filterStore.ts
│   ├── ui/
│   │   ├── FilterChips/
│   │   └── SavedViews/
│   └── index.ts
└── global-search/
    ├── model/
│   ├── ui/
│   │   └── CommandPalette/
└── index.ts
```

#### 5. `widgets/` - Widgets Layer
Bir neçə feature və entity birləşdirən kompleks UI kompozisiyalar.

```bash
widgets/
├── Sidebar/
│   ├── component.tsx
│   ├── styles.module.css
│   └── index.ts
├── Topbar/
│   └── index.ts
├── DataTable/
│   ├── component.tsx
│   ├── hooks/
│   │   └── useTableSort.ts
│   └── index.ts
├── BookingCalendar/
│   ├── component.tsx
│   ├── lib/
│   │   └── calendarUtils.ts
│   └── index.ts
├── Notifications/
│   └── index.ts
└── QuickActions/
    └── index.ts
```

#### 6. `pages/` - Pages Layer
Route-spsesifik səhifə komponentləri.

```bash
pages/
├── login/
│   ├── component.tsx
│   └── index.ts
├── dashboard/
│   ├── component.tsx
│   ├── lib/
│   │   └── dashboardLoader.ts
│   └── index.ts
├── bookings/
│   ├── component.tsx
│   ├── lib/
│   │   └── bookingsLoader.ts
│   └── index.ts
├── customers/
│   ├── component.tsx
│   └── index.ts
├── staff/
│   ├── component.tsx
│   └── index.ts
├── services/
│   ├── component.tsx
│   └── index.ts
├── slots/
│   ├── component.tsx
│   └── index.ts
├── locations/
│   ├── component.tsx
│   └── index.ts
└── not-found/
    ├── component.tsx
    └── index.ts
```

#### 7. `assets/` - Statik Fayllar

```bash
assets/
├── icons/                     # SVG icons
├── images/                    # Logo, background
└── styles/
    └── globals.css            # Global styles
```

***

## Customer App Strukturu (Next.js 14)

```
customer-app/
├── public/
│   └── images/
├── src/
│   ├── app/                   # Next.js 14 App Router
│   │   ├── (public)/
│   │   │   └── [business]/
│   │   │       ├── page.tsx   # Business home (services list)
│   │   │       └── book/
│   │   │           └── page.tsx # Booking stepper
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (me)/
│   │   │   └── bookings/
│   │   │       └── page.tsx   # Customer booking history
│   │   └── layout.tsx         # Root layout
│   ├── shared/
│   │   ├── ui/                # Reusable UI (shadcn primitives)
│   │   ├── mocks/             # Mock data
│   │   └── lib/
│   │       └── utils.ts
│   ├── features/
│   │   └── booking-stepper/
│   │       ├── ui/
│   │       │   ├── StepIndicator.tsx
│   │       │   ├── ServiceStep.tsx
│   │       │   ├── StaffStep.tsx
│   │       │   ├── DateTimeStep.tsx
│   │       │   └── ConfirmStep.tsx
│   │       ├── model/
│   │       │   └── stepStore.ts
│   │       └── lib/
│   │           └── validation.ts
│   └── widgets/
│       ├── Header/
│       ├── Footer/
│       ├── TrustBadges/
│       └── ReviewsCarousel/
├── package.json
└── next.config.js
```

***

## Dependency Qaydaları (İmport Hierarxiyası)

Aşağı layer-lər yuxarı layer-lərdən import edə bilməz.

```
app → pages → widgets → features → entities → shared
```

| Layer | Asılı Olduğu Layer-lər | Nümunə Import |
|-------|------------------------|---------------|
| **app** | Heç kim | `import { router } from './router/routes'` |
| **pages** | widgets, features, entities, shared | `import { BookingCalendar } from '@/widgets/BookingCalendar'` |
| **widgets** | features, entities, shared | `import { StatusChangeModal } from '@/features/booking-status'` |
| **features** | entities, shared | `import { BookingCard } from '@/entities/booking'` |
| **entities** | shared | `import { Button } from '@/shared/ui'` |
| **shared** | Heç kim | `import { useDebounce } from './hooks/useDebounce'` |

Bu qayda circular dependency-lərin qarşısını alır və kodun skalabel olmasını təmin edir.