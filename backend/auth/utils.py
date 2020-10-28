import json
from googletrans import Translator
import random
import inspect

def getLabelDescription(data):
    return data.description


def toMandarin(data):
    translator = Translator()
    return list(map(lambda l: l.text, translator.translate(data, dest='zh-tW')))
     

def stringify(data: dict):
    return json.dumps(data)


def simpleMessage(text):
    return stringify({'message': text})


def randLocation():
    taipei = [
        '中正區', '大同區', '中山區', '萬華區', '信義區', '松山區', '大安區', '南港區', '北投區', '內湖區', '士林區', '文山區'
    ]
    rand = random.choice(taipei)
    return rand

def get_class_that_defined_method(meth):
    if inspect.isfunction(meth):
        cls = getattr(inspect.getmodule(meth),
                      meth.__qualname__.split('.<locals>', 1)[0].rsplit('.', 1)[0],
                      None)
        if isinstance(cls, type):
            return cls
    return None  # not required since None would have been implicitly returned anyway
