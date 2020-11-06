from mongoengine import Document, fields, EmbeddedDocument, signals
from datetime import datetime


class Custom_tag(EmbeddedDocument):
    tag = fields.StringField()
    is_deleted = fields.BooleanField(default=False)


class ATag(EmbeddedDocument):
    tag = fields.StringField()
    precision = fields.FloatField()

class PeopleTag(EmbeddedDocument):
    count = fields.IntField(default=0)
    ontology = fields.ListField()
    celebrity = fields.ListField()

class BasicStructure(EmbeddedDocument) :
    main_tag = fields.EmbeddedDocumentListField(ATag)
    color = fields.ListField()
    people = fields.EmbeddedDocumentField(PeopleTag, default=PeopleTag())
    location = fields.ListField()
    emotion_tag = fields.StringField(default="")
    deduction = fields.ListField()

class Tag(EmbeddedDocument):
    zh_tw = fields.EmbeddedDocumentField(BasicStructure, default=BasicStructure())
    en = fields.EmbeddedDocumentField(BasicStructure, default=BasicStructure())
    cust_location_onto = fields.ListField()
    custom_tag = fields.EmbeddedDocumentListField(Custom_tag)
    

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

