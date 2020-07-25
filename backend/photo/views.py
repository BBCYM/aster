from rest_framework.views import APIView, status
from rest_framework.response import Response
from .models import Photo
from auth.customResponse import simpleMessage
from datetime import datetime
import json
from django.forms.models import model_to_dict


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
            userId='bobo',
            photoId='234234324',
            tag={
                'main_tag': 'dog',
                'emotion_tag': 'baby',
                # 'custom_tag': [
                #     {
                #         'tag': 'custom1',
                #         'is_deleted': False
                #     },
                #     {
                #         'tag': 'custom2',
                #         'is_deleted': False
                #     }

                # ],
                'custom_tag': [],
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
            location='Japan',
            upload_time=datetime.now(),
            create_time=datetime.now()
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

        try:
            Photo.objects.filter(photoId=photo_id).update(userId=user_id)
            # Photo.objects.filter(userId='jonathan').update(userId='v-wenklu')

        except Exception:

            return Response("PhotoViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('PUT/PhotoView'), status=status.HTTP_200_OK)


class TagView(APIView):
    def get(self, request):
        """
        取得相片的custom_tag
        根據photoId去更改資料庫的emotion欄位
        要過濾掉is_delete=true

        Args:
            request: 裡面需要有photoId和emotion

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR
        """
        photo_id = request.data["photoId"]
        custom_tag_array = []

        try:
            photo = Photo.objects.get(
                photoId=photo_id)

            if len(photo.tag["custom_tag"]) == 0:
                print(len(photo.tag["custom_tag"]))
                return Response(simpleMessage("zero"), status=status.HTTP_200_OK)

            for single_tag in photo.tag["custom_tag"]:

                if single_tag["is_deleted"] == False:
                    custom_tag_array.append(single_tag["tag"])

        except Exception as e:
            print(e)
            return Response(simpleMessage("Get/TagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        response_str = json.dumps({"result": "Get/TagView",
                                   "custom_tag": custom_tag_array})

        return Response(response_str, status=status.HTTP_201_CREATED)

    def put(self, request):
        """
        單張照片，編輯頁面，新增tag時
        根據photoId去新增照片的客製化tag
        會檢查tag是否獨一無二

        Args:
            request: 裡面需要有photoId和custom_tag

        Returns:
            Success: status.HTTP_200_OK
            Failed: "Same Tag, plz insert a unique tag" status.HTTP_500_INTERNAL_SERVER_ERROR
            Failed: "PhotoViewError"  status.HTTP_500_INTERNAL_SERVER_ERROR
        """
        photo_id = request.data["photoId"]
        custom_tag = request.data["custom_tag"]
        tag = {
            'tag': custom_tag,
            'is_deleted': False
        }

        try:
            photo = Photo.objects.get(
                photoId=photo_id)

            custom_tag_array = photo.tag["custom_tag"]

            # Search in the tag_array, if exist a same tag, return error
            for cus_tag_db in custom_tag_array:
                if cus_tag_db["tag"] == custom_tag:
                    return Response(simpleMessage("Put/TagView: error: Same Tag, plz insert a unique tag"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            custom_tag_array.append(tag)

            photo.save()  # Djongo does not really do a update to MongoDB

        except Exception:

            return Response(simpleMessage("Put/TagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('Put/TagView'), status=status.HTTP_201_CREATED)

    def delete(self, request):
        """
        單張照片，編輯頁面，刪除tag
        根據photoId和custom_tag刪掉指定的custom_tag
        tag不存在或是成功刪除都會還傳成功

        Args:
            request: 裡面需要有photoId和custom_tag

        Returns:
            Success: status.HTTP_200_OK
            Failed: status.HTTP_500_INTERNAL_SERVER_ERROR

        """
        photo_id = request.data["photoId"]
        custom_tag = request.data["custom_tag"]

        try:
            photo = Photo.objects.get(
                photoId=photo_id)

            custom_tag_array = photo.tag["custom_tag"]

            for cus_tag_db in custom_tag_array:
                if cus_tag_db["tag"] == custom_tag:
                    cus_tag_db["is_deleted"] = True

            photo.save()
        except Exception as e:
            print(e)
            return Response(simpleMessage("DELETE/TagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('DELETE/TagView'), status=status.HTTP_201_CREATED)
