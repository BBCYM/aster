from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework import status
from django.core.handlers.wsgi import WSGIRequest
from .utils import simpleMessage
from .authenticate import checkUserToSession, checkisSync, MainProcess
import threading
import queue
import json
from ontology.utils import ColorProcess


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
            process = MainProcess(session=userSession, userId=userId)
            threading.Thread(target=process.refresh,daemon=True).start()
            
            # color
            if user.color_onto.subscribed:
                color_process = ColorProcess(session=userSession, userId=userId)
                threading.Thread(target=color_process.refresh,daemon=True).start()
            return Response({'isFreshing': True,'isSync': False}, status=status.HTTP_200_OK)
        else:
            return Response({'isSync': True,'isFreshing': False}, status=status.HTTP_200_OK)

class AuthView(APIView):

    def post(self, request:WSGIRequest, userId:str=None):
        u = User.objects(userId=userId)
        # check if first time login
        if not u:
            userSession, user = checkUserToSession(userId, request)
            process = MainProcess(session=userSession, userId=userId)
            threading.Thread(target=process.initial,daemon=True).start()
            # color
            color_process = ColorProcess(session=userSession, userId=userId)
            threading.Thread(target=color_process.initial,daemon=True).start()
            return Response({'isSync': user.isSync, 'isFreshing': user.isFreshing}, status=status.HTTP_200_OK)
        else :
            u=u.get()
            return Response({'isSync': u.isSync, 'isFreshing': u.isFreshing}, status=status.HTTP_200_OK)
