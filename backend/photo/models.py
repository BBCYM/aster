from djongo import models

# todo
class Top3_tag(models.Model):
    pass

class All_Tag(models.Model):
    pass



class Tag(models.Model):
    main_tag = models.CharField()
    emotion_tag = models.CharField()
    top3_tag = models.ArrayField()
    all_tag = models.ArrayField()


class Photo(models.Model):
    userId = models.CharField()
    photoId = models.CharField()
    tag = models.EmbeddedField(model_container=Tag)
    location = models.CharField()
    time = models.DateTimeField()
