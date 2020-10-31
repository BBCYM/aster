from mongoengine import Document, fields, EmbeddedDocument, signals
from datetime import datetime


class Custom_tag(EmbeddedDocument):
    tag = fields.StringField()
    is_deleted = fields.BooleanField(default=False)


class ATag(EmbeddedDocument):
    tag = fields.StringField()
    precision = fields.StringField()

class PeopleTag(EmbeddedDocument):
    count = fields.IntField()
    ontology = fields.ListField()

class BasicStructure(EmbeddedDocument) :
    main_tag = fields.EmbeddedDocumentListField(ATag)
    color = fields.ListField()
    people = fields.EmbeddedDocumentField(PeopleTag)
    emotion_tag = fields.StringField()
    custom_tag = fields.EmbeddedDocumentListField(Custom_tag)
    location = fields.ListField()

class Tag(EmbeddedDocument):
    zh_tw = fields.EmbeddedDocumentField(BasicStructure)
    en = fields.EmbeddedDocumentField(BasicStructure)
    

class GeoData(EmbeddedDocument):
    latitude=fields.FloatField()
    longitude=fields.FloatField()


class Photo(Document):
    photoId = fields.StringField(unique=True)
    filename = fields.StringField()
    userId = fields.StringField()
    tag = fields.EmbeddedDocumentField(Tag)
    gps = fields.EmbeddedDocumentField(GeoData)
    createTime = fields.DateTimeField()  # 拍照的時間
    updateTime = fields.DateTimeField(default=datetime.utcnow())
    isDeleted = fields.BooleanField(default=False)

    @classmethod
    def pre_save(cls, sender, document):
        document.lastUpdateTime = datetime.utcnow()

signals.pre_save.connect(Photo.pre_save, sender=Photo)

