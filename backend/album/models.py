from djongo import models
from photo.models import Photo


class Tag(models.Model):
    tag = models.CharField(max_length=255)

    class Meta:
        abstract = True


class Album(models.Model):
    albumId = models.CharField(max_length=255, primary_key=True)
    albumName = models.CharField(max_length=255)
    userId = models.CharField(max_length=255)
    photo = models.EmbeddedField(model_container=Photo, null=True, blank=True)
    tag = models.ArrayField(model_container=Tag, null=True, blank=True)

    time = models.DateTimeField()
