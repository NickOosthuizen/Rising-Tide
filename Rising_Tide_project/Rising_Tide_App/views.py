from django.http import Http404
from django.shortcuts import render
from Rising_Tide_App.models import DistanceToCoast
import math

# Create your views here.
def home(request):
    return render(request, 'Rising_Tide_App/home.html')


def mapResult(request):
    try:
        lng = float(request.GET['lng'])
        lat = float(request.GET['lat'])
        elevation = float(request.GET['elev'])
    except (NameError, TypeError):
        raise Http404("Invalid query parameters were passed")

    # the database only contains entries with numbers with odd tenth place decimals
    odd_rounded_lng = math.floor((lng - .1) / .2 + .5) * .2 + .1
    odd_rounded_lng = round(odd_rounded_lng, 1)
    odd_rounded_lat = math.floor((lat - .1) / .2 + .5) * .2 + .1
    odd_rounded_lat = round(odd_rounded_lat, 1)

    try:
        entry = DistanceToCoast.objects.get(longitude = odd_rounded_lng, latitude = odd_rounded_lat)
    except DistanceToCoast.DoesNotExist:
        raise Http404("An invalid longitude and latitude was passed.")

    chance = ""

    chances = ["very low", "low", "medium low", "medium", "medium high", "high", "extremely high"]

    if (entry.distance > 100):
        chance = chances[0]
    elif (elevation < .5):
        chance = chances[6]
    elif (elevation < 1):
        chance = chances[5]
    elif (elevation < 1.5):
        chance = chances[4]
    elif (elevation < 2):
        chance = chances[3]
    elif (elevation < 2.5):
        chance = chances[2]
    elif (elevation < 10):
        chance = chances[1]
    else:
        chance = chances[0]

    lng = round(lng, 2)
    lat = round(lat, 2)
    elevation = round(elevation, 2)

    context = {
        'longitude': lng,
        'latitude': lat,
        'elevation': elevation,
        'chance': chance,
    }
    return render(request, 'Rising_Tide_App/mapResult.html', context)
    

def resources(request):
    return render(request, 'Rising_Tide_App/resources.html')
