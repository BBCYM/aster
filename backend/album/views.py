from rest_framework.views import APIView, status
from rest_framework.response import Response
from auth.utils import simpleMessage
from .models import Album, AlbumPhoto, AlbumTag
from datetime import datetime
import json
from django.forms.models import model_to_dict
from bson import ObjectId
from django.core.handlers.wsgi import WSGIRequest


class AlbumView(APIView):

    # 抓使用者的所有相簿 OK
    def get(self, request: WSGIRequest, userId: str = None):
        # userId = request.query_params["userId"]

        albumNameArray = []
        _idArray = []
        coverPhotoIdArray = []

        album = Album.objects(userId=userId).filter()

        # get albumname
        for a in album:
            if a.isDeleted == False:
                albumNameArray.append(a.albumName)

        # get _id
        for a in album:
            if a.isDeleted == False:
                data = JSONEncoder().encode(a._id)
                data2 = eval(data)

                _idArray.append(data2)

        # get coverPhotoId
        for a in album:
            if a.isDeleted == False:
                coverPhotoIdArray.append(a.coverPhotoId)

        res = {"albumNameArray": albumNameArray, "_idArray": _idArray,
               "coverPhotoIdArray": coverPhotoIdArray}
        # res = json.dumps(res)
        return Response(res, status=status.HTTP_201_CREATED)

    # CREATE  一鍵建相簿 OK

    def post(self, request: WSGIRequest, userId: str = None):

        album = Album(
            coverPhotoId=request.data['coverPhotoId'],
            albumName=request.data['albumName'],
            userId=userId

        )
        for p in request.data['albumPhoto']:
            album.albumPhoto.append(AlbumPhoto(photoId=p))
        for t in request.data['albumTag']:
            album.albumTag.append(AlbumTag(tag=t))
        album.save()
        return Response(simpleMessage('POST/AlbumView'), status=status.HTTP_201_CREATED)

