# THREADX — Premium Printed T-Shirt E-Commerce Platform

A full-stack e-commerce platform for a streetwear T-shirt brand, built for the Sri Lankan
market (LKR currency, PayHere payments, district-based delivery). Includes a customer
storefront, a step-by-step custom T-shirt designer, and a full admin dashboard.

> **"THREADX" is a placeholder brand name.** Change it in one place — see
> [Rebranding](#rebranding) — nothing else in the codebase hardcodes it.

---

## 1. Features

- Storefront: home, shop with server-side search/filter/sort/pagination, product detail,
  cart, wishlist, checkout, order confirmation, order tracking
- Custom T-Shirt Designer: 7-step flow (type → color → size → upload → text → position → preview) with a live mockup
- Auth: register, login, forgot/reset password, profile, password change
- Customer dashboard: orders, addresses, custom designs, profile
- Checkout: Cash on Delivery + online payment (PayHere) architecture, server-side pricing
- Admin dashboard: sales/orders/customers/products overview, analytics charts, product &
  variant management, category management, order management with status/tracking updates,
  customer management, custom design review workflow, inventory with low-stock warnings,
  coupons, review moderation, delivery/district fee management, brand settings
- Reviews (verified-purchaser only, admin-approved before publishing)
- Coupons (percentage/fixed, min order, usage limits, per-user limits, expiry)

## 2. Technology Stack

| Layer     | Stack |
|-----------|-------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Axios, lucide-react |
| Backend   | CodeIgniter 4, PHP 8.2+, REST API |
| Database  | MySQL 8+ |
| Payments  | PayHere (Sri Lanka) — pluggable `PaymentService` abstraction |
| Images    | Local disk (dev) or Cloudinary (prod) — pluggable `ImageStorageService` |
| Auth      | HMAC-signed bearer tokens (no external JWT dependency required) |

## 3. Project Structure

```
threadx/
├── frontend/                 React + TypeScript + Vite storefront & admin UI
│   └── src/
│       ├── components/       Reusable UI (Navbar, ProductCard, Modal, Toast, etc.)
│       ├── pages/             Storefront + customer account pages
│       ├── admin/pages/       Admin dashboard pages
│       ├── layouts/           MainLayout, AdminLayout
│       ├── store/             Zustand stores (auth, cart, wishlist, ui)
│       ├── services/          Axios API clients
│       ├── types/             Shared TypeScript types
│       └── config/brand.ts    Single source of truth for brand name/accent color
├── backend/                  CodeIgniter 4 REST API
│   └── app/
│       ├── Controllers/Api/    Public storefront endpoints
│       ├── Controllers/Admin/  Admin-only endpoints (auth+admin filters)
│       ├── Models/             One model per table
│       ├── Services/           PricingService, PaymentService, ImageStorageService, TokenService
│       ├── Filters/             AuthFilter, AdminFilter, CorsFilter
│       └── Database/Migrations, Database/Seeds
├── database/
│   ├── schema.sql             Full MySQL schema (18 tables)
│   └── seed.sql                Realistic sample data
└── README.md                  This file
```

## 4. Requirements

- PHP 8.2+ with `mysqli`, `intl`, `mbstring` extensions
- Composer
- MySQL 8+ (or MariaDB 10.6+)
- Node.js 18+ and npm
- XAMPP (or any Apache/Nginx + PHP + MySQL stack) for local development

## 5. Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

This creates the `threadx_store` database with the full schema, then loads sample
categories, products, variants, images, users, orders, reviews, and coupons.

**Demo admin login (change immediately — see `database/seed.sql`):**
```
email:    admin@threadx.example
password: Password123!
```

## 6. Backend Setup

The `backend/` folder contains the custom `app/` layer for a CodeIgniter 4 project.
To run it:

```bash
# From an empty directory, scaffold a fresh CI4 project:
composer create-project codeigniter4/appstarter threadx-api
cd threadx-api

# Copy this project's backend/app/* over the generated app/ folder (overwrite):
cp -r ../threadx/backend/app/* app/
cp ../threadx/backend/.env.example .env
cp ../threadx/backend/composer.json ./composer.json   # optional, if starting fully fresh

# Copy the database/ folder to the project root (migrations/seeder read from here):
cp -r ../threadx/database ./database

composer install
```

Edit `.env`:
- Set `database.default.*` to your MySQL credentials
- Set `AUTH_JWT_SECRET` to a long random string:
  `php -r "echo bin2hex(random_bytes(32));"`
- Leave `STORAGE_DRIVER=local` for development
- Leave PayHere/Cloudinary blank until you're ready to configure them (see below)

If you'd rather not run `schema.sql`/`seed.sql` manually, you can instead run them as
CI4 migrations/seeders (they're wired to read the same SQL files):

```bash
php spark migrate
php spark db:seed ThreadxSeeder
```

Start the API:

```bash
php spark serve --port 8080
```

The API is now available at `http://localhost:8080/api`.

## 7. Frontend Setup

```bash
cd threadx/frontend
cp .env.example .env
npm install
npm run dev
```

The storefront runs at `http://localhost:5173`. Admin dashboard is at
`http://localhost:5173/admin` (log in with the demo admin account first).

Make sure `VITE_API_BASE_URL` in `frontend/.env` points at your backend
(`http://localhost:8080/api` by default).

## 8. Running Locally With XAMPP

1. Place the `threadx-api` folder (from step 6) inside `htdocs/`.
2. Point Apache's document root at `threadx-api/public`, or use
   `php spark serve` as shown above (simpler, and matches the `.env` defaults).
3. Start MySQL from the XAMPP control panel and run the database setup (step 5).
4. Run the frontend dev server separately with `npm run dev` (Vite doesn't run inside XAMPP).

## 9. Creating an Admin Account

The seed data includes one admin account (see §5). To create another admin manually:

```sql
INSERT INTO users (name, email, phone, password_hash, role, status, created_at, updated_at)
VALUES ('New Admin', 'newadmin@threadx.example', '+94770000000',
        '$2y$10$...', -- generate with: php -r "echo password_hash('YourPassword123!', PASSWORD_BCRYPT);"
        'admin', 'active', NOW(), NOW());
```

## 10. Adding Products

Either:
- Use the Admin dashboard (`/admin/products` → Add Product → then upload images and add
  size/color variants from the product detail actions), or
- Insert directly into `products`, `product_variants`, and `product_images` following the
  patterns in `database/seed.sql`.

Every price shown to a customer is read from the database — the frontend never determines
or sends a price. See `PricingService.php` for the order-pricing pipeline.

## 11. Configuring Payments (PayHere)

1. Get sandbox credentials from https://www.payhere.lk (Merchant ID + Merchant Secret).
2. Set in `.env`:
   ```
   PAYHERE_MERCHANT_ID=...
   PAYHERE_MERCHANT_SECRET=...
   PAYMENT_MODE=sandbox
   ```
3. `PayHereGateway` (in `app/Services/PaymentService.php`) builds the signed checkout
   payload and verifies the server-to-server callback's MD5 signature. **Orders are only
   ever marked "paid" from that verified callback — never from a browser redirect.**
4. Switch `PAYMENT_MODE=live` and use live credentials for production.

To use a different gateway, implement `PaymentGatewayInterface` and swap it in
`PaymentService::resolveGateway()` — no controller changes needed.

## 12. Configuring Image Storage

`STORAGE_DRIVER=local` (default) saves uploads to `backend/public/uploads/` and serves
them from `STORAGE_LOCAL_URL`.

For Cloudinary in production:
```
STORAGE_DRIVER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
Then run `composer require cloudinary/cloudinary_php` and fill in
`ImageStorageService::storeCloudinary()` (a clear TODO with the exact call is left in place).

## 13. Rebranding

Change these two places only:
- `frontend/src/config/brand.ts` (`name`, `accentColor`, etc. — or override via
  `frontend/.env`'s `VITE_BRAND_NAME`)
- The `settings` table (`brand_name`, `accent_color`, and the rest) — editable live from
  **Admin → Settings**

Nothing else in the codebase hardcodes "THREADX".

## 14. Security Notes

- Passwords are hashed with PHP's `password_hash` (bcrypt) — never stored plain.
- Auth uses HMAC-signed bearer tokens (`TokenService`); no card data ever touches the
  database — PayHere handles all card entry.
- **Server-side price authority**: `PricingService` recalculates every price from the
  database on checkout; the frontend only sends variant/design IDs and quantities.
- **Atomic stock reduction**: `ProductVariantModel::reduceStock()` uses a conditional
  `UPDATE ... WHERE stock >= quantity` to prevent overselling under concurrent checkouts;
  the whole order is rolled back if any line item can't be fulfilled.
- Admin endpoints are protected by both `AuthFilter` (valid session) and `AdminFilter`
  (role check against the database, never trusting a client-supplied role).
- File uploads are validated for MIME type, extension, and size before being stored.

## 15. Production Deployment Checklist

- [ ] Change the demo admin password (and delete/disable the demo customer accounts if not needed)
- [ ] Set `CI_ENVIRONMENT=production` in the backend `.env`
- [ ] Set a strong, unique `AUTH_JWT_SECRET`
- [ ] Set real PayHere live credentials and `PAYMENT_MODE=live`
- [ ] Point `STORAGE_DRIVER` at Cloudinary (or another persistent store — local disk
      uploads won't survive most PaaS redeploys)
- [ ] Set `app.forceGlobalSecureRequests = true` once HTTPS is in place
- [ ] Update `CORS_ALLOWED_ORIGIN` to your real frontend domain
- [ ] Set `VITE_API_BASE_URL` to your real API domain and run `npm run build`
- [ ] Serve the built `frontend/dist` behind HTTPS (Netlify, Vercel, Nginx, etc.)
- [ ] Set up real mail credentials for password-reset emails
- [ ] (Optional) Wire up the WhatsApp notification scaffolding for order updates

---

Built as a complete, working reference implementation — the code is meant to be read,
extended, and adapted, not treated as a black box.
