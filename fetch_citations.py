import requests
from bs4 import BeautifulSoup
import json


USER_ID = "hX4OlS0AAAAJ" # your scholar ID
URL = f"https://scholar.google.com/citations?user={USER_ID}&hl=en"


html = requests.get(URL).text
soup = BeautifulSoup(html, "html.parser")


years = soup.select("#gsc_g_x .gsc_g_t")
cites = soup.select("#gsc_g_x .gsc_g_al")


citations = {}
for y, c in zip(years, cites):
citations[y.text] = int(c.text)


with open("citations.json", "w") as f:
json.dump(citations, f, indent=4)
