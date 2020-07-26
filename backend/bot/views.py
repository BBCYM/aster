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
from photo.models import Photo

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
        # print("parameters:",parameters)

        # location = parameters.fields['location'].list_value.values[0].struct_value.fields['city'].string_value
        # photo = parameters.fields['photo'].list_value.values[0].string_value
        # datetime = parameters.fields['date-time'].list_value.values[0].string_value
        # vision = parameters.fields['visionAPI_1000'].list_value.values[0].string_value
        
        photo = parameters.fields['photo'].list_value
        datetime = parameters.fields['date-time'].list_value
        vision = parameters.fields['visionAPI_1000'].list_value
        location = parameters.fields['location'].list_value
        pid = []
        pictures = Photo.objects.filter(userId = '113073984862808105932')
        
        def getpid(key):
            try:
                for i in pictures:
                    # print(i)
                    # print(type(i))
                    # print('main:',i.tag['main_tag'])
                    # print('type:',type(i.tag['main_tag']))
                    if(i.tag['main_tag'] == key):
                        print('main:',i.tag['main_tag'])
                        print('photoid:',i.photoId)
                        pid.append(i.photoId)
                        print('pid:',pid)
                    
            except Exception as e:
                print(e)

        if len(photo) is not 0:
            photokey = photo.values[0].string_value
            getpid(photokey)

        if len(datetime) is not 0:
            datetimekey = datetime.values[0].string_value
            getpid(datetimekey)

        if len(vision) is not 0:
            for i in range(len(vision.values)):
                vikey = vision.values[i].string_value
                # print(vikey)
                getpid(vikey)

        if len(location) is not 0:
            admin_areakey = location.values[0].struct_value.fields['admin-area'].string_value
            if(admin_areakey != ''):
                # print(admin_areakey)
                getpid(admin_areakey)
            bus_namekey = location.values[0].struct_value.fields['business-name'].string_value
            if(bus_namekey != ''):
                # print(bus_namekey)
                getpid(bus_namekey)
            citykey = location.values[0].struct_value.fields['city'].string_value
            if(citykey != ''):
                # print(citykey)
                getpid(citykey)
            countrykey = location.values[0].struct_value.fields['country'].string_value
            if(countrykey != ''):
                # print(countrykey)
                getpid(countrykey)
            islandkey = location.values[0].struct_value.fields['island'].string_value
            if(islandkey != ''):
                # print(islandkey)
                getpid(islandkey)
            shortcutkey = location.values[0].struct_value.fields['shortcut'].string_value
            if(shortcutkey != ''):
                # print(shortcutkey)
                getpid(shortcutkey)
            street_addresskey = location.values[0].struct_value.fields['street-address'].string_value
            if(street_addresskey != ''):
                # print(street_addresskey)
                getpid(street_addresskey)
            subadmin_areakey = location.values[0].struct_value.fields['subadmin-area'].string_value
            if(subadmin_areakey != ''):
                # print(subadmin_areakey)
                getpid(subadmin_areakey)
            zip_codekey = location.values[0].struct_value.fields['zip-code'].string_value
            if(zip_codekey != ''):
                # print(zip_codekey)
                getpid(zip_codekey)

        re = MessageToJson(res.query_result)
        vivi = {"dialog" : re, "pid" : pid}
        vivi = json.dumps(vivi)
 
        return response.Response(vivi)
    

