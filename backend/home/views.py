#from django.shortcuts import render
from rest_framework import views, response, status
#import dialogflow_v2 as dialogflow
#from google.oauth2 import service_account
from operator import itemgetter
import json
#from google.api_core.exceptions import InvalidArgument
#from google.protobuf.json_format import MessageToJson

# Create your views here.

class HomeView(views.APIView):
    def get(self, request):

      data = {'tag':'dog',
              
               }
     
      y = json.dumps(data)
      print(y)
        #re = MessageToJson(data)

      return response.Response(data)

