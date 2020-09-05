import os
import sys
from google.auth.transport.requests import Request, AuthorizedSession
from google.cloud.vision import ImageAnnotatorClient, types
from google.oauth2 import id_token, credentials, service_account
import pandas
credent = service_account.Credentials.from_service_account_file(
    'anster-1593361678608.json')

# C: \Users\USER\Desktop\aster\preprocessing\ObjectDetection\vision.py
# C: \Users\USER\Desktop\aster\backend\anster-1593361678608.json
client = ImageAnnotatorClient(credentials=credent)
filename = 'ImageFile/default_filename.jpg'

with open(f'{filename}', 'rb') as f:
    content = f.read()

image = types.Image(content=content)
res = client.label_detection(image=image)
print(res)
labels = res.label_annotations

print(labels)

print(calculate_similarity(vectors[0], vectors[0]))  # dog1 dog1
print(calculate_similarity(vectors[0], vectors[1]))  # dog1 dog2
print(calculate_similarity(vectors[0], vectors[2]))  # dog1 dog3
print(calculate_similarity(vectors[1], vectors[2]))  # dog2 dog3
print(calculate_similarity(vectors[0], vectors[3]))  # dog1 cat
print(calculate_similarity(vectors[1], vectors[3]))  # dog2 cat
print(calculate_similarity(vectors[2], vectors[3]))  # dog3 cat
print(calculate_similarity(vectors[0], vectors[4]))  # dog1 ocean1
print(calculate_similarity(vectors[1], vectors[4]))  # dog2 ocean1
print(calculate_similarity(vectors[2], vectors[4]))  # dog3 ocean1
print(calculate_similarity(vectors[0], vectors[5]))  # dog1 ocean2
print(calculate_similarity(vectors[1], vectors[5]))  # dog2 ocean2
print(calculate_similarity(vectors[2], vectors[5]))  # dog3 ocean2
print(calculate_similarity(vectors[3], vectors[5]))  # dog4 ocean2
print(calculate_similarity(vectors[4], vectors[5]))  # ocean1 ocean2
