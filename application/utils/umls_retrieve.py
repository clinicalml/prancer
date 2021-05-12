#################################################################################################
# source: https://github.com/HHS/uts-rest-api/blob/master/samples/python/retrieve-cui-or-code.py
# TODO: get API key from user's UMLS profile?
#################################################################################################


import requests
import json
import urllib

from .umls_authentication import *
from .constants import *


sources_text = open(SOURCES_FILE, 'r').read()
sources_set = set(sources_text.split(','))
AuthClient = Authentication(UMLS_APIKEY)


###################################
#get TGT for our session
###################################


def get_tgt():
    tgt = AuthClient.gettgt()
    return tgt


def retrieve_cui_info(cui):
    content_endpoint = "/rest/content/current/CUI/"+str(cui)+"/definitions"
    tgt = get_tgt()
    query = {'ticket':AuthClient.getst(tgt), 'sabs':sources_text}
    r = requests.get(UMLS_URI + content_endpoint, params=query)
    r.encoding = 'utf-8'
    try:
        items = json.loads(r.text)
        jsonData = items["result"]
        filteredData = []
        for r in jsonData:
            if r['rootSource'] in sources_set:
                filteredData.append(r)
        return filteredData
    except json.decoder.JSONDecodeError:
        print("No definitions found")
        return []


def retrieve_labels(keyword):
    content_endpoint = "/rest/search/current"
    tgt = get_tgt()
    query = {
        'ticket': AuthClient.getst(tgt),
        'string': keyword,
        'sabs': 'SNOMEDCT_US'
    }
    r = requests.get(UMLS_URI + content_endpoint, params=query)
    r.encoding = 'utf-8'
    try:
        items = json.loads(r.text)
        if 'result' in items:
            jsonData = items['result']
            if 'results' in jsonData:
                return jsonData['results']
        else:
            return []
    except json.decoder.JSONDecodeError:
        print("No definitions found")
        return []
