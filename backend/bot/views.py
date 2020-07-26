from django.shortcuts import render
import io
import os
from rest_framework import views , response ,status
from google.oauth2 import service_account
from operator import itemgetter
import dialogflow_v2 as dialogflow
import json
from google.api_core.exceptions import InvalidArgument
from google.protobuf.json_format import MessageToJson

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
        data = request.data['usermsg']
        # print('這是request=',request)
        # print('這是data=',data)

        # print('這是response.data=',request.data)
        #return response.Response("ok")


        credentials = service_account.Credentials.from_service_account_file('dfcredentials.json').with_scopes(['https://www.googleapis.com/auth/dialogflow'])

        with open('dfcredentials.json', encoding='utf-8') as f:
            appSecret = json.load(f)
            print(appSecret)
            PROJECT_ID = itemgetter("project_id")(appSecret)
        session_id = 'userforDemo12345'
        text = data   #這裡改成在RN輸入的字串
        # print('測試抓不抓得到=',data)
        

        session_client = dialogflow.SessionsClient(credentials=credentials)
        session = session_client.session_path(PROJECT_ID,session_id)

        text_input = dialogflow.types.TextInput(text=text, language_code='zh-TW')
        query_input = dialogflow.types.QueryInput(text=text_input)
        try:
            res = session_client.detect_intent(session=session, query_input=query_input)
        except InvalidArgument:
            return response.Response("InvalidArgument",status=status.HTTP_400_BAD_REQUEST)

        # print("測試用:", res.query_result)
        parameters = res.query_result.parameters
        print("parameters:",parameters)

        # location = parameters.fields['location'].list_value.values[0].struct_value.fields['city'].string_value
        # photo = parameters.fields['photo'].list_value.values[0].string_value
        # datetime = parameters.fields['date-time'].list_value.values[0].string_value
        # vision = parameters.fields['visionAPI_1000'].list_value.values[0].string_value
        photo = parameters.fields['photo'].list_value
        datetime = parameters.fields['date-time'].list_value
        vision = parameters.fields['visionAPI_1000'].list_value
        
        if len(photo) is not 0:
            # print('photo: ',photo)
            # print(photo.values[0].string_value)
            photokey = photo.values[0].string_value
            print(photokey)

        if len(datetime) is not 0:
            # print(datetime.values[0].string_value)
            datetimekey = datetime.values[0].string_value
            print(datetimekey)

        if len(vision) is not 0:
            # print(vision.values[0].string_value)
            visionkey = vision.values[0].string_value
            print(visionkey)

        # print("抓:", res.query_result.parameters.fields['dogBreed'].list_value.values[0].string_value)
        #print("測試用Fulfillment message:", res.query_result.fulfillment_messages.text['text'].text)
        #print("data:", res.query_result)

        re = MessageToJson(res.query_result)

        return response.Response(re)

    

