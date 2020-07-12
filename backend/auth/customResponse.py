import json


def stringify(data: dict):
    return json.dumps(data)


def simpleMessage(text):
    return stringify({'message': text})
