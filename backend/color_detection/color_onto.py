from owlready2 import *

onto_color = get_ontology("file://./ontology/owl/color.owl").load()

def get_common_color_name(color_name):
    try:
        spe = onto_color.SpecificColor(color_name)
        com_color = spe.specific_in_common[0].name
        return com_color
    except Exception as e:
        return ""
