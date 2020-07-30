# from djongo import models
# import datetime
from datetime import datetime
from mongoengine import Document, fields, signals


class User(Document):
    userId = fields.StringField()
    expiresAt = fields.DateTimeField()
    refreshToken = fields.StringField()
    lastUpdateTime = fields.DateTimeField(default=datetime.utcnow())
    lastSync = fields.DateTimeField()
    isSync = fields.BooleanField(default=False)

    @classmethod
    def pre_save(cls, sender, document):
        document.lastUpdateTime = datetime.utcnow()


signals.pre_save.connect(User.pre_save, sender=User)
# userId = models.CharField(max_length=100,primary_key=True)
# expiresAt = models.DateTimeField(null=True,blank=True)
# refreshToken=models.CharField(max_length=512,blank=False)
# lastUpdateTime=models.DateTimeField(auto_now=True)
# lastSync=models.DateTimeField(null=True, blank=True)
# isSync=models.BooleanField(default=False)
