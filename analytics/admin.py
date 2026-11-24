from django.contrib import admin

from .models import SiteEvent


@admin.register(SiteEvent)
class SiteEventAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'path', 'created_at')
    list_filter = ('event_type', 'created_at')
    search_fields = ('path',)
    readonly_fields = ('event_type', 'path', 'session_key', 'meta', 'created_at')
    date_hierarchy = 'created_at'

    def has_add_permission(self, request):
        return False
