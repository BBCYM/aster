from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework import status
from .customResponse import simpleMessage
from .authenticate import checkUserToSession
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
        userSession = checkUserToSession(data, request)
        allMidea = userSession.get('https://photoslibrary.googleapis.com/v1/mediaItems').json()
        print(allMidea)
        return Response(simpleMessage('good'),status=status.HTTP_200_OK)





            
