from rest_framework import views,response
# Create your views here.
class AuthView(views.APIView):
    def get(self, request):
        res = {'data': 1, 'hello': 'world'}
        return response.Response(res)