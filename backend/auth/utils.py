import json
from googletrans import Translator
import random
import inspect
from threading import Thread
import queue
import time
import traceback
def getLabelDescription(data):
    temp = str(data.description).encode('utf-8')
    result = str(temp, 'utf-8')
    return result


def toSingleMan(data):
    try:
        translator = Translator()
        result = translator.translate(data, dest='zh-tw')
        
        if result and result.text:
            return str(result.text)
        else:
            print('A SingleMan None')
            return None
    except Exception as e:
        print(f'Error from toSingleMan {e}')
        # print(traceback.format_exc())

def toMandarin(data):
    try:
        translator = Translator()
        return list(map(lambda l: l.text, translator.translate(data, dest='zh-tw')))
    except Exception as e:
        print(f'Error from to Mandarin {e}')
     

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


class Worker():
    def __init__(self, tasks:queue.Queue, serial):
        self.tasks = tasks
        self.serial = serial
        self.go()

    def go(self):
        while True:
            func, args, kwargs = self.tasks.get()
            kwargs['serial'] = self.serial
            func(*args, **kwargs)
            self.tasks.task_done()

class ThreadPool:
    def __init__(self, QueueManager:queue.Queue()):
        self.maxCore = 2
        self.tasks = QueueManager
        self.daemon = True
        self.work()

    def add_task(self, func, *args, **kargs):
        self.tasks.put((func, args, kargs))

    def work(self):
        for i in range(self.maxCore):
            Thread(target=Worker, args=(self.tasks,i),daemon=self.daemon).start()
