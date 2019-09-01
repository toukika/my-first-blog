from lxml import html  
import csv,os,json
import requests
import re
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
#from exceptions import ValueError
from time import sleep
from bs4 import BeautifulSoup

def NameParser(url):
    driver = webdriver.Chrome()
    driver.get(url)
    #a-autoid-14 > span > i > span
    #a-autoid-14 > span > i
    #a-autoid-14
    #desktop-dp-sims_purchase-similarities-sims-feature > div > div.a-row.a-carousel-controls.a-carousel-row.a-carousel-has-buttons > div > div.a-carousel-col.a-carousel-right
    #desktop-dp-sims_purchase-similarities-sims-feature > div > div.a-row.a-carousel-controls.a-carousel-row.a-carousel-has-buttons > div > div.a-carousel-col.a-carousel-left#a-autoid-13 > span > i
    #desktop-dp-sims_purchase-similarities-sims-feature > div

    driver.find_elements_by_xpath('//*[@id="a-autoid-13"]')[0].click()
    time.sleep(5)
    #js = "var oBtn=document.getElementsByTagName('a-icon-alt')[0];"
    #js = "var oBtn=document.getElementsByTagName('a-carousel-col')[0];"
    #driver.execute_script(js)

    
    getId = driver.find_element(by=By.ID,value="anonCarousel2")
    getXpath = driver.find_elements_by_xpath("//*[@id="anonCarousel2"]/ol/li[1]/div/div[1]/a")



def AmzonParser(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}
    page = requests.get(url,headers=headers)
    while True:
        sleep(3)
        try:
            doc = html.fromstring(page.content)
            XPATH_NAME = ".//div[@id='anonCarousel2']//os[@class='a-carousel']//li[contains(@class,'a-carousel-card')]//div[contains(@class,'a-section')]//div[contains(@class,'a-row')]//a[contains(@class,'a-link-child')]"
            
            RAW_NAME = doc.xpath(XPATH_NAME)       
 
            NAME = ' '.join(''.join(RAW_NAME).split()) if RAW_NAME else None
 
            #if page.status_code!=200:
                #raise ValueError('captha')
            data = {
                    'NAME':NAME,
                    'URL':url,
                    }
 
            return data
        except Exception as e:
            print (e)
 
def ReadAsin():
    searchurl="https://www.amazon.co.jp/s?k=%E3%81%82%E3%81%84%E3%81%BF%E3%82%87%E3%82%93" 
    headers = {'User-Agent': 'Mozilla/5.0'}
    page = requests.get(searchurl,headers=headers)
    soup = BeautifulSoup(page.content,"html.parser")
    #links = soup.find_all('a',href=True)
    allAClass = soup.find_all('a',class_=re.compile(r'a-text-bold'))

    #fetch("https://www.amazon.co.jp/s?k=%E3%81%82%E3%81%84%E3%81%BF%E3%82%87%E3%82%93")
    #response.xpath("//div[@class='sg-col-inner']")
    #products = response.xpath("//div[@class='sg-col-inner']")
    for link in allAClass:
        #print eachPart.get_text()
        links = []
        hrefString = link.string
        if "Blu-ray" in hrefString or "CD" in hrefString or "DVD" in hrefString:
            href = link['href']
            links.append(href)

            for delink in links:
                searchASIN = re.search(r'B[A-Z0-9]{9}', delink)
                #print(searchASIN.group(0))
                AsinList = []
                AsinList.append(searchASIN.group(0))
                extracted_data = []

                for i in AsinList:
                    url = "https://www.amazon.co.jp/dp/"+i
                    print ("Processing:"+url)
                    extracted_data.append(AmzonParser(url))
                    sleep(5)
                f=open('data.json','w')
                json.dump(extracted_data,f,indent=4)
 
 
if __name__ == "__main__":
    ReadAsin()
