from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from auth.customResponse import simpleMessage
from photo.models import Photo
#import dialogflow_v2 as dialogflow
#from google.oauth2 import service_account
from operator import itemgetter
import json
#from google.api_core.exceptions import InvalidArgument
#from google.protobuf.json_format import MessageToJson

# Create your views here.


class HomeView(APIView):
    def get(self, request):
        """根據userid取得所有相簿

        Args:
            request: 裡面需要有photoId和emotion

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """
        data = {'id': '1',
                'image': 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg'
                }
        y = json.dumps(data)
        print(y)

        return Response(data)

    def post(self, request):

        return Response(simpleMessage('POST/HomeView'), status=status.HTTP_200_OK)

    def put(self, request):

        data = {'tag': 'dog',

                }

        y = json.dumps(data)
        print(y)
        #re = MessageToJson(data)

        return Response(simpleMessage('PUT/HomeView'), status=status.HTTP_200_OK)

        def delete(self, request):

            return Response(simpleMessage('DELETE/HomeView'))
