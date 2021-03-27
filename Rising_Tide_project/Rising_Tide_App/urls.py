from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('<double:longitude>/<double:latitude>/<double:elevation>/result', views.mapResult, name='mapResult'),
]