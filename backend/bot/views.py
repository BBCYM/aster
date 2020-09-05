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
from album.models import Album
from mongoengine.queryset.visitor import Q
from datetime import datetime
from datetime import timedelta

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
        
        emotion = parameters.fields['emotion'].list_value
        date = parameters.fields['date'].list_value
        dateperiod = parameters.fields['date-period'].list_value
        vision = parameters.fields['visionAPI_1000'].list_value
        location = parameters.fields['location'].list_value
        pid = []
        pid_tag = []
        def addpid(pidarr, key):
            for i in pidarr:
                tag = []
                photoid = i.photoId
                # print('photoid:',photoid)
                pid.append(photoid)
                # print('key in add:',key)
                tag.append(key)
                temptag = tag
                # print('tag:',tag)
                pid_tag.append({"pid":photoid, "tag":temptag})
                print('pid_tag',pid_tag)

        def getpid(key):
            try:
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

                location = Photo.objects(Q(userId=userid) & Q(location=key))
                print('location:',location)
                addpid(location, key)

                album = Album.objects(Q(userId=userid) & Q(albumTag__isDeleted=False) & Q(albumTag__tag=key))
                # print('album:',album)
                for i in album:
                    photos = i.albumPhoto
                    # print('photos:',photos)
                    for j in photos:
                        atag = []
                        isdeleted = j.isDeleted
                        if isdeleted is False:
                            pid.append(j.photoId)
                            atag.append(key)
                            atemptag = atag
                            pid_tag.append({"pid":j.photoId, "tag":atemptag})
                            print('pid_tag',pid_tag)

            except Exception as e:
                print(e)


        if len(emotion) is not 0:
            emokey = emotion.values[0].string_value
            getpid(emokey)

        # 抓單一日期(ex:昨天)
        if len(date) is not 0:
            datekey = date.values[0].string_value
            datekey = datetime.strptime(datekey, "%Y-%m-%dT%H:%M:%S+08:00")
            datekey= datetime.strftime(datekey,"%Y-%m-%d")
            today = datetime.strptime(datekey, "%Y-%m-%d")
            # print('today',today)
            tomorrow = today + timedelta(days=1)
            tomorrow = datetime.strftime(tomorrow, "%Y-%m-%d")
            # print('tomorrow',tomorrow)
            date = Photo.objects(Q(userId=userid) & Q(createTime__lt=tomorrow) & Q(createTime__gt=datekey))
            print('date:',date)
            addpid(date, datekey)
        
        # 抓時間區間(ex:今年,上禮拜)
        if len(dateperiod) is not 0:
            dpstart = dateperiod.values[0].struct_value.fields['startDate'].string_value
            dpend = dateperiod.values[0].struct_value.fields['endDate'].string_value
            # print('dpstart',dpstart)
            # print('dpend',dpend)
            start = datetime.strptime(dpstart, "%Y-%m-%dT%H:%M:%S+08:00")
            start= datetime.strftime(start,"%Y-%m-%d")
            # print('start',start)
            end = datetime.strptime(dpend, "%Y-%m-%dT%H:%M:%S+08:00")
            end= datetime.strftime(end,"%Y-%m-%d")
            # print('end',end)

            dateperiod = Photo.objects(Q(userId=userid) & Q(createTime__lt=end) & Q(createTime__gt=start))
            print('dateperiod:',dateperiod)
            periodkey = start + '-' + end
            # print('periodkey:',periodkey)
            addpid(dateperiod, periodkey)

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
    

