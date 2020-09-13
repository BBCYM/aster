from bson import ObjectId
def is_valid_objectId(tocheck:str):
    return ObjectId.is_valid(tocheck)