from rest_framework.views import APIView, status
from rest_framework.response import Response
from .models import Photo
from .models import Top3_tag
from datetime import datetime


class PhotoView(APIView):
    def get(self, request):
        try:
            tags = Photo.objects.all()
            print(tag)
            # print(tags.filter(tag__exact={'top3_tag':[{'tag':'Sky'}]}))
        except Exception as e:
            print(e)
        return Response('hello', status=status.HTTP_201_CREATED)
