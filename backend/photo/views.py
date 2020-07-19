from rest_framework.views import APIView
from .models import Photo
from datetime import datetime
class PhotoView(APIView):
    def get(self, request):
        Photo.object.create(
            userId = 'skdfnsdf',
            photoId = 'ovbienrpj',
            tag = {
                main_tag: 'cat',
                emotion_tag: 'cute',
                top3_tag: ['c1','c2','c3'],
                all_tag: ['c1','c2','c3','c4','c5']
            },
            location='Taipei',
            time=datetime.utcnow()
        )

