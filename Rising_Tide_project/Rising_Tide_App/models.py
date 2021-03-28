from django.db import models

# Model for the database latitude, longitude, and distance entries. Use latitude and longitude to get distance from coast
class DistanceToCoast(models.Model):
    id = models.IntegerField(primary_key = True)
    longitude = models.FloatField(blank = True, null = True)
    latitude = models.FloatField(blank = True, null = True)
    distance = models.FloatField(blank = True, null = True)

    class Meta:
        managed = True
        db_table = 'distance_to_coast'