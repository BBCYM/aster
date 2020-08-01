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


class Photo(Document):
    photoId = fields.StringField()
    userId = fields.StringField()
    tag = fields.EmbeddedDocumentField(Tag)
    location = fields.StringField()
    createTime = fields.DateTimeField()  # 拍照的時間
    updateTime = fields.DateTimeField(default=datetime.utcnow())  # 上傳到後端的照片
    isDeleted = fields.BooleanField(default=False)

    @classmethod
    def pre_save(cls, sender, document):
        document.lastUpdateTime = datetime.utcnow()


signals.pre_save.connect(Photo.pre_save, sender=Photo)

# photoId = fields.StringField(max_length=255, primary_key=True)
# userId = fields.StringField(max_length=255)
# tag = models.EmbeddedField(model_container=Tag, null=True, blank=True)
# location = fields.StringField(max_length=255, null=True, blank=True)
# decription = fields.StringField(max_length=2550, null=True, blank=True)
# create_time = models.DateTimeField(null=True, blank=True)  # 拍照的時間
# time = models.DateTimeField()  # 上傳到後端的照片
# is_deleted = models.BooleanField(default=False)  # add by bobo
