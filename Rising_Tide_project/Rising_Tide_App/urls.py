from django.urls import path, re_path
from . import views

app_name = 'Rising_Tide_App'
urlpatterns = [
    path('', views.home, name='home'),
    path('result', views.mapResult, name='mapResult'),
    path('resources', views.resources, name='resources'),
]