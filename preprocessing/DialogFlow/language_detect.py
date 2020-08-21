from googletrans import Translator as g_translator

translator = g_translator()

# txt_list = ["Elephant polo", "Aero l-29 delfín", "Nightlight", "Exotic dancer", "Maruti 800", "Mcdonald's chicken mcnuggets", "Auto show", "Kalimotxo", "Nissan sunny", "Ibizan hound", "Irish wolfhound", "Porsche 911 gt1",
#             "Cheerwine", "Girdle", "Lurcher", "Boccia", "Medical glove", "Crate", "Bookcase", "Filmjölk", "Nehi", "Combretaceae", "Hangar", "King crab", "Frikadeller", "Frikandel", "Kodiak bear", "Mission", "Bmw 330"]

txt_list = ["Kazoo", 'Outer space', '意大利辣味香腸', '開心果冰淇淋', '編舞']


def double_check(txt, rt):
    lan = translator.detect(txt)
    if lan.lang != ('zh-CN' or 'zh-TW'):
        print('double_check')
        return translator.translate(txt, dest="zh-tw")
    return rt


def detach_brackets(txt):
    left_bracket = txt.find("（")

    print(left_bracket)
    if left_bracket != -1:
        txt = txt[:left_bracket].replace(" ", "")
    return txt


def more_translate(txt):
    ans = []
    modify_answer = []
    lan = translator.detect(txt)
    print(lan.lang)
    try:
        rt = translator.translate(t, src=lan.lang, dest="zh-tw")
        rt = double_check(rt.text, rt)
        # print(rt.extra_data)
        # print(detach_brackets(rt.text))
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


for t in txt_list:
    print(more_translate(t))
