from django.db import models

# Create your models here.
class DistanceToCoast(models.Model):
    id = models.IntegerField(primary_key=True)
    longitude = models.FloatField(blank = True, null = True)
    latitude = models.FloatField(blank = True, null = True)
    distance = models.FloatField(blank = True, null = True)

    class Meta:
        managed = True
        db_table = 'distance_to_coast'