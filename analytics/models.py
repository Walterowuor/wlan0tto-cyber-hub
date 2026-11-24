from django.db import models


class EventType(models.TextChoices):
    VISIT = 'visit', 'Page visit'
    CHECKOUT = 'checkout', 'Checkout'
    SEARCH = 'search', 'Search'


class SiteEvent(models.Model):
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    path = models.CharField(max_length=300, blank=True, default='')
    session_key = models.CharField(max_length=100, blank=True, default='')
    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'created_at']),
        ]

    def __str__(self):
        return f'{self.get_event_type_display()} — {self.path} — {self.created_at:%Y-%m-%d %H:%M}'
