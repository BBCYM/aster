from rest_framework.views import APIView, status
from rest_framework.response import Response
from auth.customResponse import simpleMessage
from datetime import datetime
import json
from mongoengine import connect
from mongoengine.queryset.visitor import Q
from .models import Photo, Tag

connect('aster')


class PhotoView(APIView):
    def get(self, request):
        # photo_id = request.query_params["photoId"]
        photo_id = request.data["photoId"]
        try:
            photo = Photo.objects(photoId__exact=photo_id).all_fields()
            print(photo.to_json())

            return_txt = {"result": 'GET/PhotoView',
                          'photo_object': photo.to_json()}
        except Exception as e:
            print('PhotoViewError:', e)
        return Response(return_txt, status=status.HTTP_200_OK)

    def post(self, request):
        """
        (測試用)
        產生一筆假資料

        Args:
            None

        Returns:
            None

        """
        photo = Photo(photoId='12345', userId='abc', tag={
            'main_tag': 'dog',
            'emotion_tag': 'cute',
            'custom_tag': [
                {
                    'tag': 'custom1',
                    'is_deleted': False
                },
                {
                    'tag': 'custom2',
                    'is_deleted': False
                }
            ],
            'top3_tag': [
                {
                    'tag': 'cat1',
                    'precision': '99'
                },
                {
                    'tag': 'cat2',
                    'precision': '88'
                }
            ],
            'all_tag': [
                {
                    'tag': 'cat1',
                    'precision': '99'
                },
                {
                    'tag': 'cat2',
                    'precision': '88'
                },
                {
                    'tag': 'cat3',
                    'precision': '898'
                }
            ]},
            location='TPE', createTime=datetime.utcnow())
        photo.save()

        return Response(simpleMessage('POST/PhotoView'), status=status.HTTP_201_CREATED)

    def delete(self, request):
        """
        刪除照片
        把photoId的is_delete欄位改成true

        Args:
            request: 裡面需要有photoId

        Returns:
            None
        """
        # photo_id = request.query_params["photoId"]
        photo_id = request.data["photoId"]

        try:

            update_rows = Photo.objects(photoId__exact=photo_id).update(
                isDeleted=True)
            print(f'Photo/View: PhotoView.delete, db:{update_rows} rows')
            # photo = Photo.objects(photoId=photo_id)
            # print(photo.delete())
        except Exception as e:
            print(e)
            return Response("PhotoViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(simpleMessage('DELETE/PhotoView'), status=status.HTTP_201_CREATED)


class EmotionView(APIView):
    def post(self, request):
        """
        test
        """
        user_id = request.data["userId"]
        emotion_tag = request.data["emotion_tag"]

        try:
            # photo = Photo.objects(userId__exact=user_id, )
            update_rows = Photo.objects(userId=user_id, tag__emotion_tag__exact=emotion_tag).update(
                tag__emotion_tag='bobo')
            print(f'Photo/View: EmotionView.post, db:{update_rows} rows')

        except Exception as e:
            print(e)
            return Response("EmotionViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('PUT/PhotoView'), status=status.HTTP_200_OK)

    def put(self, request):
        """
        單張照片顯示頁面，更改emotion時
        根據photoId去更改資料庫的emotion欄位

        Args:
            request: 裡面需要有photoId和emotion_tag

        Returns:
            None

        """
        photo_id = request.data["photoId"]
        emotion_tag = request.data["emotion_tag"]

        try:
            update_rows = Photo.objects(photoId__exact=photo_id).update(
                tag__emotion_tag=emotion_tag)
            print(f'Photo/View: EmotionView.put, db:{update_rows} rows')
        except Exception as e:
            print(e)
            return Response("EmotionViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('PUT/EmotionView'), status=status.HTTP_200_OK)


class TagView(APIView):
    def get(self, request):
        """
        取得相片的custom_tag
        根據photoId去更改資料庫的emotion欄位
        要過濾掉is_delete=true

        Args:
            request: photoId

        Returns:
            該photo全部的custom_tag
        """
        photo_id = request.data["photoId"]
        custom_tag_array = []

        try:
            photo = Photo.objects(photoId__exact=photo_id).get()

            array_field = photo.tag.custom_tag

            if len(array_field) == 0:
                print(len(array_field))
                return Response(simpleMessage("zero"), status=status.HTTP_200_OK)

            for single_tag in array_field:
                if single_tag.is_deleted == False:
                    custom_tag_array.append(single_tag.tag)

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
            更改過後的tag
        """
        photo_id = request.data["photoId"]
        custom_tag = request.data["custom_tag"]
        tag = {
            'tag': custom_tag,
            'is_deleted': False
        }

        try:
            update_rows = Photo.objects(photoId__exact=photo_id).update(
                add_to_set__tag__custom_tag=tag)

            print(f'Photo/View: TagView.put, db:{update_rows} rows')

        except Exception as e:
            print('error: ', e)
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
            剩下的tag

        """
        photo_id = request.data["photoId"]
        custom_tag = request.data["custom_tag"]

        try:

            # photo = Photo.objects().update({'photoId': '1'}, {'$set': {'tag.custom_tag.$[element].tag': 'bobo'}}, {
            #     'arrayFilters': [{'element.tag': 'custom3'}], 'upsert': True})
            # custom_tag_list = Photo.objects(photoId=photo_id).get().tag.custom_tag
            photo = Photo.objects(
                photoId=photo_id, tag__custom_tag__match={'tag': custom_tag, 'is_deleted': False}).first()
            # print(photo.to_json())

            for single_tag in photo.tag.custom_tag:

                if single_tag.tag == custom_tag:
                    print('same')
                    single_tag.is_deleted = True
            # print(photo.to_json())
            photo.save()

            # custom_tag_array = photo.tag["custom_tag"]

            # for cus_tag_db in custom_tag_array:
            #     if cus_tag_db["tag"] == custom_tag:
            #         cus_tag_db["is_deleted"] = True

            # photo.save()
        except Exception as e:
            print(e)
            return Response(simpleMessage("DELETE/TagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('DELETE/TagView'), status=status.HTTP_201_CREATED)
