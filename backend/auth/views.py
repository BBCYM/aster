from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from rest_framework import status
from .utils import simpleMessage
from .authenticate import checkUserToSession, downloadImage, toVisionApiLabel, afterAll
import threading
import queue
class AuthView(APIView):
    
    def get(self, request):
        temp = request.query_params.get('userid',None)
        # user = User.objects.filter(userId=temp)
        user = User.objects(userId=temp)
        if user:
            return Response(simpleMessage(True))
        else:
            return Response(simpleMessage(False))

    def post(self, request):
        data = request.data

        userSession, user = checkUserToSession(data, request)
        
        print(user['isSync'])
        q = queue.Queue()

        if not user['isSync']:
            t = threading.Thread(name='downloading-image',target=downloadImage,args=(userSession,user['userId'],q))
            # don't block main process
            t.setDaemon(True)
            
            t2 = threading.Thread(name='toVisionLabel',target=toVisionApiLabel,args=(user['userId'],q))
            t2.setDaemon(True)
            
            t3 = threading.Thread(name='afterAll',target=afterAll, args=(user['userId'],q,t))
            t3.setDaemon(True)
            t.start()
            t2.start()
            t3.start()
        # use threading.enumerate to check thread pool
        return Response(simpleMessage('good'),status=status.HTTP_200_OK)
    def put(self, request):
        q = queue.Queue()
        data = request.data
        userSession, user = checkUserToSession(data,request)
        t = threading.Thread(name='update-image', target=fetchNewImage,args=(userSession,user['userOd'],q))
        t.setDaemon(True)
        t2 = threading.Thread(name='toVisionLabel',target=toVisionApiLabel,args=(user['userId'],q))
        t2.setDaemon(True)
        t3 = threading.Thread(name='afterAll',target=afterAll, args=(user['userId'],q,t))
        t3.setDaemon(True)
        t.start()
        t2.start()
        t3.start()
        return Response(simpleMessage('updateImage good'),status=status.HTTP_200_OK)





            
