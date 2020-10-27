from mongoengine import Document, fields, EmbeddedDocument, signals
from datetime import datetime
from photo.models import Tag, ATag, Custom_tag

class AlbumPhoto(EmbeddedDocument):
    photoId = fields.StringField()
    isDeleted = fields.BooleanField(default=False)


class AlbumTag(EmbeddedDocument):
    tag = fields.StringField()
    isDeleted = fields.BooleanField(default=False)


class Album(Document):

    # albumId = fields.StringField()
    _id = fields.ObjectIdField()
    coverPhotoId = fields.StringField()
    albumName = fields.StringField()
    userId = fields.StringField()
    albumPhoto = fields.EmbeddedDocumentListField(AlbumPhoto)
    albumTag = fields.EmbeddedDocumentListField(AlbumTag)
    createTime = fields.DateTimeField(default=datetime.utcnow())  # 建相簿的時間
    updateTime = fields.DateTimeField(default=datetime.utcnow())
    isDeleted = fields.BooleanField(default=False)

    @classmethod
    def pre_save(cls, sender, document):
        document.lastUpdateTime = datetime.utcnow()


signals.pre_save.connect(Album.pre_save, sender=Album)

