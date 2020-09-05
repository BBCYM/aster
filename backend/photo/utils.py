def getEmotionString(k):
    emotion = ['讚','喜歡','開心','驚訝','難過','憤怒']
    if k==-1:
        return ''
    else:
        return emotion[k]
def EmotionStringtoI(k):
    emotion = ['讚','喜歡','開心','驚訝','難過','憤怒']
    try:
        emotion.index(k)
        return emotion.index(k)
    except Exception:
        return -1