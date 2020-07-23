from rest_framework.views import APIView, status
from rest_framework.response import Response
from .models import Album
from datetime import datetime


class AlbumView(APIView):
    def get(self, request):
        Album.objects.create(
            userId='skdfnsdf',
            albumId='ovbienrpj',
            # photoId=['asdflkjh','asdjflkj','qojasfklj'],
            tag='cateeeeeeee',
            # location='Taipei',
            time=datetime.utcnow()
        )
        return Response('hello,GET', status=status.HTTP_201_CREATED)



    def update(self, request):
        Album.objects.create(
            userId='skdfnsdf',
            albumId='ovbienrpj',
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
            # location='Taipei',
            # time=datetime.utcnow()
        )
        return Response('hello,UPDATE', status=status.HTTP_201_CREATED)



    def delete(self, request):
        Album.objects.create(
            userId='skdfnsdf',
            albumId='ovbienrpj',
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
            # location='Taipei',
            # time=datetime.utcnow()
        )
        return Response('hello,DELETE', status=status.HTTP_201_CREATED)
