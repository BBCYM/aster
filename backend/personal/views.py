from rest_framework import views, response, status
from google.oauth2 import service_account
from operator import itemgetter
import dialogflow_v2 as dialogflow
import json
from google.api_core.exceptions import InvalidArgument
from google.protobuf.json_format import MessageToJson
# Create your views here.


class personalView(views.APIView):

    def post(self, request):
        data = request.data['uri']
        print('這是request=', request)
        print('這是data=', data)

        print('這是response.data=', request.data)
        # return response.Response("ok")

        credentials = service_account.Credentials.from_service_account_file(
            'dfcredentials.json').with_scopes(['https://www.googleapis.com/auth/dialogflow'])

        with open('dfcredentials.json', encoding='utf-8') as f:
            appSecret = json.load(f)
            print(appSecret)
            PROJECT_ID = itemgetter("project_id")(appSecret)
        session_id = 'userforDemo12345'
        text = data  # 這裡改成在RN輸入的字串
        # text = '嗨'   #這裡改成在RN輸入的字串
        print('測試抓不抓得到=', data)

        session_client = dialogflow.SessionsClient(credentials=credentials)
        session = session_client.session_path(PROJECT_ID, session_id)

        text_input = dialogflow.types.TextInput(
            text=text, language_code='zh-TW')
        query_input = dialogflow.types.QueryInput(text=text_input)
        try:
            res = session_client.detect_intent(
                session=session, query_input=query_input)
        except InvalidArgument:
            return response.Response("InvalidArgument", status=status.HTTP_400_BAD_REQUEST)
        print("Fulfillment text:", res.query_result.fulfillment_text)
        print("Fulfillment_messages:",
              res.query_result.fulfillment_messages[0].text.text[0])
        test = res.query_result.fulfillment_messages[0].text.text
        print(type(test))
        print("Fulfillment_messages:",
              res.query_result.fulfillment_messages[1].text.text[0])

        #print("String value:", res.query_result.parameters.fields['value'])

        #print("測試candy_string_value:", res.query_result.parameters.fields['value'].string_value)
        #print("Category.original_string_value:", res.query_result.parameters.fields['Category.original'].string_value)
        print("測試用:", res.query_result)

        #print("測試用Fulfillment message:", res.query_result.fulfillment_messages.text['text'].text)

        #print("data:", res.query_result)

        re = MessageToJson(res.query_result)

        return response.Response(re)

    def get(self, request):

        data = {'name': 'Michelle',
                'text': 'i am 18 years old.'}
        print(data)
        #re = MessageToJson(data)

        return response.Response(data)


'''
    def post(self,request):
        
        data = request.data
        print(data)

        print('response.data',request.data)
        return response.Response("ok")
'''
