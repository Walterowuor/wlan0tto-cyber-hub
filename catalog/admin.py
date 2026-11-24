from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'unit', 'active', 'position')
    list_editable = ('price', 'active', 'position')
    list_filter = ('category', 'active')
    search_fields = ('name',)
    ordering = ('position', 'name')
