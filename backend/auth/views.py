from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework import status
from .customResponse import simpleMessage
from .authenticate import checkUserToSession, downloadImage, toVisionApiLabel
import threading
import queue
class AuthView(APIView):
    
    def get(self, request):
        temp = request.query_params.get('userid',None)
        user = User.objects.filter(userId=temp)
        if user.exists():
            return Response(simpleMessage(True))
        else:
            return Response(simpleMessage(False))

            

    def post(self, request):
        data = request.data
        userSession, user = checkUserToSession(data, request)
        photoRes= userSession.get('https://photoslibrary.googleapis.com/v1/mediaItems').json()
        print(user['isSync'])
        q = queue.Queue()
        if not user['isSync']:
            photos=photoRes['mediaItems'][:3]
            t = threading.Thread(name='downloading-image',target=downloadImage,args=(userSession,user['userId'],photos,q))
            # don't block main process
            t.setDaemon(True)
            t.start()
            t2 = threading.Thread(name='toVisionLabel',target=toVisionApiLabel,args=(q,),daemon=True)
            t2.start()
        # use threading.enumerate to check thread pool
        return Response(simpleMessage('good'),status=status.HTTP_200_OK)





            
