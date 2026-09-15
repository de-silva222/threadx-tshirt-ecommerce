# Deployment Guide

This project has two parts that deploy separately:

| Part | Stack | Recommended host |
|------|-------|------------------|
| **Frontend** | React + Vite (static build) | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) |
| **Backend** | PHP 8.2 + CodeIgniter 4 + MySQL | [Railway](https://railway.app), [Render](https://render.com), or shared PHP hosting (Hostinger, etc.) |

---

## 1. Publish code on GitHub (public)

### Option A — GitHub website

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `threadx-tshirt-ecommerce`
3. Visibility: **Public**
4. Do **not** initialize with README (this repo already has one)
5. Create repository, then run locally:

```bash
cd C:\xampp\htdocs\xampp\threadx-tshirt-ecommerce
git remote add origin https://github.com/YOUR_USERNAME/threadx-tshirt-ecommerce.git
git push -u origin main
```

### Option B — GitHub CLI

```bash
winget install GitHub.cli
gh auth login
gh repo create threadx-tshirt-ecommerce --public --source=. --push
```

---

## 2. Deploy the frontend (Vercel)

1. Sign in at [vercel.com](https://vercel.com) with GitHub
2. **Add New Project** → import `threadx-tshirt-ecommerce`
3. Set **Root Directory** to `threadx/frontend`
4. Framework preset: **Vite**
5. Add environment variable:

   | Name | Value (after backend is live) |
   |------|-------------------------------|
   | `VITE_API_BASE_URL` | `https://YOUR-API-DOMAIN.com/api` |
   | `VITE_BRAND_NAME` | Your brand name |

6. Deploy. Vercel will run `npm run build` and serve `dist/`.

For client-side routing, `vercel.json` in `threadx/frontend/` already rewrites all routes to `index.html`.

---

## 3. Deploy the backend (PHP + MySQL)

The API lives in `threadx-api/`. Document root must be `threadx-api/public/`.

### Railway (recommended for beginners)

1. Create a [Railway](https://railway.app) account
2. New project → **Deploy from GitHub repo**
3. Add a **MySQL** service
4. Add a **Web Service** pointing at `threadx-api/`
5. Set start command (if no Dockerfile):

   ```bash
   composer install --no-dev && php spark serve --host 0.0.0.0 --port $PORT
   ```

6. Configure environment variables from `threadx/backend/.env.example`:

   | Variable | Production value |
   |----------|------------------|
   | `CI_ENVIRONMENT` | `production` |
   | `app.baseURL` | `https://YOUR-API-DOMAIN/` |
   | `app.forceGlobalSecureRequests` | `true` |
   | `database.default.*` | Railway MySQL credentials |
   | `AUTH_JWT_SECRET` | Long random string (`php -r "echo bin2hex(random_bytes(32));"`) |
   | `CORS_ALLOWED_ORIGIN` | Your Vercel frontend URL (e.g. `https://threadx.vercel.app`) |
   | `STORAGE_DRIVER` | `cloudinary` (local disk is lost on redeploy) |
   | `PAYMENT_MODE` | `live` + real PayHere credentials |

7. Run migrations once:

   ```bash
   php spark migrate
   php spark db:seed ThreadxSeeder
   ```

### Shared PHP hosting (cPanel / Hostinger)

1. Upload `threadx-api/` contents via FTP
2. Point domain document root to `public/`
3. Create MySQL database, import `threadx/database/schema.sql` and `seed.sql`
4. Copy `.env.example` → `.env` and fill in production values
5. Run `composer install --no-dev` on the server (SSH)

---

## 4. Post-deploy checklist

- [ ] Change demo admin password (`admin@threadx.example`)
- [ ] Set strong `AUTH_JWT_SECRET`
- [ ] Update `CORS_ALLOWED_ORIGIN` to your live frontend URL
- [ ] Set `VITE_API_BASE_URL` on Vercel to your live API URL, then redeploy frontend
- [ ] Configure Cloudinary for product/custom design images
- [ ] Configure PayHere live credentials
- [ ] Enable HTTPS on both frontend and API
- [ ] Set up mail credentials for password-reset emails

---

## Architecture

```
[Browser] → [Vercel: React SPA] → [API: CodeIgniter 4] → [MySQL]
                                         ↓
                              [Cloudinary / PayHere]
```

Frontend env (`VITE_API_BASE_URL`) and backend env (`CORS_ALLOWED_ORIGIN`) must reference each other's production URLs.
