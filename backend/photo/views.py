from rest_framework.views import APIView, status
from rest_framework.response import Response
from auth.utils import simpleMessage
from datetime import datetime
import json
import math
from mongoengine.queryset.visitor import Q
from .models import Photo, Tag, Custom_tag
from django.core.handlers.wsgi import WSGIRequest
from .utils import getEmotionString, EmotionStringtoI
from utils.utils import is_valid_objectId

get_fields = ('photoId', 'isDeleted', 'createTime')


class PhotoListView(APIView):
    def get(self, request: WSGIRequest, userId: str = None):
        if userId:
            want_deleted = json.loads(
                request.query_params.get('isDeleted', 'false'))
            photo = Photo.objects(Q(userId=userId) & Q(
                isDeleted=want_deleted)).scalar(*get_fields)
            photo = list(photo)
            return Response({'photos': photo}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No such user'}, status=status.HTTP_400_BAD_REQUEST)


class PhotoView(APIView):
    def get(self, request, photoId=None):
        if photoId:
            try:
                photo = Photo.objects(
                    photoId=photoId).scalar(*get_fields).get()
                photo = dict(zip(get_fields, photo))
                return Response(photo, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response('error', status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, photoId=None):
        """
        刪除照片
        把photoId的is_delete欄位改成true

        Args:
            request: 裡面需要有photoId

        Returns:
            None
        """
        if photoId:
            try:
                update_rows = Photo.objects(
                    photoId=photoId).update(isDeleted=True)
                return Response({}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'message': "PhotoViewError"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)


class EmotionView(APIView):
    def get(self, request:WSGIRequest, photoId=None):
        """
        get emotion
        """
        # lancode = request.headers.get('Language-Code',None)
        # print("lancode",lancode)
        if photoId:
            try:
                temp = Photo.objects(
                    photoId=photoId, isDeleted=False).scalar('tag').get()
                k = EmotionStringtoI(temp.emotion_tag)
                res = {'emotion': k}
                return Response(res, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'message': "EmotionViewError"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, photoId=None):
        """
        單張照片顯示頁面，更改emotion時
        根據photoId去更改資料庫的emotion欄位

        Args:
            request: 裡面需要有photoId和emotion_tag

        Returns:
            None

        """
        emotion_tag = request.data["emotion_tag"]
        eTag = getEmotionString(int(emotion_tag))
        if photoId:
            try:
                update_rows = Photo.objects(
                    photoId=photoId).update(tag__emotion_tag=eTag)
                return Response({}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'message': "EmotionViewError"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)


class TagView(APIView):
    def get(self, request, photoId):
        """
        取得相片的custom_tag
        根據photoId去更改資料庫的emotion欄位
        要過濾掉is_delete=true

        Args:
            request: photoId

        Returns:
            該photo全部的custom_tag
        """
        lancode = request.headers.get('Language-Code',None)
        if photoId:
            try:
                photo = Photo.objects(photoId=photoId).get()
                array_field = photo.tag.custom_tag
                custom_tag_array = []
                for single_tag in array_field:
                    if single_tag.is_deleted == False:
                        custom_tag_array.append(single_tag.tag)
                return Response({"custom_tag": custom_tag_array}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response(simpleMessage("GetTagViewError"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, photoId=None):
        """
        單張照片，編輯頁面，新增tag時
        根據photoId去新增照片的客製化tag
        會檢查tag是否獨一無二

        Args:
            request: 裡面需要有photoId和custom_tag

        Returns:
            更改過後的tag
        """
        lancode = request.headers.get('Language-Code',None)
        if photoId:
            custom_tag = request.data["customTag"]
            custom_tag = custom_tag.strip()
            tag = Custom_tag(tag=custom_tag)
            
            try:
                update_rows = Photo.objects(photoId__exact=photoId).update(add_to_set__tag__custom_tag=tag)
                return Response({}, status=status.HTTP_200_OK)
            except Exception as e:
                print('error: ', e)
                return Response(simpleMessage("Put/TagViewError"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, photoId=None):
        """
        單張照片，編輯頁面，刪除tag
        根據photoId和custom_tag刪掉指定的custom_tag
        tag不存在或是成功刪除都會還傳成功

        Args:
            request: 裡面需要有photoId和custom_tag

        Returns:
            剩下的tag 

        """
        lancode = request.headers.get('Language-Code',None)
        if photoId:
            try:
                custom_tag = request.query_params.get("custom_tag", None)
                photo = Photo.objects(photoId=photoId, tag__custom_tag__match={'tag': custom_tag, 'is_deleted': False}).first()
                photos = photo.tag.custom_tag
                for single_tag in photos:
                    if single_tag.tag == custom_tag:
                        single_tag.is_deleted = True
                photo.save()
                return Response({}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response(simpleMessage("DELETE/TagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'No such photo'}, status=status.HTTP_400_BAD_REQUEST)
