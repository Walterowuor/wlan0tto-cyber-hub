# Wlan0tto Cyber Hub

A Django web application for cyber services, security tips, and digital needs — with a built-in secure admin dashboard.

## Features

- Service catalog managed via Django admin (name, unit, price, category, image, ordering, active toggle)
- Cart checkout that records orders server-side and opens WhatsApp
- Admin-editable security tips shown on the homepage info cards
- Staff dashboard (`/dashboard/`) with visits, orders, and revenue stats
- Automatic visit/checkout analytics (`analytics` app)
- Progressive Web App (PWA) support
- Responsive design with light/dark theme

## Quick start

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py import_services   # loads data/services.json into the DB
python manage.py createsuperuser
python manage.py runserver
```

- Site: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/
- Staff dashboard: http://127.0.0.1:8000/dashboard/ (staff/superuser only)

## Project layout

- `catalog/` — Service model + `/api/services/` endpoint
- `orders/` — Order/OrderItem models + `/api/orders/` checkout endpoint
- `content/` — SafetyTip model + `/api/tips/` endpoint
- `analytics/` — SiteEvent model + visit-logging middleware
- `templates/` — `index.html`, `privacy.html`, `dashboard.html`
- `static/` — CSS, JS, icons, images, service worker, manifest
- `data/services.json` — legacy service list used by `import_services`

## Deployment notes

Set environment variables for production:

- `DJANGO_SECRET_KEY` — strong random secret
- `DEBUG=False`
- `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`

Use a production WSGI server (gunicorn) behind Nginx or a platform like
Render/Railway/VPS. Run `python manage.py collectstatic` on deploy.
SQLite is fine for small traffic; switch `DATABASES` to Postgres for scale.

## Support

For support, text [+254743149316](https://wa.me/+254743149316).
