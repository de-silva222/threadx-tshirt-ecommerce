# ThreadX T-Shirt E-Commerce

Full-stack e-commerce platform for a streetwear T-shirt brand (Sri Lankan market: LKR, PayHere, district-based delivery).

## Repository layout

| Folder | Description |
|--------|-------------|
| [`threadx/`](threadx/) | Source monorepo — React frontend, CI4 app layer, SQL scripts, full docs |
| [`threadx-api/`](threadx-api/) | Runnable CodeIgniter 4 API (vendor, `public/`, `.env`) |

## Quick start (local)

See the detailed guide in [`threadx/README.md`](threadx/README.md).

```bash
# 1. Database
mysql -u root -p < threadx/database/schema.sql
mysql -u root -p < threadx/database/seed.sql

# 2. Backend (from threadx-api/)
cd threadx-api
cp ../threadx/backend/.env.example .env   # then edit .env
composer install
php spark serve --port 8080

# 3. Frontend (from threadx/frontend/)
cd threadx/frontend
cp .env.example .env
npm install
npm run dev
```

- Storefront: http://localhost:5173  
- API: http://localhost:8080/api  
- Demo admin: `admin@threadx.example` / `Password123!`

## Deploy to production

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for GitHub publishing and live hosting (Vercel + PHP/MySQL host).

## License

MIT — use and adapt freely.
