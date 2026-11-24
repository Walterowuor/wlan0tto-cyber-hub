from django.db import models


class SafetyTip(models.Model):
    """Editable security tip shown on the info cards of the homepage."""

    key = models.SlugField(
        max_length=50, unique=True,
        help_text='Must match the data-info attribute on the homepage card.',
    )
    title = models.CharField(max_length=150)
    body = models.TextField()
    active = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['position', 'key']

    def __str__(self):
        return self.title
