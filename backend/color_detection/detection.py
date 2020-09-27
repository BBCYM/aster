# 顏色偵測
from __future__ import print_function
import binascii
import struct
import numpy as np
import scipy
import scipy.misc
import scipy.cluster 
import matplotlib.pyplot as plt
from googletrans import Translator
from preprocess import crop_image, get_color_name, translate_color
from color_onto import get_common_color_name

def find_dominate_color(file_name, location, resize, resize_ratio, resize_threshold, color_nums, show_img, show_size):
    NUM_CLUSTERS = color_nums
    color_name_array = []
    
    # 照片前處理
    try: 
        im = crop_image(file_name, location) #切圖片
        
        if show_img:
            print('crop_img:', location)
            plt.figure()
            plt.imshow(im) ## for testing
        
        width, height = im.size
        if show_size:
            print(f'width: {width}, height: {height}')
        
        if resize or width > resize_threshold or height > resize_threshold:
            resize_width = int(width * resize_ratio)
            resize_height = int(height * resize_ratio)
            print(f'start image resize to {resize_width}, {resize_height}')
            
            im = im.resize((resize_width, resize_height))      #壓縮圖片 減少時間 如果resize = true
            
        ar = np.asarray(im)
        shape = ar.shape
        ar = ar.reshape(np.product(shape[:2]), shape[2]).astype(float)
    except Exception as e:
        print(f'Error: find_dominate_color preprocessing went wrong, exception:{e}')
        return []
    
    # 計算顏色
    try:
        codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)
        vecs, dist = scipy.cluster.vq.vq(ar, codes)         # assign codes
        counts, bins = np.histogram(vecs, len(codes))    # count occurrences

        index_max = np.argmax(counts)                    # find most frequent
        peak = codes[index_max]
        colour = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
    except Exception as e:
        print(f'Error: find_dominate_color clustering went wrong, exception:{e}')
              
    # 顏色編碼
    for i in codes:
        hex_code = '#'+binascii.hexlify(bytearray(int(c) for c in i)).decode('ascii')
        
        #轉成英文
        color_name = get_color_name(hex_code)
        color_name_array.append(color_name)
        
        #轉成中文
        color_name_ch = translate_color(color_name)       
        color_name_array.append(color_name_ch)
        
        #轉換常見顏色
        color_name_common = get_common_color_name(color_name_ch)
        if color_name_common == "": #例外處理
            continue
        color_name_array.append(color_name_common)
        
    unique_color_name = set(color_name_array) #去掉重複的值
    return unique_color_name

def location_preprocess(objects):
    object_array = [] 
    obj_count = len(objects) #計算有幾個object
    for object_ in objects:
        object_dict = {}
        
        #取得物件和可信度
        name = object_.name
        score = object_.score
        
        #取得座標
        location = object_.bounding_poly.normalized_vertices
        location_array = [location[0].x, location[0].y , location[2].x, location[2].y]
        
        
        #回傳值處理
        object_dict['name'] = name
        object_dict['score'] = score
        object_dict['location'] = location_array
        
        object_array.append(object_dict)
    
    return object_array