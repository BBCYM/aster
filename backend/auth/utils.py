import json
from googletrans import Translator
import random

def getLabelDescription(data):
    return data.description


def toMandarin(data):
    translator = Translator()
    return translator.translate(data, dest='zh-tW').text


def stringify(data: dict):
    return json.dumps(data)


def simpleMessage(text):
    return stringify({'message': text})


def randLocation():
    location = {
        '臺北市': [
            '中正區', '大同區', '中山區', '萬華區', '信義區', '松山區', '大安區', '南港區', '北投區', '內湖區', '士林區', '文山區'
        ],
        '花蓮縣': [
            '花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '秀林鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '富里鄉', '卓溪鄉'
        ],
    }
    rand1 = random.choice(location.keys())
    rand2 = random.choice(location[rand1].values())
    return rand2