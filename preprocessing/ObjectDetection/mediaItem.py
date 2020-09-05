from pprint import pprint
from init_google_service import service
import pandas as pd
import logging
import os
import requests

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level='NOTSET', filename='myLog.log',
                    filemode='w', format=FORMAT)

"""
list method
"""


def list_media():
    try:
        response = service.mediaItems().list(pageSize=25).execute()

        lst_medias = response.get('mediaItems')
        nextPageToken = response.get('nextPageToken')

        # while nextPageToken:
        #     response = service.mediaItems().list(
        #         pageSize=25,
        #         pageToken=nextPageToken
        #     ).execute()

        #     lst_medias.extend(response.get('mediaItems'))
        #     nextPageToken = response.get('nextPageToken')

        df_media_items = pd.DataFrame(lst_medias)

        logging.debug('finish list method')
        logging.debug(df_media_items)

        return df_media_items

    except Exception as e:
        print(e)
        logging.error(e, exc_info=True)


"""
get method
"""


def get_media(df_media_items):

    try:
        media_id = df_media_items['id'][0]
        mimeType = df_media_items['mimeType'][0].split('/')[0]

        response = service.mediaItems().get(mediaItemId=media_id).execute()

        print(f'type: {type(media_id)}')
        print(f'type: {type(mimeType)}')
        logging.debug(response)
        logging.debug(mimeType)
        logging.debug('finish get method')

        return response, mimeType
    except Exception as e:
        print(e)
        logging.error(e, exc_info=True)


def save_media(df_media, mimeType):
    try:
        if mimeType == 'image':
            # get the image data
            filename = mediaItem['filename']
            res = session.get(mediaItem['baseUrl']+'=d').content
            print(f'{filename} downloaded')
            with open(f'{userId}/{filename}', mode='wb') as handler:
                handler.write(res)
    except Exception as e:
        print(e)
        logging.error(e, exc_info=True)


def download_file(media, mimeType, file_name: str = 'default_filename'):
    try:
        if not os.path.isdir('ImageFile'):
            try:
                os.mkdir("ImageFile")
            except OSError:
                print("Creation of the directory failed")

        if mimeType == 'image':
            url = media['baseUrl'] + '=d'
            response = requests.get(url)
            if response.status_code == 200:
                print('Downloading file {0}'.format(file_name))
                with open(f'ImageFile/{file_name}', 'wb') as f:
                    f.write(response.content)
                    f.close()
        else:
            logging.error('download media is not IMAGE', exc_info=True)
    except Exception as e:
        print(e)
        logging.error(e, exc_info=True)


if __name__ == "__main__":

    df_media = list_media()
    media, mimeType = get_media(df_media)
    print(media)
    download_file(media, mimeType)
    # save_media(media, mimeType)

    # """
    # batchGet method
    # """
    # try:
    #     media_ids = df_media_items['id'][0:3].to_list()
    #     response = service.mediaItems().batchGet(mediaItemIds=media_ids).execute()
    #     print(pd.DataFrame(response.get('mediaItemResults'))
    #           ['mediaItem'].apply(pd.Series))
    #     logging.info(response.get('mediaItemResults'))
    #     logging.debug('finish batchget method')
    # except Exception as e:
    #     type(e)
    #     print(f'batchget: {e}')
    #     logging.error(e)

    # """
    # search method (by album id)
    # """
    # try:
    #     response_albums_list = service.albums().list().execute()
    #     albums_list = response_albums_list.get('albums')

    #     album_id = next(
    #         filter(lambda x: "Google Product Icons" in x['title'], albums_list))['id']

    #     request_body = {
    #         'albumId': album_id,
    #         'pageSize': 25
    #     }

    #     response_search = service.mediaItems().search(body=request_body).execute()

    #     lstMediaItems = response_search.get('mediaItems')
    #     nextPageToken = response_search.get('nextPageToken')

    #     while nextPageToken:
    #         request_body['pageToken'] = nextPageToken

    #         response_search = service.mediaItems().search(body=request_body).execute()
    #         lstMediaItems.extend(response_search.get('mediaItems'))
    #         nextPageToken = response_search.get('nextPageToken')

    #     df_search_result = pd.DataFrame(lstMediaItems)
    # except Exception as e:
    #     print(e)
    #     logging.error(e)

    # def response_media_items_by_filter(request_body: dict):
    #     try:
    #         response_search = service.mediaItems().search(body=request_body).execute()
    #         lstMediaItems = response_search.get('mediaItems')
    #         nextPageToken = response_search.get('nextPageToken')

    #         while nextPageToken:
    #             request_body['pageToken'] = nextPageToken
    #             response_search = service.mediaItems().search(body=request_body).execute()

    #             if not response_search.get('mediaItem') is None:
    #                 lstMediaItems.extend(response_search.get('mediaItems'))
    #                 nextPageToken = response_search.get('nextPageToken')
    #             else:
    #                 nextPageToken = ''
    #         return lstMediaItems
    #     except Exception as e:
    #         print(e)
    #         return None

    # """
    # search method (by date)
    # """
    # request_body = {
    #     'pageSize': 100,
    #     'filters': {
    #         'dateFilter': {
    #             # 'ranges': [
    #             #     {
    #             #         'startDate': {
    #             #             'year': 2019,
    #             #             'month': 1,
    #             #             'day': 1
    #             #         },
    #             #         'endDate': {
    #             #             'year': 2019,
    #             #             'month': 12,
    #             #             'day': 31
    #             #         }
    #             #     }
    #             # ]
    #             'dates': [
    #                 {
    #                     'year': 2019,
    #                     'month': 12,
    #                     'day': 23
    #                 },
    #                 {
    #                     'year': 2019,
    #                     'month': 11,
    #                     'day': 19
    #                 },
    #                 {
    #                     'year': 2019,
    #                     'month': 11,
    #                     'day': 20
    #                 }
    #             ]
    #         }
    #     }
    # }

    # df_search_result = pd.DataFrame(response_media_items_by_filter(request_body))

    # """
    # search method (content filter)
    # """
    # request_body = {
    #     'pageSize': 100,
    #     'filters': {
    #         'contentFilter': {
    #             'includedContentCategories': [
    #                 'LANDMARKS', 'GARDENS'
    #             ],
    #             'excludedContentCategories': [
    #                 'SPORT', 'ANIMALS'
    #             ]
    #         }
    #     }
    # }

    # df_search_result = pd.DataFrame(response_media_items_by_filter(request_body))

    # """
    # search method (media type)
    # """
    # request_body = {
    #     'pageSize': 100,
    #     'filters': {
    #         'mediaTypeFilter': {
    #             'mediaTypes': ['VIDEO']
    #         }
    #     }
    # }

    # df_search_result = pd.DataFrame(response_media_items_by_filter(request_body))

    # """
    # search method (feature filter)
    # """
    # request_body = {
    #     'pageSize': 100,
    #     'filters': {
    #         'featureFilter': {
    #             'includedFeatures': ['FAVORITES']
    #         }
    #     }
    # }

    # df_search_result = pd.DataFrame(response_media_items_by_filter(request_body))

    # """
    # search method (includedArchiveMedia, excludedAppCreatedData)
    # """
    # request_body = {
    #     'pageSize': 100,
    #     'filters': {
    #         'includeArchivedMedia': True,
    #         'excludeNonAppCreatedData': False
    #     }
    # }
    # df_search_result = pd.DataFrame(response_media_items_by_filter(request_body))
