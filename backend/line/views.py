import os 

import dialogflow_v2 as dialogflow
from google.oauth2 import service_account
from operator import itemgetter
import json
from google.api_core.exceptions import InvalidArgument
from google.protobuf.json_format import MessageToJson
from photo.models import Photo
from album.models import Album
# from bot.views import get_res
from mongoengine.queryset.visitor import Q
from datetime import datetime
from datetime import timedelta

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
# from linebot.models import MessageEvent, TextMessage, TextSendMessage
from linebot.models import *

from django.core.cache import cache

# Get the value from environment variable 
token = 'LINE_CHANNEL_ACCESS_TOKEN'
token_value = os.getenv(token) 
secret = 'LINE_CHANNEL_SECRET'
secret_value = os.getenv(secret) 

line_bot_api = LineBotApi(token_value)
handler = WebhookHandler(secret_value)




@csrf_exempt
def callback(request: HttpRequest) -> HttpResponse:
    if request.method == "GET":
        cache.set("foo", "hihihi", timeout=25)
        # ans = cache.ttl("foo")
        ans = cache.get("foo")
        # print(ans)
        return HttpResponse(ans)

    if request.method == "POST":
        # get X-Line-Signature header value
        signature = request.META['HTTP_X_LINE_SIGNATURE']

        # get request body as text
        body = request.body.decode('utf-8')

        # handle webhook body
        try:
            handler.handle(body, signature)
        except InvalidSignatureError:
            return HttpResponseBadRequest()

        return HttpResponse()
    else:
        return HttpResponseBadRequest()

def get_res(text):
    credentials = service_account.Credentials.from_service_account_file('dfcredentials.json').with_scopes(['https://www.googleapis.com/auth/dialogflow'])

    with open('dfcredentials.json', encoding='utf-8') as f:
        appSecret = json.load(f)
        PROJECT_ID = itemgetter("project_id")(appSecret)
    session_id = 'userforDemo12345'
    # print("event.message.text",event.message.text)
    # text = event.message.text
            
    session_client = dialogflow.SessionsClient(credentials=credentials)
    session = session_client.session_path(PROJECT_ID,session_id)

    text_input = dialogflow.types.TextInput(text=text, language_code='zh-TW')
    query_input = dialogflow.types.QueryInput(text=text_input)
    try:
        res = session_client.detect_intent(session=session, query_input=query_input)
        return res
    except InvalidArgument:
        return response.Response("InvalidArgument",status=status.HTTP_400_BAD_REQUEST)

def get_reply(res):  
    reply_arr = []
    reply_arr.append(TextSendMessage(text="此次搜尋無結果，請嘗試搜尋其他照片"))
    reply_arr.append(TextSendMessage( 
        text = '或選擇其他動作', 
        quick_reply = QuickReply( 
                        items = [QuickReplyButton( 
                                    action = MessageAction(label = '查看目前累積結果', text = '查看目前累積結果'), ),
                                    # image_url = ‘https://mlsc50scean7.i.optimole.com/zXqAqP8-HIEbPDap/w:auto/h:auto/q:auto/http://shareboxnow.com/wp-content/uploads/2020/01/S__7938233.jpg’ ), 
                                QuickReplyButton( 
                                    action = MessageAction(label = '重新開始搜尋', text = '重新開始搜尋'), ),
                                ] ) ) 
    )
    mes = res.query_result.fulfillment_messages

    if len(mes) is not 0:
        reply_arr = []
        # 撈dialogflow的回應
        # for i in mes:
        #     # print("ress:",i.text.text[0])
        #     reply_arr.append(TextSendMessage(text=i.text.text[0]))
        reply_arr.append(TextSendMessage(text='目前有搜尋結果，可繼續搜尋'))
        reply_arr.append(TextSendMessage( 
        text = '請選擇接下來的動作', 
        quick_reply = QuickReply( 
                        items = [QuickReplyButton( 
                                    action = MessageAction(label = '查看目前累積結果', text = '查看目前累積結果'), ),
                                    # image_url = 'https://mlsc50scean7.i.optimole.com'), 
                                QuickReplyButton( 
                                    action = MessageAction(label = '重新開始搜尋', text = '重新開始搜尋'), ),
                                ] ) ) 
    )
    return reply_arr

def get_url(res):
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
        userid = '113073984862808105932'
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
    print("pid:",pid)
    return pid

@handler.add(MessageEvent, message=TextMessage)
def message_text(event: MessageEvent):
    res = get_res(event.message.text)
    reply = get_reply(res)
    pid = get_url(res)
    # print("pid:",pid)
    if event.message.text == "查看目前累積結果":
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text='為您導至圖片呈現頁面'))
    elif  event.message.text == "重新開始搜尋":
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text='已清空之前的搜尋結果，請繼續搜尋'))
    else:
        line_bot_api.reply_message(
            event.reply_token,
            reply
        )

@handler.add(MessageEvent, message=StickerMessage)
def handle_sticker_message(event):
    line_bot_api.reply_message(
        event.reply_token,
        StickerSendMessage(package_id=11539, sticker_id=52114111),
    )
