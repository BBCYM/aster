from django.shortcuts import render
from rest_framework.views import APIView
from django.core.handlers.wsgi import WSGIRequest


# Create your views here.
class TempLineView(APIView):
    def get(self, request:WSGIRequest):
        return render(request, 'index.html')

class LiffView(APIView):
    def get(self, request: WSGIRequest):
        return render(request, 'liff.html')
    
