from django.http import Http404
from django.shortcuts import render
import math

# Create your views here.
def home(request):
    return render(request, 'Rising_Tide_App/home.html')


def mapResult(request, lng, lat, elevation):
    # the database only contains entries with numbers with odd tenth place decimals
    odd_rounded_lng = math.floor((lng - .1) / .2 + .5)) * .2 + .1
    odd_rounded_lng = round(odd_rounded_lng, 1)
    odd_rounded_lat = math.floor((lat - .1) / .2 + .5)) * .2 + .1
    odd_rounded_lat = round(odd_rounded_lat, 1)

    try:
        entry = DistanceToCoast.objects.get(longitude = odd_rounded_lng, latitude = odd_rounded_lat)
    except DistanceToCoast.DoesNotExist:
        raise Http404("An invalid longitude and latitude was passed.")

    chance = ""

    chances = ["Very Low", "Low", "Medium Low", "Medium", "Medium High", "High", "Extremely High"]

    if (entry.distance > 100)
        chance = chances[0]
    else if (elevation < .5)
        chance = chances[6]
    else if (elevation < 1)
        chance = chances[5]
    else if (elevation < 1.5)
        chance = chances[4]
    else if (elevation < 2)
        chance = chances[3]
    else if (elevation < 2.5)
        chance = chances[2]
    else if (elevation < 10)
        chance = chances[1]
    else
        chance = chances[0]

    context = {
        'longitude' : lng,
        'latitude' : lat,
        'elevation' : elevation,
        'chance' : chance,
    }
    return render(request, 'Rising_Tide_App/mapResult.html', context)
    

