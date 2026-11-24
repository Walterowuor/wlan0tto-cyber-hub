from django.utils import timezone

from .models import SiteEvent


class VisitLoggingMiddleware:
    """Logs one 'visit' SiteEvent per session for HTML page views."""

    SKIP_PREFIXES = ('/admin/', '/static/', '/api/', '/dashboard/')

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if (
            request.method == 'GET'
            and response.status_code == 200
            and 'text/html' in response.get('Content-Type', '')
            and not request.path.startswith(tuple(self.SKIP_PREFIXES))
            and not request.session.get('_visit_logged')
        ):
            request.session['_visit_logged'] = True
            SiteEvent.objects.create(
                event_type='visit',
                path=request.path,
                session_key=request.session.session_key or '',
            )
        return response
