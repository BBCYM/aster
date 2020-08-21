import csv
import re

all_list = []

with open('result3.csv', 'r', newline="", encoding="utf-8") as csvfile:
    rows = csv.reader(csvfile)
    for row in rows:
        temp = []
        for i in row:
            if i.find(',') != -1:
                # print(i)

                first = i[:i.find(',')]
                second = i[i.find(',')+1:]

                temp.append("\""+first+"\"")
                temp.append("\""+second+"\"")
            elif i.find('\'') != -1:
                print(i)

                i.replace('"', "")
                print(i)
                temp.append(i)
            else:
                i = "\""+i+"\""
                temp.append(i)
        all_list.append(temp)


with open('result2.csv', 'w', newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile, quotechar='\'', delimiter=',')
    writer.writerows(all_list)
