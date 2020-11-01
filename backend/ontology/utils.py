import requests
import os
from mongoengine.queryset.visitor import Q
from photo.models import Photo, GeoData
import datetime
from color_detection.color_detect import color_detection
class GeoCoding:
    def __init__(self):
        self.api_key = os.getenv('GEOCODING_KEY')

    def reverse_geocoding(self,lat, lng, language, api_key):
        res = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={api_key}&language={language}').json()
        data = res['results'][0]['address_components']
        toSave = []
        for d in data:
            toSave.extend((d['long_name'],d['short_name']))
        return list(set(toSave))

    def update_location(self,locdata, userId):
        for l in locdata:
            lat, lng = l['location']['latitude'], l['location']['longitude']
            tempgeo = GeoData(latitude=lat,longitude=lng)
            temptime = datetime.datetime.fromtimestamp(l['timestamp'],tz=datetime.timezone.utc).replace(microsecond=0)
            reports = Photo.objects(Q(userId=userId) & Q(filename=l['filename']) & Q(createTime = temptime))
            if reports:
                try:
                    toSave = self.reverse_geocoding(lat, lng, 'zh_TW', self.api_key)
                    results = reports.update(set__gps=tempgeo,push_all__tag__zh_tw__location=toSave)
                    toSave = self.reverse_geocoding(lat, lng, 'en', self.api_key)
                    results = reports.update(set__gps=tempgeo,push_all__tag__en__location=toSave)
                except Exception as e:
                    print(e)