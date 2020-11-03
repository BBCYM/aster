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
from ordered_set import OrderedSet

class BotView(views.APIView):
    # http post method
    def post(self, request, userId:str=None):
        data = request.data['usermsg']
        userid = userId
        # en or zh-tw
        lancode = request.data['lancode']
        if lancode == 'zh-tw':
            crefilename_cus = 'anster-1593361678608.json'
            crefilename = 'dfcredentials.json'
        elif lancode == 'en':
            crefilename_cus = 'eng-general-folh-e6f47c291234.json'
            crefilename = 'eng-pvbi-05019ab875a9.json'
        
        # for custom tag search with general agent
        def get_res_cus(data):
            credentials = service_account.Credentials.from_service_account_file(crefilename_cus).with_scopes(['https://www.googleapis.com/auth/dialogflow'])

            with open(crefilename_cus, encoding='utf-8') as f:
                appSecret = json.load(f)
                # print(appSecret)
                PROJECT_ID = itemgetter("project_id")(appSecret)
            session_id = 'userforDemo12345'
            text = data   #這裡改成在RN輸入的字串
            # print('測試抓不抓得到=',data)
            
            session_client = dialogflow.SessionsClient(credentials=credentials)
            session = session_client.session_path(PROJECT_ID,session_id)

            text_input = dialogflow.types.TextInput(text=text, language_code=lancode)
            query_input = dialogflow.types.QueryInput(text=text_input)
            try:
                res = session_client.detect_intent(session=session, query_input=query_input)
                # print('res:',res)
                return res
            except InvalidArgument:
                return response.Response("InvalidArgument",status=status.HTTP_400_BAD_REQUEST)
        
        def get_url_cus(res_cus):
            parameters = res_cus.query_result.parameters
            general_object_any = parameters.fields['general_object_any'].list_value
            pid_tag = []
            if len(general_object_any) is not 0:
                gkeyArray = map(lambda k: k.string_value,general_object_any.values)
                gkeyArray = set(gkeyArray)
                gkeyArray = list(gkeyArray)
                for i in gkeyArray:
                    try:
                        if lancode == 'zh-tw':
                            custom = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__custom_tag__is_deleted=False) & Q(tag__zh_tw__custom_tag__tag=i))
                            # print('custom:',custom)
                        else:
                            custom = Photo.objects(Q(userId=userid) & Q(tag__en__custom_tag__is_deleted=False) & Q(tag__en__custom_tag__tag=i))
                            # print('custom:',custom)
                        for j in custom:
                            tag = []
                            photoid = j.photoId
                            # print('photoid:',photoid)
                            pid.append(photoid)
                            print('key in add:',i)
                            tag.append(i)
                            temptag = tag
                            # print('tag:',tag)
                            pid_tag.append({"pid":photoid, "tag":temptag})
                            # print('pid_tag',pid_tag)
                    except Exception as e:
                        print(e)
            return pid_tag
        # for all tags search with testing agent
        def get_res(data):
            credentials = service_account.Credentials.from_service_account_file(crefilename).with_scopes(['https://www.googleapis.com/auth/dialogflow'])
            
            with open(crefilename, encoding='utf-8') as f:
                appSecret = json.load(f)
                # print(appSecret)
                PROJECT_ID = itemgetter("project_id")(appSecret)
            session_id = 'userforDemo12345'
            text = data   #這裡改成在RN輸入的字串
            # print('測試抓不抓得到=',data)
            
            session_client = dialogflow.SessionsClient(credentials=credentials)
            session = session_client.session_path(PROJECT_ID,session_id)

            text_input = dialogflow.types.TextInput(text=text, language_code=lancode)
            query_input = dialogflow.types.QueryInput(text=text_input)
            try:
                res = session_client.detect_intent(session=session, query_input=query_input)
                # print("res",res)
                return res
            except InvalidArgument:
                return response.Response("InvalidArgument",status=status.HTTP_400_BAD_REQUEST)

        def get_url(res):
            print("測試用:", res.query_result.intent.display_name)
            intent = res.query_result.intent.display_name
            parameters = res.query_result.parameters
            # print("parameters:",parameters)
            emotion = []
            date = []
            dateperiod = []
            vision = []
            location = []
            vision_origin = []
            color = []
            if intent == "AskColorEntity":
                # print("okkkkkkk")
                vision = parameters.fields['visionAPI_1000'].list_value
                color = parameters.fields['color'].list_value
            else:
                emotion = parameters.fields['emotion'].list_value
                date = parameters.fields['date'].list_value
                dateperiod = parameters.fields['date-period'].list_value
                vision = parameters.fields['visionAPI_1000'].list_value
                location = parameters.fields['location'].list_value
                vision_origin = parameters.fields['visionAPI_1000_original'].list_value

            pid = []
            pid_tag = []
            def addpid(pidarr, key, orkey):
                for i in pidarr:
                    tag = []
                    photoid = i.photoId
                    pid.append(photoid)
                    # print('key in add:',key)
                    if orkey == "null":
                        tag.append(key)
                    else:
                        tag.append(orkey)
                    temptag = tag
                    pid_tag.append({"pid":photoid, "tag":temptag})
                    # print('pid_tag',pid_tag)

            def getpid(key,orkey):
                try:
                    # print('key',key)
                    if lancode == 'zh-tw':
                        emo = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__emotion_tag=key))
                        # # print('emotion:',emo)
                        addpid(emo, key, orkey)

                        main = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__main_tag__tag=key))
                        # print('main:',main)
                        addpid(main, key, orkey)

                        color = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__color=key))
                        # print('color:',color)
                        addpid(color, key, orkey)

                        # colobj = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__color__obj=key))
                        # # print('colobj:',colobj)
                        # addpid(colobj, key, orkey)

                        peopleon = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__people__ontology=key))
                        # print('peopleon:',peopleon)
                        addpid(peopleon, key, orkey)

                        # peopleceb = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__people__celebrity=key))
                        # # print('peopleceb:',peopleceb)
                        # addpid(peopleceb, key, orkey)

                        custom = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__custom_tag__is_deleted=False) & Q(tag__zh_tw__custom_tag__tag=key))
                        # print('custom:',custom)
                        addpid(custom, key, orkey)

                        location = Photo.objects(Q(userId=userid) & Q(tag__zh_tw__location=key))
                        # print('location:',location)
                        addpid(location, key, orkey)
                    else:
                        emo = Photo.objects(Q(userId=userid) & Q(tag__en__emotion_tag=key))
                        # # print('emotion:',emo)
                        addpid(emo, key, orkey)

                        main = Photo.objects(Q(userId=userid) & Q(tag__en__main_tag__tag=key))
                        # print('main:',main)
                        addpid(main, key, orkey)

                        color = Photo.objects(Q(userId=userid) & Q(tag__en__color=key))
                        # print('color:',color)
                        addpid(color, key, orkey)

                        # colobj = Photo.objects(Q(userId=userid) & Q(tag__en__color__obj=key))
                        # # print('colobj:',colobj)
                        # addpid(colobj, key, orkey)

                        peopleon = Photo.objects(Q(userId=userid) & Q(tag__en__people__ontology=key))
                        # print('peopleon:',peopleon)
                        addpid(peopleon, key, orkey)

                        # peopleceb = Photo.objects(Q(userId=userid) & Q(tag__en__people__celebrity=key))
                        # # print('peopleceb:',peopleceb)
                        # addpid(peopleceb, key, orkey)

                        custom = Photo.objects(Q(userId=userid) & Q(tag__en__custom_tag__is_deleted=False) & Q(tag__en__custom_tag__tag=key))
                        # print('custom:',custom)
                        addpid(custom, key, orkey)

                        location = Photo.objects(Q(userId=userid) & Q(tag__en__location=key))
                        # print('location:',location)
                        addpid(location, key, orkey)


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
                                # print('pid_tag',pid_tag)

                except Exception as e:
                    print(e)


            if len(emotion) is not 0:
                emokey = emotion.values[0].string_value
                getpid(emokey,"null")

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
                # print('date:',date)
                addpid(date, datekey, "null")
            
            # 抓時間區間(ex:今年,上禮拜)
            if len(dateperiod) is not 0:
                dpstart = dateperiod.values[0].struct_value.fields['startDate'].string_value
                dpend = dateperiod.values[0].struct_value.fields['endDate'].string_value

                start = datetime.strptime(dpstart, "%Y-%m-%dT%H:%M:%S+08:00")
                start= datetime.strftime(start,"%Y-%m-%d")

                end = datetime.strptime(dpend, "%Y-%m-%dT%H:%M:%S+08:00")
                end= datetime.strftime(end,"%Y-%m-%d")

                dateperiod = Photo.objects(Q(userId=userid) & Q(createTime__lt=end) & Q(createTime__gt=start))
                periodkey = start + '-' + end
                addpid(dateperiod, periodkey, "null")

            if len(vision) is not 0:
                if intent == "AskColorEntity":
                    # print("okkkkkkk")
                    vikeyArray = map(lambda k: k.string_value,vision.values)
                    vikeyArray = OrderedSet(vikeyArray)
                    vikeyArray = list(vikeyArray)
                    for i in range(len(vikeyArray)):
                        getpid(vikeyArray[i],"null")
                else:
                    vikeyArray = map(lambda k: k.string_value,vision.values)
                    # vikeyArray = set(vikeyArray)
                    vikeyArray = OrderedSet(vikeyArray)
                    vikeyArray = list(vikeyArray)
                    originArray = map(lambda k: k.string_value,vision_origin.values)
                    originArray = OrderedSet(originArray)
                    originArray = list(originArray)
                    # print("vikeyArray:",vikeyArray)
                    # print("originArray:",originArray)
                    for i in range(len(vikeyArray)):
                        getpid(vikeyArray[i],originArray[i])
            
            if len(color) is not 0:
                colkeyArray = map(lambda k: k.string_value,color.values)
                colkeyArray = OrderedSet(colkeyArray)
                colkeyArray = list(colkeyArray)
                for i in range(len(colkeyArray)):
                    getpid(colkeyArray[i],"null")

            if len(location) is not 0:
                admin_areakey = location.values[0].struct_value.fields['admin-area'].string_value
                if(admin_areakey != ''):
                    getpid(admin_areakey,"null")
                bus_namekey = location.values[0].struct_value.fields['business-name'].string_value
                if(bus_namekey != ''):
                    getpid(bus_namekey,"null")
                citykey = location.values[0].struct_value.fields['city'].string_value
                if(citykey != ''):
                    getpid(citykey,"null")
                countrykey = location.values[0].struct_value.fields['country'].string_value
                if(countrykey != ''):
                    getpid(countrykey,"null")
                islandkey = location.values[0].struct_value.fields['island'].string_value
                if(islandkey != ''):
                    getpid(islandkey,"null")
                shortcutkey = location.values[0].struct_value.fields['shortcut'].string_value
                if(shortcutkey != ''):
                    getpid(shortcutkey,"null")
                street_addresskey = location.values[0].struct_value.fields['street-address'].string_value
                if(street_addresskey != ''):
                    getpid(street_addresskey,"null")
                subadmin_areakey = location.values[0].struct_value.fields['subadmin-area'].string_value
                if(subadmin_areakey != ''):
                    getpid(subadmin_areakey,"null")
                zip_codekey = location.values[0].struct_value.fields['zip-code'].string_value
                if(zip_codekey != ''):
                    getpid(zip_codekey,"null")
            return pid_tag

        pid = []
        # for general(custom) agent
        res1 = get_res_cus(data)
        pid_tag1 = get_url_cus(res1)
        print("pid_tag1:",pid_tag1)
        # print("pid_tag len:",len(pid_tag1))
        re1 = MessageToJson(res1.query_result)
        # print(re1)

        # for testing agent
        res = get_res(data)
        pid_tag = get_url(res)
        re = MessageToJson(res.query_result)
        # print("re",re)
        print("pid_tag:",pid_tag)


        if(len(pid_tag1) == 0 and len(pid_tag) == 0):
            res = {"dialog" : {}, "pid" : pid, "pid_tag" : pid_tag, "dialog1" : {}, "pid_tag1" : pid_tag1}
        else:
            res = {"dialog" : re, "pid" : pid, "pid_tag" : pid_tag, "dialog1" : re1, "pid_tag1" : pid_tag1}
        
        # res = {"dialog" : re, "pid" : pid, "pid_tag" : pid_tag, "dialog1" : re1, "pid_tag1" : pid_tag1}
        # print('res:',res)
        res = json.dumps(res)
 
        return response.Response(res,status=status.HTTP_200_OK)
    

