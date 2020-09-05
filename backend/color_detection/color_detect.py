from detection import find_dominate_color, location_preprocess


def color_detection(objects, file_name, resize=False, resize_ratio=0.8, resize_threshold=10000, color_nums=5, show_img=False, show_size=False):
    #把物件、可信度、物件位置抓出來
    color_name_array = []
    try:
        object_array = location_preprocess(objects)
        #針對每個物件增加顏色array
        for object_ in object_array: #遍歷照片中的每個物件
            color_name = find_dominate_color(file_name, object_['location'], resize, resize_ratio, resize_threshold, color_nums, show_img, show_size) #取得顏色號碼陣列
            color_name_array.append(color_name)
        return color_name_array
    except Exception as e:
        print(f'Error: color_detection went wrong, Exception:{e}')
        return []