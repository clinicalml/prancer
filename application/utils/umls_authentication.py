#!/usr/bin/python
## Source: https://github.com/HHS/uts-rest-api/blob/master/samples/python/Authentication.py

import requests
import lxml.html as lh
from lxml.html import fromstring

uri="https://utslogin.nlm.nih.gov"
auth_endpoint = "/cas/v1/api-key"

class Authentication:

   def __init__(self, apikey):
    self.apikey=apikey
    self.service="http://umlsks.nlm.nih.gov"

   def gettgt(self):
     params = {'apikey': self.apikey}
     h = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain", "User-Agent":"python" }
     r = requests.post(uri+auth_endpoint,data=params,headers=h)
     response = fromstring(r.text)
     ## extract the entire URL needed from the HTML form (action attribute) returned - looks similar to https://utslogin.nlm.nih.gov/cas/v1/tickets/TGT-36471-aYqNLN2rFIJPXKzxwdTNC5ZT7z3B3cTAKfSc5ndHQcUxeaDOLN-cas
     ## we make a POST call to this URL in the getst method
     tgt = response.xpath('//form/@action')[0]
     return tgt

   def getst(self,tgt):
     params = {'service': self.service}
     h = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain", "User-Agent":"python" }
     r = requests.post(tgt,data=params,headers=h)
     st = r.text
     return st
