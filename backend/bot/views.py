from django.shortcuts import render
import io
import os
from django.shortcuts import render
from rest_framework import views, response


# 自訂義一個View叫XXXView，繼承了rest_framework.views的APIView
class BotView(views.APIView):
    # global uri
    # http get method
    def get(self,request):
        
        if response.error.message:
            raise Exception(
                '{}\nFor more info on error messages, check: '
                    'https://cloud.google.com/apis/design/errors'.format(
                     response.error.message))
            return response

        return response

    # http post method
    def post(self,request):
        # get post data from request
        # data = request.data['uri']
        # print(data)
        # uri = data
        # print('posturi=',data)

        return response

    

