from pathlib import Path

from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Q, Sum
from django.http import FileResponse, HttpResponseNotFound
from django.shortcuts import render
from django.utils import timezone

from analytics.models import EventType, SiteEvent
from content.models import SafetyTip
from orders.models import Order, OrderItem, OrderStatus


def home(request):
    return render(request, 'index.html')


def privacy(request):
    return render(request, 'privacy.html')


def favicon(request):
    candidate = Path(settings.BASE_DIR) / 'static' / 'favicon.ico'
    if not candidate.exists():
        return HttpResponseNotFound()
    return FileResponse(candidate.open('rb'), content_type='image/x-icon')


def service_worker(request):
    """Serve the service worker at root scope (/sw.js)."""
    candidate = Path(settings.BASE_DIR) / 'static' / 'sw.js'
    if not candidate.exists():
        return HttpResponseNotFound()
    response = FileResponse(candidate.open('rb'), content_type='application/javascript')
    response['Service-Worker-Allowed'] = '/'
    return response


@staff_member_required
def dashboard(request):
    today = timezone.localdate()

    visits = SiteEvent.objects.filter(event_type=EventType.VISIT)
    checkouts = SiteEvent.objects.filter(event_type=EventType.CHECKOUT)

    order_stats = Order.objects.aggregate(
        order_count=Count('pk'),
        revenue=Sum('total'),
        pending=Count('pk', filter=Q(status=OrderStatus.PENDING)),
    )

    context = {
        'visits_total': visits.count(),
        'visits_today': visits.filter(created_at__date=today).count(),
        'checkouts_total': checkouts.count(),
        'orders_total': order_stats['order_count'] or 0,
        'orders_pending': order_stats['pending'] or 0,
        'revenue_total': order_stats['revenue'] or 0,
        'revenue_today': Order.objects.filter(created_at__date=today).aggregate(
            total=Sum('total'),
        )['total'] or 0,
        'recent_orders': Order.objects.prefetch_related('items')[:10],
        'top_services': (
            OrderItem.objects.values('name')
            .annotate(qty=Sum('quantity'))
            .order_by('-qty')[:5]
        ),
        'tips_count': SafetyTip.objects.filter(active=True).count(),
    }
    return render(request, 'dashboard.html', context)
