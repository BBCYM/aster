# import requests
# import os
# from mongoengine.queryset.visitor import Q
# from photo.models import Photo
# import datetime
# from requests.adapters import HTTPAdapter
# import queue
# import time
# from google.oauth2 import service_account
# from auth.authenticate import ThreadPool
# from auth.models import User
# from threading import Thread
# from aster import settings
# import pytz
# from django.utils.timezone import make_aware
# from google.auth.transport.requests import Request, AuthorizedSession
# from PIL import Image
# import numpy as np
# import json

# class Endpoint:
#     def __init__(self):
#         self.end_point = 'bbcym-aster-yolov4-endpoint'
#         self.custom_attributes = 'aster_people_ontology'
#         self.client = boto3.client('sagemaker-runtime')
#         self.contentType = 'application/json'

#     def main(self, image):
#         try:
#             response = self.client.invoke_endpoint(
#                 EndpointName=self.end_point,
#                 CustomAttributes=self.custom_attributes,
#                 ContentType=self.contentType,
#                 Body=image
#             )
#             # print(response['Body'].read())
#             return response
#         except Exception as e:
#             print(e)
# class PeopleOntology:
#     def __init__(self, session:AuthorizedSession, userId):
#         self.IFR = './static'
#         self.session = session
#         self.queue = queue.Queue()
#         self.session.mount('https://', HTTPAdapter(pool_maxsize=16, max_retries=10, pool_block=True))
#         self.userId = userId
#         self.pageNum = int(os.getenv('PHOTO_THREAD_NUM'))
#     def afterall(self, tic, i):
#         self.queue.join()
#         toc = time.perf_counter()
#         print(f"\rTotal people process {i} images in {toc - tic:0.4f} seconds")
#         user = User.objects(userId=self.userId)
#         user.update(
#             set__people_onto__lastSync=make_aware(datetime.datetime.utcnow(),
#                                     timezone=pytz.timezone(settings.TIME_ZONE))
#         )
#     def people_pipline(self, mediaItem):
#         try:
#         # get the image data
#             filename = mediaItem['filename']
#             image = Image.open(f'{self.IFR}/{self.userId}/{filename}')
#             image = np.asarray(image.resize((self.input_size, self.input_size)))
#             image = image / 255.
#             image = np.concatenate([image[np.newaxis, :, :]] * self.batch_size)
#             body = json.dumps({"instances": [image.tolist(),image.tolist()]})
#             ep = Endpoint()
#             result = ep.main(body)
#             result = json.loads(result["Body"].read().decode("utf-8"))
#             result['predictions']
#         except Exception as e:
#             print(f'Error from initial color api pipline{e}')
#     def initial(self):
#         tic = time.perf_counter()
#         nPT = ''
#         pool=ThreadPool(self.queue)
#         params = {'pageSize': self.pageNum}
#         i = 0
#         try:
#             if not os.path.isdir(f'{self.IFR}/{self.userId}'):
#                 os.mkdir(f'{self.IFR}/{self.userId}')
#             while True:
#                 if nPT:
#                     params['pageToken'] = nPT
#                 photoRes = self.session.get(
#                     'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
#                 mediaItems = photoRes.get('mediaItems', None)
#                 if not mediaItems:
#                     break
#                 print(f'Handling {len(mediaItems)} color items')
#                 for mediaItem in mediaItems:
#                     mimeType, _ = mediaItem['mimeType'].split('/')
#                     if mimeType == 'image':
#                         pool.add_task(self.color_pipline, mediaItem=mediaItem)
#                         i=i+1
#                 if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
#                     break
#                 else:
#                     nPT = photoRes['nextPageToken']
#         except Exception as e:
#             print(f'Error from initial color api {e}')
#         Thread(target=self.afterall, args=(tic,i), daemon=True).start()
#     def refresh(self):
#         tic = time.perf_counter()
#         User.objects(userId=self.userId).update(set__isFreshing=True, set__isSync=False)
#         nPT = ''
#         pool=ThreadPool(self.queue)
#         params = {'pageSize': self.pageNum}
#         i = 0
#         try:
#             if not os.path.isdir(f'{self.IFR}/{self.userId}'):
#                 os.mkdir(f'{self.IFR}/{self.userId}')
#             while True:
#                 if nPT:
#                     params['pageToken'] = nPT
#                 photoRes = self.session.get(
#                     'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
#                 mediaItems = photoRes.get('mediaItems', None)
#                 if not mediaItems:
#                     break
#                 print(f'Handling {len(mediaItems)} items')
#                 for mediaItem in mediaItems:
#                     dbres = Photo.objects(photoId=mediaItem['id'])
#                     mimeType, _ = mediaItem['mimeType'].split('/')
#                     if not dbres and mimeType == 'image':
#                         pool.add_task(self.color_pipline, mediaItem=mediaItem)
#                         i=i+1
#                 if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
#                     break
#                 else:
#                     nPT = photoRes['nextPageToken']
#         except Exception as e:
#             print(e)
#         Thread(target=self.afterall, args=(tic,i), daemon=True).start()