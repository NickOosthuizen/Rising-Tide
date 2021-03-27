from django.urls import path, re_path
from . import views

app_name = 'Rising_Tide_App'
urlpatterns = [
    path('', views.home, name='home'),
    path('result', views.mapResult, name='mapResult'),
    # re_path(r'^result\?lng=(P<lng>[0-9]{1, 3}\.[0-9]*)&lat=(P<lat>[0-9]{1, 3}\.[0-9]*)&elev=(P<elev>[0-9]{1, 3}\.[0-9]*)/$', views.mapResult, name='mapResult'),
]