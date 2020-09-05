# google vision import
import os
import sys
from google.auth.transport.requests import Request, AuthorizedSession
from google.cloud.vision import ImageAnnotatorClient, types
from google.oauth2 import id_token, credentials, service_account
import pandas

from color_detect import color_detection

credent = service_account.Credentials.from_service_account_file(
    '../anster-1593361678608.json')

def localize_objects(path):
    """Localize objects in the local image.

    Args:
    path: The path to the local file.
    """
    from google.cloud import vision
    client = vision.ImageAnnotatorClient(credentials=credent)

    with open(path, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)

    objects = client.object_localization(
        image=image).localized_object_annotations           
    return objects

if __name__ == "__main__":
    path = "blue_suit2.jpg"
    objects = localize_objects(path)
    result_array = color_detection(objects, path)
    print(result_array)
