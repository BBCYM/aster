from owlready2 import *

file_path = "file: // ./ontology/owl/"


def get_location(location_tag):
    rtr = []
    province_list = ['市', '縣', '區']
    try:
        onto_location = get_ontology(
            file_path + "location.owl").load()  # 還沒處理file path variable

        """如果有市、縣、區等等，則去掉後再加入陣列"""
        def check_province(location_tag):
            return rtr.append(location_tag[0:-1]) if location_tag[-1] in province_list else None

        def locate_city(location_tag):
            dis = onto_location.District(location_tag)
            name = dis.district_is_in[0].name
            return name

        def locate_country(location_tag):
            cit = onto_location.City(location_tag)
            return cit.city_is_in[0].name

        def locate_area(location_tag):
            cit = onto_location.City(location_tag)
            return cit.city_in_area[0].name

        city = locate_city(location_tag)
        area = locate_area(locate_city(location_tag))
        country = locate_country(locate_city(location_tag))

        rtr = [city, area, country, location_tag]

        for i in range(len(rtr)):
            check_province(rtr[i])

    except IndexError as e:
        print('No result')
        return []

    except Exception as e:
        print(e)
        return []

    print('ontology location:', rtr)

    return rtr


# print('ontology location:', get_location('中壢'))
