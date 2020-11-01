from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from photo.models import Photo, GeoData
from django.core.handlers.wsgi import WSGIRequest
from mongoengine.queryset.visitor import Q
import datetime
from .utils import GeoCoding
import os
from threading import Thread
from auth.models import User
import json
class LocationOntoView(APIView):
    def post(self, request:WSGIRequest, userId=None):
        locdata = request.data['locdata']
        geo = GeoCoding()
        Thread(target=geo.update_location,args=(locdata, userId),daemon=True).start()
        stamp = datetime.datetime.now()
        return Response(True, status=status.HTTP_200_OK)

class ColorOntoView(APIView):
    def get(self, request:WSGIRequest, userId=None):
        user = User.objects(userId=userId).get()
        print(user.color_onto.subscribed)
        return Response('Hello',status=status.HTTP_200_OK)
    # subscribed
    def post(self, request:WSGIRequest, userId=None):
        subscribe = json.loads(request.data['subscribe'].lower())
        User.objects(userId=userId).update(set__color_onto__subscribed=subscribe)
        print(subscribe)
        return Response(subscribe, status=status.HTTP_200_OK)

class PeopleOntoView(APIView):
    def get(self, request:WSGIRequest, userId=None):
        user = User.objects(userId=userId).get()
        print(user.people_onto.subscribed)
        return Response('Hello',status=status.HTTP_200_OK)
    # subscribed
    def post(self, request:WSGIRequest, userId=None):
        subscribe = json.loads(request.data['subscribe'].lower())
        User.objects(userId=userId).update(set__people_onto__subscribed=subscribe)
        print(subscribe)
        return Response(subscribe, status=status.HTTP_200_OK)
