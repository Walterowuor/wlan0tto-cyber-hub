from django.http import JsonResponse

from .models import SafetyTip


def api_tips(request):
    tips = SafetyTip.objects.filter(active=True)
    return JsonResponse({
        'tips': {
            t.key: {'title': t.title, 'text': t.body}
            for t in tips
        }
    })
