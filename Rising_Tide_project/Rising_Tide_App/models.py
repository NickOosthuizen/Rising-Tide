from django.db import models

# Model for the database latitude, longitude, and distance entries. Use latitude and longitude to get distance from coast
# The data for this database was drawn from the NASA Ocean Biology Processing Group's data set on coordinates to distance from coast
# It can be found here: https://oceancolor.gsfc.nasa.gov/docs/distfromcoast/
# However we loaded a reduced precision version into our database, only using a precision of .1 for latitude and longitude
class DistanceToCoast(models.Model):
    id = models.IntegerField(primary_key = True)
    longitude = models.FloatField(blank = True, null = True)
    latitude = models.FloatField(blank = True, null = True)
    distance = models.FloatField(blank = True, null = True)

    class Meta:
        managed = True
        db_table = 'distance_to_coast'