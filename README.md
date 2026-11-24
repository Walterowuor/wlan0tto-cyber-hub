# Wlan0tto Cyber Hub

A Django web application for cyber services, security tips, and digital needs — with a built-in secure admin dashboard.

## Features

- **Service catalog** managed via Django admin (name, unit, price, category, image, ordering, active toggle)
- **Cart** with quantity controls, item removal, localStorage persistence, and a split-view panel on desktop (modal drawer on mobile)
- **Checkout** records orders server-side (prices computed by the backend, CSRF-protected) and opens WhatsApp
- **Profile & Settings drawer** — saved profile details, "My Orders" lookup by phone number, theme toggle, and local data controls
- **Admin-editable security tips** shown on the homepage info cards
- **Staff dashboard** (`/dashboard/`) with visits, orders, revenue, top services, and quick links into Django admin
- **Automatic analytics** — visit logging middleware + checkout events (`analytics` app)
- **Progressive Web App** (PWA) support with a network-first service worker
- **Fully responsive** — progressive service grid from 320px phones to large desktops, light/dark theme

## Quick start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py import_services   # loads data/services.json into the DB
python manage.py createsuperuser
python manage.py runserver
```

- Site: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/
- Staff dashboard: http://127.0.0.1:8000/dashboard/ (staff/superuser only)

## API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/services/` | GET | Active services ordered for display |
| `/api/tips/` | GET | Active safety tips keyed by card `data-info` |
| `/api/orders/` | POST | Create order from cart items (CSRF required) |
| `/api/orders/lookup/?phone=` | GET | Look up orders by phone (last 9 digits match) |

## Project layout

- `catalog/` — `Service` model, `/api/services/`, `import_services` command
- `orders/` — `Order`/`OrderItem` models, checkout + lookup endpoints
- `content/` — `SafetyTip` model + `/api/tips/`
- `analytics/` — `SiteEvent` model + `VisitLoggingMiddleware`
- `templates/` — `index.html`, `privacy.html`, `dashboard.html`
- `static/` — CSS, JS modules, icons, images, service worker, manifest
- `data/services.json` — legacy service list used by `import_services`
- `wlan0tto/` — project settings, URLs, views (home, privacy, sw.js, dashboard)

## Deployment notes

Set environment variables for production:

- `DJANGO_SECRET_KEY` — strong random secret
- `DEBUG=False`
- `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`

Use a production WSGI server (e.g. `gunicorn wlan0tto.wsgi`) behind Nginx
or a platform like Render/Railway/VPS. Run `python manage.py collectstatic`
on deploy. SQLite is fine for small traffic; switch `DATABASES` to Postgres
for scale.

## Support

For support, text [+254743149316](https://wa.me/+254743149316).
