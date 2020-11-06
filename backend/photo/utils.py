def getEmotionString(k):
    emotion = ['讚','喜歡','開心','驚訝','難過','憤怒']
    emotion_en = ['thumbs-up','like','happy','surprise','sad','angry']
    if k==-1:
        return ''
    else:
        return emotion[k], emotion_en[k]

def EmotionStringtoI(k):
    emotion = ['讚','喜歡','開心','驚訝','難過','憤怒']
    emotion_en = ['thumbs-up','like','happy','surprise','sad','angry']
    try:
        return emotion.index(k)
    except Exception:
        return -1


