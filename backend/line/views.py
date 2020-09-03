import os 

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
  
# Get the value of 'HOME' 
# environment variable 
token = 'LINE_CHANNEL_ACCESS_TOKEN'
token_value = os.getenv(token) 
secret = 'LINE_CHANNEL_SECRET'
secret_value = os.getenv(secret) 

line_bot_api = LineBotApi(token_value)
handler = WebhookHandler(secret_value)


@csrf_exempt
def callback(request: HttpRequest) -> HttpResponse:
    
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


@handler.add(MessageEvent, message=TextMessage)
def message_text(event: MessageEvent):
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=event.message.text)
    )
# def callback(request):
#     return HttpResponse("test!!")

# @csrf_exempt
# def callback(request):

#     if (request.method == 'POST'):
#         signature = request.META['HTTP_X_LINE_SIGNATURE']
#         body = request.body.decode('utf-8')

#         try:
#             events = parser.parse(body, signature)
#         except InvalidSignatureError:
#             return HttpResponseForbidden()
#         except LineBotApiError:
#             return HttpResponseBadRequest()

#         for event in events:
#             if isinstance(event, MessageEvent):
#                 # print("event.message.text",event.message.text)
#                 # line_bot_api.reply_message(
#                 #     event.reply_token,
#                 #    TextSendMessage(text=event.message.text)
#                 # )
#         return HttpResponse()
#     else:
#         return HttpResponseBadRequest()
