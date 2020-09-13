from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework import status
from django.core.handlers.wsgi import WSGIRequest
from .utils import simpleMessage
from .authenticate import checkUserToSession, downloadImage, toVisionApiLabel, afterAll, checkisSync, fetchNewImage
import threading
import queue
import json


class UserView(APIView):
    def get(self, request:WSGIRequest, userId:str=None):
        # check if database has user
        user = User.objects(userId=userId)
        if user:
            userData = user.get()
            userSession, _ = checkUserToSession(userId, request)
            isSyncState = checkisSync(userSession, userData.userId)
            user.update(set__isSync=isSyncState)
            r = {'isSync': isSyncState, 'isFreshing': userData.isFreshing}
            return Response(r, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_200_OK)
        
    def put(self, request:WSGIRequest, userId:str=None):
        q = queue.Queue()
        u = User.objects(userId=userId).get()
        if not u.isSync:
            userSession, user = checkUserToSession(userId, request)
            t = threading.Thread(
                name='update-image', target=fetchNewImage, args=(userSession, user['userId'], q))
            t.setDaemon(True)
            t2 = threading.Thread(
                name='toVisionLabel', target=toVisionApiLabel, args=(user['userId'], q))
            t2.setDaemon(True)
            t3 = threading.Thread(
                name='afterAll', target=afterAll, args=(user['userId'], q, t))
            t3.setDaemon(True)
            t.start()
            t2.start()
            t3.start()
            return Response({'isFreshing': True,'isSync': False}, status=status.HTTP_200_OK)
        else:
            return Response({'isSync': True,'isFreshing': False}, status=status.HTTP_200_OK)

class AuthView(APIView):

    def post(self, request:WSGIRequest, userId:str=None):
        # first time checkin
        userSession, user = checkUserToSession(userId, request)

        print('Checking Sync')

        if not user.isSync:
            print('isSync:', user.isSync)
            q = queue.Queue()
            t = threading.Thread(
                name='downloading-image', target=downloadImage, args=(userSession, user['userId'], q))
            # don't block main process
            t.setDaemon(True)

            t2 = threading.Thread(
                name='toVisionLabel', target=toVisionApiLabel, args=(user['userId'], q))
            t2.setDaemon(True)

            t3 = threading.Thread(
                name='afterAll', target=afterAll, args=(user['userId'], q, t))
            t3.setDaemon(True)
            t.start()
            t2.start()
            t3.start()
            return Response({'isSync': False, 'isFreshing': True}, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_204_NO_CONTENT)