# from djongo import models
# import datetime
from datetime import datetime
from mongoengine import Document, fields, signals


class User(Document):
    userId = fields.StringField(unique=True)
    expiresAt = fields.DateTimeField()
    refreshToken = fields.StringField()
    lastUpdateTime = fields.DateTimeField(default=datetime.utcnow())
    lastSync = fields.DateTimeField()
    isSync = fields.BooleanField(default=False)
    isFreshing = fields.BooleanField(default=False)

    @classmethod
    def pre_save(cls, sender, document):
        document.lastUpdateTime = datetime.utcnow()


signals.pre_save.connect(User.pre_save, sender=User)

