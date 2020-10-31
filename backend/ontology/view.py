from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from photo.models import Photo, GeoData
from django.core.handlers.wsgi import WSGIRequest
from mongoengine.queryset.visitor import Q
import datetime
from .utils import reverse_geocoding
import os

class LocationOntoView(APIView):
    def get(self, request:WSGIRequest):
        pass
    
    def post(self, request:WSGIRequest, userId=None):
        locdata = request.data['locdata']
        api_key = os.getenv('GEOCODING_KEY')
        for l in locdata:
            lat, lng = l['location']['latitude'], l['location']['longitude']
            tempgeo = GeoData(latitude=lat,longitude=lng)
            temptime = datetime.datetime.fromtimestamp(l['timestamp'],tz=datetime.timezone.utc).replace(microsecond=0)
            reports = Photo.objects(Q(userId=userId) & Q(filename=l['filename']) & Q(createTime = temptime))
            if reports:
                try:
                    toSave = reverse_geocoding(lat, lng, 'zh_TW', api_key)
                    results = reports.update(set__gps=tempgeo,push_all__tag__zh_tw__location=toSave)
                    toSave = reverse_geocoding(lat, lng, 'en', api_key)
                    results = reports.update(set__gps=tempgeo,push_all__tag__en__location=toSave)
                except Exception as e:
                    print(e)

        return Response('Hello')

