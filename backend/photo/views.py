from rest_framework.views import APIView, status
from rest_framework.response import Response
from .models import Photo
from auth.customResponse import simpleMessage
from datetime import datetime
import json


class PhotoView(APIView):
    def get(self, request):
        """
        (測試用)
        單張照片顯示頁面，更改emotion時
        根據photoId去更改資料庫的emotion欄位

        Args:
            request: 裡面需要有photoId和emotion

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """
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
            location='BOBOHOUSE',
            time=datetime.now()

        )
        print(f"datatime.utcnow() = {datetime.now()}")
        return Response('hello', status=status.HTTP_201_CREATED)

    def delete(self, request):
        """
        刪除照片
        把photoId的is_delete欄位改成true

        Args:
            request: 裡面需要有photoId和emotion

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """

        return Response('hello', status=status.HTTP_201_CREATED)


class EmotionView(APIView):

    def put(self, request):
        """
        單張照片顯示頁面，更改emotion時
        根據photoId去更改資料庫的emotion欄位

        Args:
            request: 裡面需要有photoId和emotion

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """
        photo_id = request.data["photoId"]
        user_id = request.data["emotion"]
        # print(f'photo.views.py: PhotoView/PUT, request = {str(request.data)}')
        # print(f'photo.views.py: PhotoView/PUT, emotion = {userId}')

        try:
            Photo.objects.filter(photoId=photo_id).update(userId=user_id)
            # Photo.objects.filter(userId='jonathan').update(userId='v-wenklu')

        except Exception:

            return Response("PhotoViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('PUT/PhotoView'), status=status.HTTP_200_OK)


class TagView(APIView):
    def get(self, request):
        """
        取得相片的tag
        根據photoId去更改資料庫的emotion欄位
        要過濾掉is_delete=true

        Args:
            request: 裡面需要有photoId和emotion

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR
        """

    def put(self, request):
        """
        單張照片，編輯頁面，新增tag時
        根據photoId去新增照片的客製化tag
        會檢查tag是否獨一無二(這個判斷還沒寫)

        Args:
            request: 裡面需要有photoId和custom_tag

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """
        photo_id = request.data["photoId"]
        custom_tag = request.data["custom_tag"]
        try:
            Photo.objects.filter(photoId=photo_id).update(0這裡要放custom_tag=custom_tag)
        except Exception:

            return Response("PhotoViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('POST/PhotoView'), status=status.HTTP_201_CREATED)

    def delete(self, request):
        """
        單張照片，編輯頁面，刪除tag
        根據photoId和custom_tag刪掉指定的custom_tag

        Args:
            request: 裡面需要有photoId和custom_tag

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """
        photo_id = request.data["photoId"]
        custom_tag = request.data["custom_tag"]
        try:
            Photo.objects.filter(photoId=photo_id).a 0這裡要放delete
        except Exception:

            return Response("PhotoViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('POST/PhotoView'), status=status.HTTP_201_CREATED)
