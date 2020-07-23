import csv
from googletrans import Translator as g_translator
# from translate import translator as py_translator
import itertools

import sys

translator = g_translator()

all_list = ['\"AllTAG\"']
count = 0
for i in range(3000):
    i = i + 50
    with open('class-descriptions.csv', newline='', encoding="utf-8") as csvfile:
        rows = csv.reader(csvfile)
        for index, row in enumerate(itertools.islice(rows, 5000)):
            if index < i-50:
                continue
            try:
                ch = "\'"+translator.translate(row[1], dest="zh-tw").text+"\'"
                # ch = "\'" + py_translator('en', 'zh-TW', row[1]) + "\'"

                list_ch = [ch, ch, "\'"+row[1]+"\'"]
                all_list.append(list_ch)
                count = count + 1
                if count % 10 == 0:
                    print(count)
                if count >= i:
                    break
            except Exception as e:
                print(e)

    with open('result2.csv', 'w', newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile, quotechar='\"', delimiter=',')
        for row in all_list[count-50:count]:
            print(row)

            writer.writerow(row)
