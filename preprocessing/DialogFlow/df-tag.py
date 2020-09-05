import csv
from googletrans import Translator as g_translator
# from translate import translator as py_translator
import itertools
from time import sleep

import sys

global translator
translator = g_translator()


count = 0
start = 19980
WRITE = 20
MAX = 19985


if start != 0:
    all_list = []
else:
    all_list = ['\"AllTAG\"']


def more_translate(rt):
    ans = []
    modify_answer = []
    # lan = translator.detect(txt)

    try:
        # rt = translator.translate(t, src=lan.lang, dest="zh-tw")

        if rt.extra_data["all-translations"] != None:
            for i in range(len(rt.extra_data["all-translations"])):
                new_trans = rt.extra_data["all-translations"][i][1]

                if i == 0:
                    ans = new_trans
                else:
                    ans = ans + new_trans

            for a in ans:
                modify_answer.append("\"" + a + "\"")

            return modify_answer

    except Exception as e:
        print(f'error: more_translate, {e}')

        return []

    return []


def detach_brackets(txt):
    left_bracket = txt.find("（")

    if left_bracket != -1:
        txt = txt[:left_bracket].replace(" ", "")

    return txt


def double_check(txt):
    counter = 0
    new_txt = ""
    try:

        while counter < 3:
            lan = translator.detect(txt)

            if lan.lang == 'zh-CN' or lan.lang == 'zh-TW' or lan.lang == 'zh-CNja' or lan.lang == 'ja':
                print(f'txt: {txt}, lan: {lan.lang}')
                return txt

            sleep(counter+1)
            counter = counter + 1

            trans = translator.translate(txt, dest="zh-tw")  # 重新翻譯一次

            new_txt = trans.text
            lan = translator.detect(trans.text).lang

            print('translate miss, ', 'origin: ',
                  txt, ' now: ', new_txt, " lang: ", lan, " counter: ", counter)

            if lan == 'zh-CN' or lan == 'zh-TW' or lan == 'zh-CNja':
                print("translate success")
                return new_txt

        return new_txt
    except Exception as e:
        print(e)
    return txt


while count + start < MAX:
    translator = g_translator()
    with open('class-descriptions.csv', newline='', encoding="utf-8") as csvfile:

        rows = csv.reader(csvfile)
        for index, row in enumerate(rows):
            if index < start:
                continue

            trans = translator.translate(row[1], dest="zh-tw")

            ch = double_check(trans.text)

            ch = detach_brackets(ch)

            ch = "\""+ch+"\""

            list_ch = [ch, ch, "\""+row[1]+"\""]

            other_translate = more_translate(trans)

            if len(other_translate) > 0:
                for t in other_translate:
                    list_ch.append(t)

            all_list.append(list_ch)

            if count % 20 == 0:
                sleep(2)
                print(count, list_ch)
            else:
                sleep(2)
            count = count + 1

            if count % WRITE == 0:
                break

    with open('result3.csv', 'a', newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile, quotechar='\'', delimiter=',')
        writer.writerows(all_list)

    all_list = []
    start = start + WRITE
