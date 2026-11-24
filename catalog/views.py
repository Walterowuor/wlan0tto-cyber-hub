from django.http import JsonResponse

from .models import Service


def api_services(request):
    services = Service.objects.filter(active=True)
    data = [
        {
            'id': s.pk,
            'name': s.name,
            'unit': s.unit,
            'price': float(s.price),
            'category': s.category,
            'image': s.image,
        }
        for s in services
    ]
    return JsonResponse({'services': data})
