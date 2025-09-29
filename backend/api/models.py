from django.db import models
from django.contrib.postgres.fields import JSONField


# Create your models here.

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True) #Soft Delete

    class Meta:
        abstract = True
        ordering = ['-created_at']


class Trip(BaseModel):
    origin = models.CharField(max_length=255, blank=True, null=True)
    pickup = models.CharField(max_length=255, blank=True, null=True)
    dropoff = models.CharField(max_length=255, blank=True, null=True)
    cycle_used_hours = models.FloatField( blank=True, null=True)
    summary = models.JSONField()
    geojson = models.JSONField()
    waypoints = models.JSONField()
    stops = models.JSONField()
    log_sheets = models.JSONField()

    def __str__(self):
        return f"{self.origin} - {self.dropoff} ({self.created_at.date()})"