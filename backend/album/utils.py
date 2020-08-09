def batchAddMediaItems(userSession, albumId, photoIds):
    # 把相簿上傳雲端
    print(albumId)
    print(photoIds)
    # 要加一個IF判斷是否大於50，每50張發一次request

    request_body = {
        'mediaItemIds': photoIds
    }

    albumRes = userSession.post(
        f'https://photoslibrary.googleapis.com/v1/albums/{albumId}:batchAddMediaItems', json=request_body).json()

    if albumRes:
        print(albumRes)
