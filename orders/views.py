import json
import re

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from catalog.models import Service

from .models import Order, OrderItem


@require_POST
def api_create_order(request):
    """Creates an order from cart items. Prices are computed server-side."""
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    raw_items = payload.get('items')
    if not isinstance(raw_items, list) or not raw_items:
        return JsonResponse({'error': 'Order must contain at least one item'}, status=400)

    requested = {}
    for item in raw_items:
        try:
            sid = int(item.get('id'))
            qty = int(item.get('quantity', 1))
        except (TypeError, ValueError):
            return JsonResponse({'error': 'Invalid item'}, status=400)
        if qty < 1 or qty > 100:
            return JsonResponse({'error': 'Invalid quantity'}, status=400)
        requested[sid] = requested.get(sid, 0) + qty

    services = {s.pk: s for s in Service.objects.filter(pk__in=requested.keys(), active=True)}
    if len(services) != len(requested):
        return JsonResponse({'error': 'One or more services are unavailable'}, status=400)

    customer_name = str(payload.get('customer_name', ''))[:150]
    phone = str(payload.get('phone', ''))[:30]
    note = str(payload.get('note', ''))[:2000]

    with transaction.atomic():
        order = Order.objects.create(
            customer_name=customer_name, phone=phone, note=note,
        )
        total = 0
        for sid, qty in requested.items():
            service = services[sid]
            line_total = service.price * qty
            total += line_total
            OrderItem.objects.create(
                order=order, service=service, name=service.name,
                unit_price=service.price, quantity=qty,
            )
        order.total = total
        order.save(update_fields=['total'])

    from analytics.models import SiteEvent
    SiteEvent.objects.create(
        event_type='checkout',
        meta={'order_id': order.pk, 'total': float(total)},
    )

    return JsonResponse({'order_id': order.pk, 'total': float(total)}, status=201)


def _phone_digits(value):
    return re.sub(r'\D', '', value or '')


@require_GET
def api_order_lookup(request):
    """Look up a customer's orders by phone number (last 9 digits match,
    so '07...' and '+2547...' both work)."""
    digits = _phone_digits(request.GET.get('phone', ''))
    if len(digits) < 9:
        return JsonResponse({'error': 'Enter a valid phone number'}, status=400)
    tail = digits[-9:]

    results = []
    for order in Order.objects.exclude(phone='').prefetch_related('items'):
        if _phone_digits(order.phone)[-9:] == tail:
            results.append({
                'id': order.pk,
                'date': order.created_at.strftime('%b %d, %Y %H:%M'),
                'total': float(order.total),
                'status': order.status,
                'status_label': order.get_status_display(),
                'name': order.customer_name,
                'items': [
                    {'name': i.name, 'quantity': i.quantity,
                     'unit_price': float(i.unit_price)}
                    for i in order.items.all()
                ],
            })
    return JsonResponse({'orders': results[:50]})
