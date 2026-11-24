from django.contrib import admin

from .models import SafetyTip


@admin.register(SafetyTip)
class SafetyTipAdmin(admin.ModelAdmin):
    list_display = ('title', 'key', 'active', 'position')
    list_editable = ('active', 'position')
    list_filter = ('active',)
    search_fields = ('title', 'key', 'body')
    ordering = ('position', 'key')
