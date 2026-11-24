from django.contrib import admin
from django.urls import path

from catalog.views import api_services
from content.views import api_tips
from orders.views import api_create_order, api_order_lookup

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('privacy/', views.privacy, name='privacy'),
    path('sw.js', views.service_worker, name='service-worker'),
    path('favicon.ico', views.favicon, name='favicon'),
    path('api/services/', api_services, name='api-services'),
    path('api/tips/', api_tips, name='api-tips'),
    path('api/orders/', api_create_order, name='api-orders'),
    path('api/orders/lookup/', api_order_lookup, name='api-orders-lookup'),
    path('', views.home, name='home'),
]