class AlbumPDView(APIView):

    # 更改相簿名稱 OK
    def put(self, request: WSGIRequest, albumId: str = None):

        # _id = request.data["_id"]
        albumName = request.data["albumName"]

        try:
            update_rows = Album.objects(_id=albumId).update(
                albumName=albumName)
            print(f'Album/View: AlbumView.put, db:{update_rows} rows')
        except Exception as e:
            print(e)
            return Response("AlbumViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('PUT/AlbumView'), status=status.HTTP_200_OK)

    # 刪除相簿 OK
    def delete(self, request: WSGIRequest, albumId: str = None):
        """
        刪除相簿
        把_id的is_delete欄位改成true
        Args:
            request: 裡面需要有_id
        Returns:
            None
        """
        # _id = request.data["_id"]

        try:
            album= Album.objects(_id=albumId).get()
            album.isDeleted=True
            for tag in album.albumTag:
                tag.isDeleted = True
            album.save()
            print("Album Deleted")
        except Exception as e:
            print(e)
            return Response("AlbumViewError", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(simpleMessage('DELETE/AlbumView'), status=status.HTTP_200_OK)


class AlbumTagView(APIView):

    # 取得相簿TAG OK
    def get(self, request: WSGIRequest, albumId: str = None):
        """
        取得相簿的albumTag
        根據_id去更改資料庫的albumTag欄位
        要過濾掉is_delete=true
        Args:
            request: _id
        Returns:
            該album全部的albumTag
        """
        # album_id = request.data["_id"]
        # album_id = request.query_params["_id"]

        album_tag_array = []

        try:
            album = Album.objects(_id=albumId).get()

            array_field = album.albumTag

            if len(array_field) == 0:
                return Response(simpleMessage("zero"), status=status.HTTP_200_OK)

            for single_tag in array_field:
                if single_tag.isDeleted == False:
                    album_tag_array.append(single_tag.tag)

        except Exception as e:
            print(e)
            return Response(simpleMessage("Get/AlbumTagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        res = {"album_tag": album_tag_array}

        # response_str = json.dumps({"result": "Get/AlbumTagView",
        #                            "album_tag": album_tag_array})

        return Response(res, status=status.HTTP_201_CREATED)

    # 新增相簿TAG OK
    def post(self, request: WSGIRequest, albumId: str = None):
        """
        新增tag時
        根據_id去新增相簿的tag
        會檢查tag是否獨一無二
        Args:
            request: 裡面需要有_id和albumTag
        Returns:
            更改過後的tag
        """
        # album_id = request.data["_id"]
        album_tag = request.data["albumTag"]
        tag = {
            'tag': album_tag,
            'isDeleted': False
        }

        try:
            update_rows = Album.objects(_id=albumId).update(
                add_to_set__albumTag=tag)

            print(f'Album/View: TagView.post, db:{update_rows} rows')

        except Exception as e:
            print('error: ', e)
            return Response(simpleMessage("Post/AlbumTagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('Post/AlbumTagView'), status=status.HTTP_201_CREATED)

    # 刪除相簿TAG OK
    def delete(self, request: WSGIRequest, albumId: str = None):
        """
        刪除tag
        根據_id和albumTag刪掉指定的albumTag
        tag不存在或是成功刪除都會還傳成功
        Args:
            request: 裡面需要有_id和albumTag
        Returns:
            剩下的tag
        """
        album_tag = request.query_params["albumTag"]

        try:
            print(albumId)
            print(album_tag)
            result = Album.objects(_id=albumId, albumTag__match={'tag': album_tag, 'isDeleted': False}).update_one(set__albumTag__i__isDeleted=True)
            print(result)

        except Exception as e:
            print(e)
            return Response(simpleMessage("DELETE/AlbumTagView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('DELETE/AlbumTagView'), status=status.HTTP_201_CREATED)


class AlbumPhotoView(APIView):

    # 抓相簿中的所有照片、tag OK
    def get(self, request: WSGIRequest, albumId: str = None):
        # _id = request.query_params["_id"]

        album = Album.objects(_id=albumId).filter()

        albumPhotoIdArray = []
        albumTagArray = []

        # get albumPhotoId
        for a in album:
            if a.isDeleted == False:
                for z in a.albumPhoto:
                    if z.isDeleted == False:
                        albumPhotoIdArray.append(z.photoId)

        # get albumTag
        for w in album:
            if w.isDeleted == False:
                for q in a.albumTag:
                    if q.isDeleted == False:

                        albumTagArray.append(q.tag)

        res = {"albumPhotoIdArray": albumPhotoIdArray,
               "albumTagArray": albumTagArray}

        return Response(res, status=status.HTTP_200_OK)

    # 刪除相簿中的相片 OK
    def delete(self, request: WSGIRequest, albumId: str = None):
        """
        刪除相簿中的相片
        根據_id和photoId刪掉指定的相片
        photo不存在或是成功刪除都會還傳成功
        Args:
            request: 裡面需要有_id和photoId
        Returns:
            相簿剩下的photo
        """

        # album_id = request.query_params["_id"]
        album_photo = request.data["albumPhoto"]

        try:

            album = Album.objects(
                _id=albumId, albumPhoto__match={'photoId': album_photo, 'isDeleted': False}).first()

            for single_photo in album.albumPhoto:

                if single_photo.photoId == album_photo:

                    single_photo.isDeleted = True

            album.save()

        except Exception as e:
            print(e)
            return Response(simpleMessage("DELETE/AlbumPhotoView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('DELETE/AlbumPhotoView'), status=status.HTTP_200_OK)

    # 新增相片到相簿中(現在先不用這個，只有一鍵建相簿) OK
    def post(self, request: WSGIRequest, albumId: str = None):
        """
        新增photo時
        根據_id去新增相簿的photo
        會檢查photo是否獨一無二
        Args:
            request: 裡面需要有_id和photoId
        Returns:
            更改過後的photo
        """
        # album_id = request.data["_id"]
        album_photo = request.data["albumPhoto"]
        photoId = {
            'photoId': album_photo,
            'isDeleted': False
        }

        try:
            update_rows = Album.objects(_id=albumId).update(
                add_to_set__albumPhoto=photoId)

            print(f'Album/View: AlbumPhotoView.post, db:{update_rows} rows')

        except Exception as e:
            print('error: ', e)
            return Response(simpleMessage("Post/AlbumPhotoView: error"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(simpleMessage('Post/AlbumPhotoView'), status=status.HTTP_201_CREATED)


class JSONEncoder(json.JSONEncoder):

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
