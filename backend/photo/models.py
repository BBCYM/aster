from djongo import models


class Top3_tag(models.Model):
    tag = models.CharField(max_length=255)
    precision = models.CharField(max_length=255)
    class Meta:
        abstract = True


class All_Tag(models.Model):
    tag = models.CharField(max_length=255)
    precision = models.CharField(max_length=255)
    class Meta:
        abstract = True


class Tag(models.Model):
    main_tag = models.CharField(max_length=255)
    emotion_tag = models.CharField(max_length=255)
    top3_tag = models.ArrayField(model_container=Top3_tag)
    all_tag = models.ArrayField(model_container=All_Tag)
    class Meta:
        abstract = True


class Photo(models.Model):
    photoId = models.CharField(max_length=255,primary_key=True)
    userId = models.CharField(max_length=255)
    tag = models.EmbeddedField(model_container=Tag,null=True,blank=True)
    location = models.CharField(max_length=255)

    time = models.DateTimeField()
