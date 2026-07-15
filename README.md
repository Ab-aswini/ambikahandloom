# 🪡 Ambika Handloom

**Authentic Sambalpuri Ikat Silk Sarees, Ladies Wear & Handloom Fabric**

A premium e-commerce platform for authentic Sambalpuri Ikat products, sourced directly from master artisans of Odisha, India. Built with Next.js 15, Tailwind CSS v4, Framer Motion, and Supabase.

---

## ✨ Features

- **Product Catalog** — 3 collections: Sarees, Ladies Wear, Cut Pieces with filtering and grid/list views
- **Product Detail Pages** — Rich SEO with JSON-LD (Product, BreadcrumbList, FAQPage, CreativeWork), image galleries, artisan stories
- **Shopping Cart** — Add to cart with persistent localStorage storage across page refreshes
- **Checkout Flow** — Manual UPI/Bank payment verification with WhatsApp integration
- **Order Tracking** — Self-service order tracking by Order ID
- **Admin Panel** — Protected dashboard with order management, product reordering, review moderation, and site settings
- **Dynamic Promotions** — Admin-configurable promotional section for any occasion/festival (Diwali, Mother's Day, etc.)
- **WhatsApp Integration** — Pre-filled messages for product enquiry, custom orders, and payment verification
- **SEO** — Comprehensive metadata, sitemap, robots.txt, structured data (Organization, WebSite, FAQPage)
- **Security** — CSP headers, HSTS, X-Frame-Options, env validation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) + localStorage fallback |
| Fonts | Google Fonts (Cormorant Garamond + Inter) |
| Icons | Lucide React |
| Deployment | Vercel / Netlify |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/Ab-aswini/ambikahandloom.git
cd ambikahandloom
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase Dashboard → Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from same location
- `SUPABASE_SERVICE_KEY` — from same location (service role key)
- `NEXT_PUBLIC_ADMIN_PASSWORD` — your chosen admin password

### 3. Setup Database

Run the SQL migrations in order via Supabase SQL Editor:
1. `supabase/migrations/001_initial.sql` — Creates tables, RLS policies, seeds products
2. `supabase/migrations/002_categories_expansion.sql` — Adds sections (sarees, ladies-wear, cut-pieces)
3. `supabase/migrations/003_dynamic_promotions.sql` — Adds configurable promotion columns

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Access Admin Panel

Navigate to `/admin` and enter your admin password.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with hero, promotions, featured products
│   ├── catalog/
│   │   ├── page.tsx          # Catalog with section/category filtering
│   │   ├── layout.tsx        # SEO metadata for catalog
│   │   └── [id]/             # Dynamic product detail pages (SSG)
│   ├── checkout/page.tsx     # Secure checkout with form validation
│   ├── track/page.tsx        # Self-service order tracking
│   ├── admin/                # Admin panel (protected)
│   │   ├── page.tsx          # Dashboard with stats
│   │   ├── orders/page.tsx   # Order management
│   │   ├── products/page.tsx # Product management
│   │   ├── reviews/page.tsx  # Review moderation
│   │   └── settings/page.tsx # Site settings (payment, promotions)
│   ├── robots.ts             # Dynamic robots.txt
│   ├── sitemap.ts            # Dynamic sitemap
│   └── layout.tsx            # Root layout with global SEO & JSON-LD
├── components/
│   ├── Navbar.tsx            # Sticky auto-hide navigation
│   ├── Footer.tsx            # Newsletter, contact, links
│   ├── ProductCard.tsx       # Grid/Editorial layout variants
│   ├── CartDrawer.tsx        # Slide-out cart drawer
│   ├── WhatsAppFAB.tsx       # Floating WhatsApp button
│   └── ClientLayout.tsx      # Context providers wrapper
├── lib/
│   ├── admin-store.ts        # Data layer (Supabase + localStorage)
│   ├── cart-context.tsx       # Cart state with persistence
│   ├── toast-context.tsx      # Toast notification system
│   ├── products.ts           # Static product definitions
│   ├── supabase.ts           # Supabase client initialization
│   └── env.ts                # Environment variable validation
└── public/
    └── images/               # Product images
```

---

## 🔐 Admin Features

| Feature | Description |
|---------|-------------|
| Dashboard | Revenue, order count, pending verifications |
| Orders | Status management (5-step flow), WhatsApp customer messaging, admin notes |
| Products | Drag-and-drop reordering, stock management |
| Reviews | Customer review management |
| Settings | Payment details (UPI/Bank), contact info, hero text, **dynamic promotions** |

---

## 🎉 Dynamic Promotion System

The admin can configure the homepage promotional section for any occasion:
- **Badge**: "Diwali Special", "Christmas Sale", "Raksha Bandhan Collection"
- **Title**: Main heading text
- **Description**: Body text
- **Emoji**: Badge icon
- **Feature Cards**: Up to 4 cards with emoji, title, and description
- **Toggle**: Enable/disable the section without deleting content

---

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Set all environment variables from `.env.example`
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

---

## 📄 License

Private — Ambika Handloom © 2026
