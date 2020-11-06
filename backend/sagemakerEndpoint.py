import boto3
# import cv2
import numpy as np
# import tensorflow as tf
from PIL import Image
import json
import tensorflow as tf

class Preprocess:
    def __init__(self):
        self.input_size = 416
        self.score = 0.25
        self.batch_size = 1

    def main(self, image_path):
        image = Image.open(image_path)
        image = np.asarray(image.resize((self.input_size, self.input_size)))
        image = image / 255.
        image = np.concatenate([image[np.newaxis, :, :]] * self.batch_size)
        body = json.dumps({"instances": image.tolist()})
        return body


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
            # print(response['Body'].read())
            return response
        except Exception as e:
            print(e)


if __name__ == '__main__':
    path = 'kite.jpg'
    try:
        p = Preprocess()
        payload = p.main(path)

        ep = Endpoint()
        result = ep.main(payload)

        res_json = json.loads(result["Body"].read().decode("utf-8"))
        value = res_json['predictions']
        value = tf.convert_to_tensor(value, dtype=tf.float32)
        
    except SystemExit:
        pass
    except Exception as e:
        print(e)
