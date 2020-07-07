from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import status
from .customResponse import simpleMessage
from .authenticate import checkUserToSession
class AuthView(APIView):
    
    def get(self, request):
        print(request.headers.keys())
        return Response(simpleMessage('hello world'))

    def post(self, request):
        data = request.data
        userSession = checkUserToSession(data, request)
        allMidea = userSession.get('https://photoslibrary.googleapis.com/v1/mediaItems').json()
        print(type(allMidea))
        return Response(simpleMessage(type(allMidea)),status=status.HTTP_200_OK)





            
