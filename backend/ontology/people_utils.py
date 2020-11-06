import requests
import os
from mongoengine.queryset.visitor import Q
from photo.models import Photo, PeopleTag, ATag
import datetime
from requests.adapters import HTTPAdapter
import queue
import time
from google.oauth2 import service_account
from auth.utils import ThreadPool
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
# import tensorflow as tf
import traceback
from ontology.utils import ColorProcess
from num2words import num2words
import cv2
# def read_class_names(class_file_name):
#     names = {}
#     with open(class_file_name, 'r') as data:
#         for ID, name in enumerate(data):
#             names[ID] = name.strip('\n')
#     return names
# def draw_bbox(bboxes, classes=read_class_names('./coco.names')):
#     num_classes = len(classes)
#     out_boxes, out_scores, out_classes, num_boxes = bboxes
#     people = 0
#     image_result = []
#     for i in range(num_boxes[0]):
#         if int(out_classes[0][i]) < 0 or int(out_classes[0][i]) > num_classes: continue
#         score = out_scores[0][i] #need
#         class_ind = int(out_classes[0][i]) # need
#         if classes[class_ind] == "person":
#             people = people + 1
#             continue
#             if float(score) < 60:
#                 continue
#             image_result.append(ATag(tag=classes[class_ind], precision=float(score)))
#     people_onto = [str(people)+"個人", str(people)+"人"]
#     people_onto_en = [f'{people} person' if people == 1 else f'{people} people' ]
#     ch_code = ""
#     if people == 0:
#         ch_code = "零"
#         people_onto.append("沒人")
#         people_onto.append("no people")
#     elif people == 1:
#         ch_code = "一"
#         people_onto.append("獨照")
#     elif people == 2:
#         ch_code = "二"
#         people_onto.append("兩人")
#     elif people == 3:
#         ch_code = "三"
#     elif people == 4:
#         ch_code = "四"
#     elif people == 5:
#         ch_code = "五"
#     elif people == 6:
#         ch_code = "六"
#     elif people == 7:
#         ch_code = "七"
#     elif people == 8:
#         ch_code = "八"
#     elif people == 9:
#         ch_code = "九"
#     elif people == 10:
#         ch_code = "十"
#     if people <= 10:
#         people_onto.append(ch_code+"個人")
#         people_onto.append(ch_code+"人")
#     if people>2:
#         people_onto.append("人群")
#         people_onto_en.extend(['many people','a group of people'])
#     people_onto_en.append(f'{num2words(people)} person' if people == 1 else f'{num2words(people)} people')
#     return image_result, people, people_onto, people_onto_en
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
#             return response
#         except Exception as e:
#             print(e)
class PeopleOntology:
    def __init__(self, session:AuthorizedSession, userId):
        self.IFR = './static'
        self.session = session
        self.queue = queue.Queue()
        self.session.mount('https://', HTTPAdapter(pool_maxsize=8, max_retries=10, pool_block=True))
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
        # # color
        # color_process = ColorProcess(session=self.session, userId=self.userId)
        # Thread(target=color_process.initial,daemon=True).start()
    def people_pipline(self, mediaItem, serial):
        try:
        # get the image data
            filename = mediaItem['filename']
            addr = f'http://40.83.112.73:{5230+serial}/'
            test_url = addr + '/api/yolov4/people'

            # prepare headers for http request
            content_type = 'image/jpeg'
            headers = {'content-type': content_type}

            img = cv2.imread(f'{self.IFR}/{self.userId}/{filename}')
            # encode image as jpeg
            _, img_encoded = cv2.imencode('.jpg', img)
            # send http request with image and receive response
            response = requests.post(test_url, data=img_encoded.tobytes(), headers=headers)
            # decode response
            result = json.loads(response.text)
            p = Photo.objects(photoId=mediaItem['id']).get()
            for r in result['detection']:
                at = ATag(tag=r[0],precision=float(r[1])/100)
                p.tag.en.main_tag.append(at)
            pt = PeopleTag(count = int(result['people']['count']))
            for o in result['people']['ontology']:
                pt.ontology.append(o)
            p.tag.zh_tw.people = pt
            pt = PeopleTag(count = result['people']['count'])
            for o in result['people']['ontology_en']:
                pt.ontology.append(o)
            p.tag.en.people = pt
            p.save()
            # image = Image.open(f'{self.IFR}/{self.userId}/{filename}')
            # image = np.asarray(image.resize((self.input_size, self.input_size)))
            # image = image / 255.
            # image = np.concatenate([image[np.newaxis, :, :]] * self.batch_size)
            # body = json.dumps({"instances": image.tolist()})
            # ep = Endpoint()
            # result = ep.main(body)
            # result = json.loads(result["Body"].read().decode("utf-8"))
            
            # value = tf.convert_to_tensor(result['predictions'], dtype=tf.float32)
            # boxes = value[:, :, 0:4]
            # pred_conf = value[:, :, 4:]
            # boxes, scores, classes, valid_detections = tf.image.combined_non_max_suppression(
            #     boxes=tf.reshape(boxes, (tf.shape(boxes)[0], -1, 1, 4)),
            #     scores=tf.reshape(
            #         pred_conf, (tf.shape(pred_conf)[0], -1, tf.shape(pred_conf)[-1])),
            #     max_output_size_per_class=50,
            #     max_total_size=50,
            #     iou_threshold=0.45,
            #     score_threshold=0.25
            # )
            # pred_bbox = [boxes.numpy(), scores.numpy(), classes.numpy(), valid_detections.numpy()]
            # image_result, people_num, people_onto, people_onto_en = draw_bbox(pred_bbox)
            # pt_zh = PeopleTag(count=people_num, ontology=people_onto)
            # pt_en = PeopleTag(count=people_num, ontology=people_onto_en)
            # p = Photo.objects(photoId=mediaItem['id']).get()
            # p.tag.zh_tw.people = pt_zh
            # p.tag.en.people = pt_en
            # p.save()
        except Exception as e:
            print(f'Error from initial people api pipline {e}')
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

