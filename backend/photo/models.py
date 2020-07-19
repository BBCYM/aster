from djongo import models

# todo


class Top3_tag(models.Model):
    tag = models.CharField()
    precision = models.CharField()


class All_Tag(models.Model):
    tag = models.CharField()
    precision = models.CharField()


class Tag(models.Model):
    main_tag = models.CharField()
    emotion_tag = models.CharField()
    top3_tag = models.EmbeddedField(model_container=Top3_tag)
    all_tag = models.EmbeddedField(model_container=All_Tag)


class Photo(models.Model):
    userId = models.CharField()
    photoId = models.CharField()
    tag = models.EmbeddedField(model_container=Tag)
    location = models.CharField()
    time = models.DateTimeField()
