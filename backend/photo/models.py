from djongo import models


class Top3_tag(models.Model):
    tag = models.CharField(max_length=255)
    precision = models.CharField(max_length=255)


    class Meta:
        abstract = True


class Custom_tag(models.Model):
    tag = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)  # add by bobo



class All_Tag(models.Model):
    tag = models.CharField(max_length=255)
    precision = models.CharField(max_length=255)

    class Meta:
        abstract = True


class Tag(models.Model):
    main_tag = models.CharField(max_length=255)
    emotion_tag = models.CharField(max_length=255)
    custom_tag = models.ArrayField(model_container=Custom_tag)  # add by bobo
    top3_tag = models.ArrayField(model_container=Top3_tag)
    all_tag = models.ArrayField(model_container=All_Tag)

    class Meta:
        abstract = True


class Photo(models.Model):
    photoId = models.CharField(max_length=255, primary_key=True)
    userId = models.CharField(max_length=255)
    tag = models.EmbeddedField(model_container=Tag, null=True, blank=True)
    location = models.CharField(max_length=255)
    decription = models.CharField(max_length=2550, null=True, blank=True)
    create_time = models.DateTimeField()  # 拍照的時間
    upload_time = models.DateTimeField()  # 上傳到後端的照片
    is_deleted = models.BooleanField(default=False)  # add by bobo
    time = models.DateTimeField()

