from djongo import models
# from ...backend.photo.models import Photo


class Tag(models.Model):
    tag = models.CharField(max_length=255)

    class Meta:
        abstract = True


class Album(models.Model):
    albumId = models.CharField(max_length=255, primary_key=True)
    userId = models.CharField(max_length=255)
    # photoId = models.ArrayField(model_container=Photo)
    # tag = models.EmbeddedField(model_container=Tag, null=True, blank=True)

    time = models.DateTimeField()
