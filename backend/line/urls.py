# from django.conf.urls import include, url
from . import views
from django.urls import path

# 用來串接callback主程式
urlpatterns = [
    # url('callback/', views.callback),
    path('', views.callback, name='callback'),
]