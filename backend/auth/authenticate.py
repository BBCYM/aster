from rest_framework import status
from rest_framework.response import Response
from .customResponse import simpleMessage
from .models import User
from .serializer import UserSerializer
import json
from operator import itemgetter
from google.oauth2 import id_token, credentials, service_account
from google.auth.transport.requests import Request, AuthorizedSession
from authlib.integrations.requests_client import OAuth2Session
import datetime
from google.auth.exceptions import RefreshError, GoogleAuthError
from django.utils.timezone import make_aware
import os
from google.cloud.vision import ImageAnnotatorClient, types
import time
from photo.models import Photo
from aster import settings
import shutil
import pytz


def afterAll(userId, q, thread):
    # wait all task done
    thread.join()
    q.join()
    # delete images
    shutil.rmtree(userId)
    print('process done')
    user = User.objects.get(userId=userId)
    user.isSync = True
    user.lastSync = make_aware(datetime.datetime.utcnow(
    ), timezone=pytz.timezone(settings.TIME_ZONE))
    user.save()
    print('User isSync')


def toVisionApiLabel(userId, q):
    credent = service_account.Credentials.from_service_account_file(
        'Anster-4bf921cd3b7b.json')
    client = ImageAnnotatorClient(credentials=credent)
    while True:
        mediaItem = q.get()
        filename = mediaItem['filename']
        while not os.path.exists(f'{userId}/{filename}'):
            time.sleep(0.1)
        with open(f'{userId}/{filename}', 'rb') as f:
            content = f.read()
        image = types.Image(content=content)
        res = client.label_detection(image=image)
        labels = res.label_annotations
        sliceTime = mediaItem['mediaMetadata']['creationTime'].split('Z')[0]
        if '.' in mediaItem['mediaMetadata']['creationTime']:
            sliceTime = sliceTime.split('.')[0]
        sliceTime = datetime.datetime.strptime(sliceTime, "%Y-%m-%dT%H:%M:%S")
        print(sliceTime)
        # 這個才是正確的
        Photo.objects.create(
            userId=userId,
            photoId=mediaItem['id'],
            tag={
                'main_tag': 'temp',
                'emotion_tag': 'temp',
                'top3_tag': [{'tag': l.description, 'precision': str(l.score)}for l in labels[:3]],
                'all_tag': [{'tag': l.description, 'precision': str(l.score)}for l in labels[4:]]
            },
            location="invalid",
            time=make_aware(
                sliceTime, timezone=pytz.timezone(settings.TIME_ZONE))
        )
        q.task_done()
        print('done one')
        if res.error.message:
            raise Exception('{}\nFor more info on error messages, check: '
                            'https://cloud.google.com/apis/design/errors'.format(
                                res.error.message))


def downloadImage(session, userId, q):
    photoRes = session.get(
        'https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100').json()
    mediaItems = photoRes['mediaItems'][:3]
    # while photoRes.get('nextPageToken') != None:
    for mediaItem in mediaItems:
        q.put(mediaItem)
        mimeType = mediaItem['mimeType'].split('/')
        if not os.path.isdir(f'./{userId}'):
            try:
                os.mkdir(userId)
            except OSError:
                print("Creation of the directory failed")
        # only download images
        if mimeType[0] == 'image':
            # get the image data
            filename = mediaItem['filename']
            res = session.get(mediaItem['baseUrl']+'=d').content
            print(f'{filename} downloaded')
            with open(f'{userId}/{filename}', mode='wb') as handler:
                handler.write(res)


def checkUserToSession(data, req):

    if not req.headers.get('X-Requested-With') and req.headers.get('X-Requested') != 'com.aster':
        print('X-R-not-pass')
        return Response('CSRF', status=status.HTTP_403_FORBIDDEN)
    with open('client_secret.json', 'r', encoding='utf-8') as f:
        appSecret = json.load(f).get('web')
    CLIENT_ID, CLIENT_SECRET, TOKEN_URI = itemgetter(
        'client_id',
        'client_secret',
        'token_uri'
    )(appSecret)
    print('Hello')
    user = User.objects.filter(userId=data['sub'])

    access_token = ''
    if not user.exists():
        oauth = OAuth2Session(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            scope=data['scopes']
        )
        token = oauth.fetch_token(
            url=TOKEN_URI,
            grant_type="authorization_code",
            code=data['serverAuthCode'],
            redirect_url='http://localhost:3000/auth/callabck'
        )
        print('Hello')
        print(token)
        access_token = token['access_token']
        newUser = User.objects.create(
            userId=data['sub'],
            expiresAt=datetime.datetime.utcnow() + datetime.timedelta(0,
                                                                      token['expires_in']),
            refreshToken=token['refresh_token']
        )
        print('new user created')
        user = User.objects.filter(userId=data['sub'])
        print('create new user')
    userData = user.values()[0]
    credent = credentials.Credentials(
        access_token,
        token_uri=TOKEN_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        refresh_token=userData['refreshToken']
    )
    credent.expiry = userData['expiresAt'].replace(tzinfo=None)
    now = datetime.datetime.utcnow()
    print(credent.expiry)
    print(now)
    if now > credent.expiry:
        print('refreshing accessToken')
        try:
            credent.refresh(Request())
            user.update(expiresAt=make_aware(credent.expiry),
                        refreshToken=credent.refresh_token)
        except RefreshError as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print('auth done')
    return AuthorizedSession(credent), userData
