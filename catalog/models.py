from django.db import models


class Category(models.TextChoices):
    PRINTING_BINDING = 'printing-binding', 'Printing & Binding'
    DEVICE = 'device', 'Device Services'
    MEDIA = 'media', 'Media & Downloads'
    DOCUMENTS = 'documents', 'Documents'
    ECITIZEN = 'ecitizen', 'e-Citizen'
    TRAINING = 'training', 'Training'
    BRANDING = 'branding', 'Branding'
    PACKAGING = 'packaging', 'Packaging'


class Service(models.Model):
    name = models.CharField(max_length=200)
    unit = models.CharField(
        max_length=50, blank=True, default='',
        help_text='Optional unit suffix, e.g. "/page", "/hour"',
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=30, choices=Category.choices)
    image = models.URLField(blank=True, default='')
    active = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['position', 'name']

    def __str__(self):
        return self.name
