import requests
import os
from mongoengine.queryset.visitor import Q
from photo.models import Photo, GeoData, ColorModel
import datetime
from color_detection.color_detect import color_detection
from requests.adapters import HTTPAdapter
import queue
from google.cloud.vision import ImageAnnotatorClient, Image
import time
from google.oauth2 import service_account
from auth.utils import ThreadPool, toMandarin, toSingleMan
from auth.models import User
from threading import Thread
from aster import settings
import pytz
from django.utils.timezone import make_aware
from google.auth.transport.requests import Request, AuthorizedSession
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
            reports = Photo.objects(Q(userId=userId) & Q(filename = l['filename']) & Q(createTime = temptime))
            print(reports)
            if reports:
                try:
                    toSave = self.reverse_geocoding(lat, lng, 'zh_TW', self.api_key)
                    for t in toSave:
                        results = reports.update(set__gps=tempgeo,add_to_set__tag__zh_tw__location=t)
                    toSave = self.reverse_geocoding(lat, lng, 'en', self.api_key)
                    for t in toSave:
                        results = reports.update(set__gps=tempgeo,add_to_set__tag__en__location=t)
                    print(results)
                except Exception as e:
                    print(e)

class ColorProcess:
    def __init__(self, session:AuthorizedSession, userId):
        self.IFR = './static'
        self.session = session
        self.queue = queue.Queue()
        self.session.mount('https://', HTTPAdapter(pool_maxsize=16, max_retries=10, pool_block=True))
        self.userId = userId
        self.client = ImageAnnotatorClient(credentials=service_account.Credentials.from_service_account_file('anster-1593361678608.json'))
        self.pageNum = int(os.getenv('PHOTO_THREAD_NUM'))
    def afterall(self, tic, i):
        self.queue.join()
        toc = time.perf_counter()
        print(f"\rTotal color process {i} images in {toc - tic:0.4f} seconds")
        user = User.objects(userId=self.userId)
        user.update(
            set__color_onto__lastSync=make_aware(datetime.datetime.utcnow(),
                                    timezone=pytz.timezone(settings.TIME_ZONE))
        )
    def color_pipline(self, mediaItem):
        try:
        # get the image data
            filename = mediaItem['filename']
            with open(f'{self.IFR}/{self.userId}/{filename}', mode='rb') as handler:
                image = Image(content = handler.read())
            objects = self.client.object_localization(image=image).localized_object_annotations
            result_array = color_detection(objects, f'{self.IFR}/{self.userId}/{filename}')
            for o, r in zip(objects, result_array):
                tempName = toSingleMan(o.name)
                name = tempName if tempName else o.name
                cm = ColorModel(obj=name, color=r)
                Photo.objects(photoId=mediaItem['id']).update(push__tag__zh_tw__color=cm)
                cm = ColorModel(obj=o.name, color=r)
                Photo.objects(photoId=mediaItem['id']).update(push_all__tag__en__color=cm)
        except Exception as e:
            print(f'Error from initial color api pipline{e}')
    def initial(self):
        tic = time.perf_counter()
        nPT = ''
        pool=ThreadPool(self.queue)
        params = {'pageSize': self.pageNum}
        i = 0
        try:
            if not os.path.isdir(f'{self.IFR}/{self.userId}'):
                os.mkdir(f'{self.IFR}/{self.userId}')
            while True:
                if nPT:
                    params['pageToken'] = nPT
                photoRes = self.session.get(
                    'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
                mediaItems = photoRes.get('mediaItems', None)
                if not mediaItems:
                    break
                print(f'Handling {len(mediaItems)} color items')
                for mediaItem in mediaItems:
                    mimeType, _ = mediaItem['mimeType'].split('/')
                    if mimeType == 'image':
                        pool.add_task(self.color_pipline, mediaItem=mediaItem)
                        i=i+1
                if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
                    break
                else:
                    nPT = photoRes['nextPageToken']
        except Exception as e:
            print(f'Error from initial color api {e}')
        Thread(target=self.afterall, args=(tic,i), daemon=True).start()
    def refresh(self):
        tic = time.perf_counter()
        User.objects(userId=self.userId).update(set__isFreshing=True, set__isSync=False)
        nPT = ''
        pool=ThreadPool(self.queue)
        params = {'pageSize': self.pageNum}
        i = 0
        try:
            if not os.path.isdir(f'{self.IFR}/{self.userId}'):
                os.mkdir(f'{self.IFR}/{self.userId}')
            while True:
                if nPT:
                    params['pageToken'] = nPT
                photoRes = self.session.get(
                    'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
                mediaItems = photoRes.get('mediaItems', None)
                if not mediaItems:
                    break
                print(f'Handling {len(mediaItems)} items')
                for mediaItem in mediaItems:
                    dbres = Photo.objects(photoId=mediaItem['id'])
                    mimeType, _ = mediaItem['mimeType'].split('/')
                    if not dbres and mimeType == 'image':
                        pool.add_task(self.color_pipline, mediaItem=mediaItem)
                        i=i+1
                if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
                    break
                else:
                    nPT = photoRes['nextPageToken']
        except Exception as e:
            print(e)
        Thread(target=self.afterall, args=(tic,i), daemon=True).start()
