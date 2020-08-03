from rest_framework import status
from rest_framework.response import Response
from .customResponse import simpleMessage
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
from google.cloud.vision import ImageAnnotatorClient, types
import time
from photo.models import Photo, Tag, ATag
from aster import settings
import shutil
import pytz
from googletrans import Translator as g_translator
from mongoengine.queryset.visitor import Q


def fetchNewImage(session, userId, q):
    nPT = ''
    params = {'pageSize': '15'}
    while True:
        if nPT:
            params['nextPageToken'] = nPT
        photoRes = session.get(
            'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
        mediaItems = photoRes['mediaItems']
        for mediaItem in mediaItems:
            # can do better using time
            dbRes = Photo.objects(
                Q(userId=userId) & Q(photoId=mediaItem['id']))
            if not dbRes:
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
                    q.put(mediaItem)
        # if not photoRes['nextPageToken']:
        if photoRes['nextPageToken']:
            break
        else:
            nPT = photoRes['nextPageToken']


def afterAll(userId, q, thread):
    # wait all task done
    thread.join()
    q.join()
    # delete images
    shutil.rmtree(userId)
    print('process done')
    user = User.objects(userId=userId)
    user.update(
        isSync=True,
        lastSync=make_aware(datetime.datetime.utcnow(),
                            timezone=pytz.timezone(settings.TIME_ZONE))
    )
    print('User isSync')


def toVisionApiLabel(userId, q):
    credent = service_account.Credentials.from_service_account_file(
        'anster-1593361678608.json')
    client = ImageAnnotatorClient(credentials=credent)
    translator = g_translator()
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
        t = Tag(
            main_tag=translator.translate(
                labels[0].description.lower(), dest="zh-tw").text
        )
        for l in labels[:3]:
            t.top3_tag.append(ATag(tag=l.description, precision=str(l.score)))
        for l in labels[4:]:
            t.all_tag.append(ATag(tag=l.description, precision=str(l.score)))
        pho = Photo(
            photoId=mediaItem['id'],
            userId=userId,
            tag=t,
            createTime=make_aware(
                sliceTime, timezone=pytz.timezone(settings.TIME_ZONE)),
        )
        pho.save()
        q.task_done()
        print('done one')
        if res.error.message:
            raise Exception('{}\nFor more info on error messages, check: '
                            'https://cloud.google.com/apis/design/errors'.format(
                                res.error.message))


def downloadImage(session, userId, q):
    nPT = ''
    params = {'pageSize': '8'}
    while True:
        if nPT:
            params['nextPageToken'] = nPT
        photoRes = session.get(
            'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
        mediaItems = photoRes['mediaItems']
        for mediaItem in mediaItems:
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
                q.put(mediaItem)
        # if not photoRes['nextPageToken']:
        if photoRes['nextPageToken']:
            break
        else:
            nPT = photoRes['nextPageToken']
    # photoRes = session.get('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100').json()
    # mediaItems = photoRes['mediaItems'][:10]
    # # while photoRes.get('nextPageToken') != None:
    # for mediaItem in mediaItems:
    #     q.put(mediaItem)
    #     mimeType = mediaItem['mimeType'].split('/')
    #     if not os.path.isdir(f'./{userId}'):
    #         try:
    #             os.mkdir(userId)
    #         except OSError:
    #             print("Creation of the directory failed")
    #     # only download images
    #     if mimeType[0] == 'image':
    #         # get the image data
    #         filename = mediaItem['filename']
    #         res = session.get(mediaItem['baseUrl']+'=d').content
    #         print(f'{filename} downloaded')
    #         with open(f'{userId}/{filename}', mode='wb') as handler:
    #             handler.write(res)


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
    # user = User.objects.filter(userId=data['sub'])
    user = User.objects(userId=data['sub'])
    access_token = ''
    if not user:
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
        # newUser = User.objects.create(
        #     userId=data['sub'],
        #     expiresAt=datetime.datetime.utcnow() + datetime.timedelta(0,
        #                                                               token['expires_in']),
        #     refreshToken=token['refresh_token']
        # )
        newUser = User(
            userId=data['sub'],
            expiresAt=datetime.datetime.utcnow() + datetime.timedelta(0,
                                                                      token['expires_in']),
            refreshToken=token['refresh_token']
        )
        newUser.save()
        print('new user created')
        # user = User.objects.filter(userId=data['sub'])
        user = User.objects(userId=data['sub'])
        print('create new user')
    # userData = user.values()[0]
    userData = user[0]
    credent = credentials.Credentials(
        access_token,
        token_uri=TOKEN_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        refresh_token=userData.refreshToken
        # refresh_token=userData['refreshToken']
    )
    # credent.expiry = userData['expiresAt'].replace(tzinfo=None)
    credent.expiry = userData.expiresAt.replace(tzinfo=None)
    now = datetime.datetime.utcnow()
    print(credent.expiry)
    print(now)
    if now > credent.expiry:
        print('refreshing accessToken')
        try:
            credent.refresh(Request())
            # user.update(expiresAt=make_aware(credent.expiry),
            #             refreshToken=credent.refresh_token)
            user.update(set__expiresAt=make_aware(credent.expiry),
                        set__refreshToken=credent.refresh_token)
        except RefreshError as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print('auth done')
    return AuthorizedSession(credent), userData
