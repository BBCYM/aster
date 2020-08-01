"""aster URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from auth.views import AuthView
from bot.views import BotView
from home.views import HomeView
from photo.views import PhotoView, EmotionView, TagView
from personal.views import personalView
from album.views import AlbumView


photo_patterns = [
    path('<int:pk>', PhotoView.as_view()),
    path('', PhotoView.as_view()),
    path('/emotion', EmotionView.as_view()),
    path('/tag', TagView.as_view()),
]

urlpatterns = [
    path('', AuthView.as_view()),
    path('personal', personalView.as_view()),
    path('bot', BotView.as_view()),
    path('home', HomeView.as_view()),

    path('photo', include(photo_patterns)),

    path('album', AlbumView.as_view()),
]
