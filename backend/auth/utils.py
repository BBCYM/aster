import json
from googletrans import Translator


def getLabelDescription(data):
    return data.description
def toMandarin(data):
    translator = Translator()
    return translator.translate(data,dest='zh-tW').text

def stringify(data: dict):
    return json.dumps(data)
def simpleMessage(text):
    return stringify({'message': text})
