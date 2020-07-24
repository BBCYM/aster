from rest_framework.views import APIView, status
from rest_framework.response import Response
from .models import Photo
from datetime import datetime


class PhotoView(APIView):
    def get(self, request):
        Photo.objects.create(
            userId='skdfnsdf',
            photoId='ovbienrpj',
            tag={
                'main_tag': 'cat',
                'emotion_tag': 'cute',
                'top3_tag': [
                    {
                        'tag': 'cat1',
                        'precision': '99'
                    },
                    {
                        'tag': 'cat122',
                        'precision': '88'
                    }
                ],
                'all_tag': [
                    {
                        'tag': 'cat1',
                        'precision': '99'
                    },
                    {
                        'tag': 'cat122',
                        'precision': '88'
                    },
                    {
                        'tag': 'catmeme',
                        'precision': '898'
                    }
                ]
            },
            location='Taipei',
            time=datetime.utcnow()
        )
        return Response('hello', status=status.HTTP_201_CREATED)
