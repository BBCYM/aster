from mongoengine import Document, fields, EmbeddedDocument, signals
from datetime import datetime


class Custom_tag(EmbeddedDocument):
    tag = fields.StringField()
    is_deleted = fields.BooleanField(default=False)


class ATag(EmbeddedDocument):
    tag = fields.StringField()
    precision = fields.StringField()


class Tag(EmbeddedDocument):
    main_tag = fields.StringField()
    emotion_tag = fields.StringField()
    custom_tag = fields.EmbeddedDocumentListField(Custom_tag)
    top3_tag = fields.EmbeddedDocumentListField(ATag)
    all_tag = fields.EmbeddedDocumentListField(ATag)


class Photo(EmbeddedDocument):
    photoId = fields.StringField()
    userId = fields.StringField()
    tag = fields.EmbeddedDocumentField(Tag)
    location = fields.StringField()
    createTime = fields.DateTimeField()  # 拍照的時間
    updateTime = fields.DateTimeField(default=datetime.utcnow())
    isDeleted = fields.BooleanField(default=False)
    # meta = {'allow_inheritance': True}

    @classmethod
    def pre_save(cls, sender, document):
        document.lastUpdateTime = datetime.utcnow()


signals.pre_save.connect(Photo.pre_save, sender=Photo)
