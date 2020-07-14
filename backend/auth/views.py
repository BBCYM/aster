from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework import status
from .customResponse import simpleMessage
from .authenticate import checkUserToSession, downloadImage
import threading
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
        userSession, userId = checkUserToSession(data, request)
        photoRes= userSession.get('https://photoslibrary.googleapis.com/v1/mediaItems').json()
        for i, photo in enumerate(photoRes['mediaItems'][:3]):
            t = threading.Thread(name=f'image-{i}',target=downloadImage,args=(userSession,userId,photo))
            # don't block main process
            t.setDaemon(True)
            t.start()
        # use threading.enumerate to check thread pool
        return Response(simpleMessage('good'),status=status.HTTP_200_OK)





            
