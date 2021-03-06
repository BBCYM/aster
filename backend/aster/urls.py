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
from auth.views import AuthView, UserView
from bot.views import BotView
# from line.views import callback
from photo.views import PhotoView, EmotionView, TagView, PhotoListView
from album.views import AlbumView, AlbumPDView, AlbumTagView, AlbumPhotoView
# from liff.views import LiffView , TempLineView
from ontology.view import LocationOntoView, ColorOntoView, PeopleOntoView

photo_patterns = [
    path('<str:photoId>', PhotoView.as_view()),
    path('emotion/<str:photoId>', EmotionView.as_view()),
    path('tag/<str:photoId>', TagView.as_view()),
]

ontology_patterns = [
    path('<str:userId>/location', LocationOntoView.as_view()),
    path('<str:userId>/color', ColorOntoView.as_view()),
    path('<str:userId>/people', PeopleOntoView.as_view()),

]

urlpatterns = [
    # done
    # path('', TempLineView.as_view()),
    path('auth/<str:userId>', AuthView.as_view()),
    path('user/<str:userId>', UserView.as_view()),
    path('bot/<str:userId>', BotView.as_view()),
    path('photos/<str:userId>', PhotoListView.as_view()),
    path('photo/', include(photo_patterns)),
    # path('line/', callback),
    # path('liff', LiffView.as_view()),
    path('album/<str:userId>', AlbumView.as_view()),
    path('album/PD/<str:albumId>', AlbumPDView.as_view()),
    path('album/tag/<str:albumId>', AlbumTagView.as_view()),
    path('album/photo/<str:albumId>', AlbumPhotoView.as_view()),
    path('ontology/',include(ontology_patterns)),
]
