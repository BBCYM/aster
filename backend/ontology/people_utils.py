import requests
import os
from mongoengine.queryset.visitor import Q
from photo.models import Photo
import datetime
from requests.adapters import HTTPAdapter
import queue
import time
from google.oauth2 import service_account
from auth.authenticate import ThreadPool
from auth.models import User
from threading import Thread
from aster import settings
import pytz
from django.utils.timezone import make_aware
from google.auth.transport.requests import Request, AuthorizedSession
from PIL import Image
import numpy as np
import json
import boto3
import tensorboard as tf
import traceback
class Endpoint:
    def __init__(self):
        self.end_point = 'bbcym-aster-yolov4-endpoint'
        self.custom_attributes = 'aster_people_ontology'
        self.client = boto3.client('sagemaker-runtime')
        self.contentType = 'application/json'

    def main(self, image):
        try:
            response = self.client.invoke_endpoint(
                EndpointName=self.end_point,
                CustomAttributes=self.custom_attributes,
                ContentType=self.contentType,
                Body=image
            )
            return response
        except Exception as e:
            print(e)
class PeopleOntology:
    def __init__(self, session:AuthorizedSession, userId):
        self.IFR = './static'
        self.session = session
        self.queue = queue.Queue()
        self.session.mount('https://', HTTPAdapter(pool_maxsize=16, max_retries=10, pool_block=True))
        self.userId = userId
        self.pageNum = int(os.getenv('PHOTO_THREAD_NUM'))
        self.input_size = 416
        self.batch_size = 1

    def afterall(self, tic, i):
        self.queue.join()
        toc = time.perf_counter()
        print(f"\rTotal people process {i} images in {toc - tic:0.4f} seconds")
        user = User.objects(userId=self.userId)
        user.update(
            set__people_onto__lastSync=make_aware(datetime.datetime.utcnow(),
                                    timezone=pytz.timezone(settings.TIME_ZONE))
        )
    def people_pipline(self, mediaItem):
        try:
        # get the image data
            filename = mediaItem['filename']
            image = Image.open(f'{self.IFR}/{self.userId}/{filename}')
            image = np.asarray(image.resize((self.input_size, self.input_size)))
            image = image / 255.
            image = np.concatenate([image[np.newaxis, :, :]] * self.batch_size)
            body = json.dumps({"instances": image.tolist()})
            ep = Endpoint()
            result = ep.main(body)
            result = json.loads(result["Body"].read().decode("utf-8"))
            for key, value in result.items():
                boxes = value[:, :, 0:4]
                print(boxes)
                pred_conf = value[:, :, 4:]
                print(pred_conf)

            boxes, scores, classes, valid_detections = tf.image.combined_non_max_suppression(
                boxes=tf.reshape(boxes, (tf.shape(boxes)[0], -1, 1, 4)),
                scores=tf.reshape(
                    pred_conf, (tf.shape(pred_conf)[0], -1, tf.shape(pred_conf)[-1])),
                max_output_size_per_class=50,
                max_total_size=50,
                iou_threshold=0.45,
                score_threshold=0.25
            )
            classesDict = {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorbike', 4: 'aeroplane', 5: 'bus', 6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat', 35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza', 54: 'donut', 55: 'cake', 56: 'chair', 57: 'sofa', 58: 'potted plant', 59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tvmonitor', 63: 'laptop', 64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book', 74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier', 79: 'toothbrush'}
            num_classes = len(classesDict)
            out_scores = scores.numpy()
            out_classes = classes.numpy()
            num_boxes = valid_detections.numpy()
            result = []
            for i in range(num_boxes[0]):
                if int(out_classes[0][i]) < 0 or int(out_classes[0][i]) > num_classes: continue
                score = out_scores[0][i] # 要
                class_ind = int(out_classes[0][i]) #要
                temp={}
                temp[classes[class_ind]] = score
                result.append(temp)
            print(result)
        except Exception as e:
            print(f'Error from initial people api pipline{e}')
            print(traceback.format_exc())
    def initial(self):
        tic = time.perf_counter()
        nPT = ''
        pool=ThreadPool(self.queue)
        params = {'pageSize': self.pageNum}
        i = 0
        try:
            if not os.path.isdir(f'{self.IFR}/{self.userId}'):
                os.mkdir(f'{self.IFR}/{self.userId}')
            while True:
                if nPT:
                    params['pageToken'] = nPT
                photoRes = self.session.get(
                    'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
                mediaItems = photoRes.get('mediaItems', None)
                if not mediaItems:
                    break
                print(f'Handling {len(mediaItems)} People items')
                for mediaItem in mediaItems:
                    mimeType, _ = mediaItem['mimeType'].split('/')
                    if mimeType == 'image':
                        pool.add_task(self.people_pipline, mediaItem=mediaItem)
                        i=i+1
                if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
                    break
                else:
                    nPT = photoRes['nextPageToken']
        except Exception as e:
            print(f'Error from initial people api {e}')
        Thread(target=self.afterall, args=(tic,i), daemon=True).start()
    def refresh(self):
        tic = time.perf_counter()
        User.objects(userId=self.userId).update(set__isFreshing=True, set__isSync=False)
        nPT = ''
        pool=ThreadPool(self.queue)
        params = {'pageSize': self.pageNum}
        i = 0
        try:
            if not os.path.isdir(f'{self.IFR}/{self.userId}'):
                os.mkdir(f'{self.IFR}/{self.userId}')
            while True:
                if nPT:
                    params['pageToken'] = nPT
                photoRes = self.session.get(
                    'https://photoslibrary.googleapis.com/v1/mediaItems', params=params).json()
                mediaItems = photoRes.get('mediaItems', None)
                if not mediaItems:
                    break
                print(f'Handling {len(mediaItems)} items')
                for mediaItem in mediaItems:
                    dbres = Photo.objects(photoId=mediaItem['id'])
                    mimeType, _ = mediaItem['mimeType'].split('/')
                    if not dbres and mimeType == 'image':
                        pool.add_task(self.people_pipline, mediaItem=mediaItem)
                        i=i+1
                if not os.getenv('CV_RELEASE', None) == "True" or not photoRes.get('nextPageToken', None):
                    break
                else:
                    nPT = photoRes['nextPageToken']
        except Exception as e:
            print(e)
        Thread(target=self.afterall, args=(tic,i), daemon=True).start()