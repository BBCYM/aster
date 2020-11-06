from rest_framework import status
from rest_framework.response import Response
from .utils import simpleMessage, toMandarin, getLabelDescription
from .models import User
import json
from operator import itemgetter
from google.oauth2 import id_token, credentials, service_account
from google.auth.transport.requests import Request, AuthorizedSession
from authlib.integrations.requests_client import OAuth2Session
import datetime
from google.auth.exceptions import RefreshError, GoogleAuthError
from django.utils.timezone import make_aware
import os
from google.cloud.vision import ImageAnnotatorClient, Image
import time
from photo.models import Photo, Tag, ATag, BasicStructure
from aster import settings
import pytz
from mongoengine.queryset.visitor import Q
import queue
from threading import Thread
import logging
from requests.adapters import HTTPAdapter
import os, traceback
from ontology.people_utils import PeopleOntology
from ontology.utils import ColorProcess
from .utils import ThreadPool
logging.basicConfig(filename=f'./log/{__name__}.log',level=logging.INFO, filemode='w+', format='%(name)s %(levelname)s %(asctime)s -> %(message)s')

def checkisSync(session,userId):
    params = {'pageSize':10}
    photoRes = session.get('https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
    mediaItems = photoRes['mediaItems']
    print(f'Checking {len(mediaItems)} pics')
    for mediaItem in mediaItems:
        dbRes = Photo.objects(Q(userId=userId) & Q(photoId=mediaItem['id']))
        if not dbRes:
            print('some pic is missing')
            return False
    return True

class MainProcess:
    def __init__(self, session:AuthorizedSession, userId):
        self.IFR = './static'
        self.session = session
        self.queue = queue.Queue()
        self.session.mount('https://', HTTPAdapter(pool_maxsize=8, max_retries=10, pool_block=True))
        self.userId = userId
        self.client = ImageAnnotatorClient(credentials=service_account.Credentials.from_service_account_file('anster-1593361678608.json'))
        self.pageNum = int(os.getenv('PHOTO_THREAD_NUM'))
    def pipeline(self, mediaItem, serial):
        # only download images
        try:
            # get the image data
            filename = mediaItem['filename']
            imagebinary = self.session.get(mediaItem['baseUrl']+'=d').content
            with open(f'{self.IFR}/{self.userId}/{filename}', mode='wb') as handler:
                handler.write(imagebinary)
            image = Image(content = imagebinary)
            response = self.client.label_detection(image=image)
            if response.error.message:
                raise Exception(response.error.message)
            labels = response.label_annotations
            ltemp = list(map(getLabelDescription, labels))
            mLabels = toMandarin(ltemp)
            t = Tag()
            bs = BasicStructure()
            for el, l in zip(ltemp, labels):
                bs.main_tag.append(ATag(tag=el, precision=l.score))
            t.en = bs
            if mLabels and len(mLabels) > 0:
                bs = BasicStructure()
                for ml, l in zip(mLabels, labels):
                    bs.main_tag.append(ATag(tag=ml, precision=l.score))
                t.zh_tw = bs
            tempcreationTime = mediaItem['mediaMetadata']['creationTime']
            sliceTime = tempcreationTime.split('Z')[0].split('.')[0] if '.' in tempcreationTime else tempcreationTime.split('Z')[0]
            realTime = datetime.datetime.strptime(sliceTime, "%Y-%m-%dT%H:%M:%S")   
            pho = Photo(
                photoId=mediaItem['id'],
                filename=filename,
                userId=self.userId,
                tag=t,
                createTime=make_aware(
                    realTime, timezone=pytz.timezone(settings.TIME_ZONE)),
            )
            pho.save()
        except Exception as e:
            logging.error(e)
            print(f'Error from initial vision api pipline {e}')
            print(traceback.format_exc())

            
    def afterall(self, tic, i):
        self.queue.join()
        toc = time.perf_counter()
        print(f"\rTotal process {i} images in {toc - tic:0.4f} seconds")
        user = User.objects(userId=self.userId)
        user.update(
            set__isSync=True,
            set__isFreshing=False,
            set__lastSync=make_aware(datetime.datetime.utcnow(),
                                    timezone=pytz.timezone(settings.TIME_ZONE))
        )
        # People
        people_ontology = PeopleOntology(session=self.session, userId=self.userId)
        Thread(target=people_ontology.initial,daemon=True).start()
        # color_process = ColorProcess(session=self.session, userId=self.userId)
        # Thread(target=color_process.initial,daemon=True).start()
    def initial(self):
        tic = time.perf_counter()
        User.objects(userId=self.userId).update(set__isFreshing=True, set__isSync=False)
        nPT = ''
        pool=ThreadPool(self.queue)
        # subscribed = {'color':True}
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
                    mimeType, _ = mediaItem['mimeType'].split('/')
                    if mimeType == 'image':
                        pool.add_task(self.pipeline, mediaItem=mediaItem)
                        i=i+1
                if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
                    break
                else:
                    nPT = photoRes['nextPageToken']
        except Exception as e:
            logging.error(e)
            print(f'Error from initial vision api {e}')
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
                        pool.add_task(self.pipeline, mediaItem=mediaItem)
                        i=i+1
                if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
                    break
                else:
                    nPT = photoRes['nextPageToken']
        except Exception as e:
            logging.error(e)
            print(e)
        Thread(target=self.afterall, args=(tic,i), daemon=True).start()

def checkUserToSession(userId, req):
    with open('client_secret.json', 'r', encoding='utf-8') as f:
        appSecret = json.load(f).get('web')
    CLIENT_ID, CLIENT_SECRET, TOKEN_URI = itemgetter(
        'client_id',
        'client_secret',
        'token_uri'
    )(appSecret)
    user = User.objects(userId=userId)
    access_token = ''
    if not user:
        oauth = OAuth2Session(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            scope=req.data['scopes']
        )
        token = oauth.fetch_token(
            url=TOKEN_URI,
            grant_type="authorization_code",
            code=req.data['serverAuthCode'],
            redirect_url='http://localhost:3000/auth/callabck'
        )
        access_token = token['access_token']
        newUser = User(
            userId=userId,
            expiresAt=datetime.datetime.utcnow() + datetime.timedelta(0,token['expires_in']),
            refreshToken=token['refresh_token']
        )
        newUser.save()
        user = User.objects(userId=userId)
    userData = user.get()
    credent = credentials.Credentials(
        access_token,
        token_uri=TOKEN_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        refresh_token=userData.refreshToken
    )
    credent.expiry = userData.expiresAt.replace(tzinfo=None)
    now = datetime.datetime.utcnow()
    if now > credent.expiry:
        try:
            credent.refresh(Request())
            user.update(set__expiresAt=make_aware(credent.expiry),
                        set__refreshToken=credent.refresh_token)
        except RefreshError as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return AuthorizedSession(credent), userData
