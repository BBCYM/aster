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
from mongoengine.queryset.visitor import Q

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
        userid = request.data['userid']
        # print('userid',userid)


        credentials = service_account.Credentials.from_service_account_file('dfcredentials.json').with_scopes(['https://www.googleapis.com/auth/dialogflow'])

        with open('dfcredentials.json', encoding='utf-8') as f:
            appSecret = json.load(f)
            # print(appSecret)
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
        
        # photo = parameters.fields['photo'].list_value
        emotion = parameters.fields['emotion'].list_value
        datetime = parameters.fields['date-time'].list_value
        vision = parameters.fields['visionAPI_1000'].list_value
        location = parameters.fields['location'].list_value
        pid = []
        # tag = []
        pid_tag = []
        def getpid(key):
            try:
                # main = Photo.objects(tag__main_tag='天空')
                def addpid(pidarr, key):
                    for i in pidarr:
                        tag = []
                        photoid = i.photoId
                        # print('photoid:',photoid)
                        pid.append(photoid)
                        print('key in add:',key)
                        tag.append(key)
                        temptag = tag
                        print('tag:',tag)
                        pid_tag.append({"pid":photoid, "tag":temptag})
                        print('pid_tag',pid_tag)

                print('key',key)

                emo = Photo.objects(Q(userId=userid) & Q(tag__emotion_tag=key))
                print('emotion:',emo)
                addpid(emo, key)

                main = Photo.objects(Q(userId=userid) & Q(tag__main_tag=key))
                print('main:',main)
                addpid(main, key)

                top3 = Photo.objects(Q(userId=userid) & Q(tag__top3_tag__tag=key))
                print('top3:',top3)
                addpid(top3, key)

                alltag = Photo.objects(Q(userId=userid) & Q(tag__all_tag__tag=key))
                print('alltag:',alltag)
                addpid(alltag, key)

                custom = Photo.objects(Q(userId=userid) & Q(tag__custom_tag__is_deleted=False) & Q(tag__custom_tag__tag=key))
                print('custom:',custom)
                addpid(custom, key)

                loctag = Photo.objects(Q(userId=userid) & Q(location=key))
                print('loctag:',loctag)
                addpid(loctag, key)
                # print('pid:',pid)

            except Exception as e:
                print(e)


        if len(emotion) is not 0:
            emokey = emotion.values[0].string_value
            getpid(emokey)

        if len(datetime) is not 0:
            datetimekey = datetime.values[0].string_value
            getpid(datetimekey)

        if len(vision) is not 0:
            vikeyArray = map(lambda k: k.string_value,vision.values)
            vikeyArray = set(vikeyArray)
            vikeyArray = list(vikeyArray)
            for i in vikeyArray:
                getpid(i)

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
        # print('lastpid',pid)
        re = MessageToJson(res.query_result)
        res = {"dialog" : re, "pid" : pid, "pid_tag" : pid_tag}
        # print('res:',res)
        res = json.dumps(res)
 
        return response.Response(res)
    

