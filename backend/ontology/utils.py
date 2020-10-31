import requests
import os
def reverse_geocoding(lat, lng, language, api_key):
    res = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={api_key}&language={language}').json()
    data = res['results'][0]['address_components']
    toSave = []
    for d in data:
        toSave.extend((d['long_name'],d['short_name']))
    return list(set(toSave))