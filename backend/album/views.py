from rest_framework.views import APIView, status
from rest_framework.response import Response
from .models import Album, Tag
from datetime import datetime
from django.forms.models import model_to_dict


class AlbumView(APIView):

    # CREATE
    def post(self, request):
        Album.objects.create(

            userId=request.data['userId'],
            albumName=request.data['albumName'],
            albumId=request.data['albumId'],
            photo=request.data['photo'],
            tag=request.data['tag'],
            # time=datetime.utcnow()
            time=request.data['time'],


        )

        return Response('hello,CREATE', status=status.HTTP_201_CREATED)

    # # CREATE 測試建立資料
    # def post(self, request):
    #     Album.objects.create(
    #         userId='a1234sdf',
    #         albumName='kowaicat10',
    #         albumId='test10_old',
    #         photo={'userId': 'skdfnsdf',
    #                'photoId': 'ovbienrpj',
    #                'tag': {
    #                    'main_tag': 'cat',
    #                    'emotion_tag': 'cute',
    #                    'top3_tag': [
    #                        {
    #                            'tag': 'cat1',
    #                            'precision': '99'
    #                        },
    #                        {
    #                            'tag': 'cat122',
    #                            'precision': '88'
    #                        }
    #                    ],
    #                    'all_tag': [
    #                        {
    #                            'tag': 'cat1',
    #                            'precision': '99'
    #                        },
    #                        {
    #                            'tag': 'cat122',
    #                            'precision': '88'
    #                        },
    #                        {
    #                            'tag': 'catmeme',
    #                            'precision': '898'
    #                        }
    #                    ]
    #                },
    #                'location': 'Taipei',
    #                'time': datetime.utcnow()},
    #         tag=[{'tag': 'cats'}, {'tag': 'kittens'}],
    #         time=datetime.utcnow()
    #     )
    #     return Response('hello,CREATE', status=status.HTTP_201_CREATED)

    # GET
    def get(self, request):
        albumId = request.data['albumId']
        album = Album.objects.get(albumId=albumId)

        return Response(model_to_dict(album))

    # UPDATE
    def put(self, request):
        # postman test
        # albumId = request.POST.get('albumId')
        # albumName = request.POST.get('albumName')

        albumId = request.data['albumId']
        albumName = request.data['albumName']

        print(request)
        album = Album.objects.get(albumId=albumId)
        album.albumName = albumName
        album.save()
        return Response('hello,UPDATE', status=status.HTTP_201_CREATED)

    # DELETE
    def delete(self, request):

        albumId = request.data['albumId']
        Album.objects.filter(albumId=albumId).delete()

        return Response('hello,DELETE', status=status.HTTP_201_CREATED)
