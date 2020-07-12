from rest_framework import status
from rest_framework.response import Response
from .customResponse import simpleMessage
from .models import User
from .serializer import UserSerializer
import json
from operator import itemgetter
from google.oauth2 import id_token, credentials
from google.auth.transport.requests import Request, AuthorizedSession
from authlib.integrations.requests_client import OAuth2Session
import datetime
from google.auth.exceptions import RefreshError
from django.utils.timezone import make_aware
from threading import Thread


    


def downloadImage(session,userId, mediaItem):
    # get item type
    mimeType = mediaItem.mimeType.split('/')
    fileType = ''
    # only download images 
    if mimeType[0]=='image':
        # get the image data
        res = session.get(mediaItem.baseUrl+'=d').content
        filename = mediaItem.filename
        if mimeType[1]=='jpeg':
            fileType='jpg'
        elif mimeType[1]=='png':
            fileType = 'png'
        with open(f'{userId}/{filename}.{fileType}',mode='wb') as handler:
            handler.write(res)

def checkUserToSession(data, req):
    if not req.headers.get('X-Requested-With') and req.headers.get('X-Requested') != 'com.aster':
        print('X-R-not-pass')
        return Response('CSRF', status=status.HTTP_403_FORBIDDEN)
    with open('client_secret.json', 'r', encoding='utf-8') as f:
        appSecret = json.load(f).get('web')
        print(appSecret)
    CLIENT_ID, CLIENT_SECRET, TOKEN_URI = itemgetter(
        'client_id',
        'client_secret',
        'token_uri'
    )(appSecret)
    try:
        idInfo = id_token.verify_oauth2_token(
            data['idToken'],
            Request(),
            CLIENT_ID
        )
        if idInfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong Issuer')
    except ValueError as e:
        return Response(e, status=status.HTTP_403_FORBIDDEN)
    print('Step 1 auth check pass')

    user = User.objects.filter(userId=idInfo['sub'])

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
        newUser = UserSerializer(data={
            'userId': idInfo['sub'],
            'expiresAt': datetime.datetime.utcnow() + datetime.timedelta(0,token['expires_in']),
            'refreshToken': token['refresh_token']
        })
        if newUser.is_valid():
            newUser.save()
            print('new user created')
        user = User.objects.filter(userId=idInfo['sub'])
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
    return AuthorizedSession(credent)
