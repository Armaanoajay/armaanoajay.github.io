# fetch_citations.py
# Server-side Google Scholar scraper (lightweight). Runs in GitHub Actions runner.
# NOTE: scraping HTML can break if Google changes the page structure.
# Use responsibly and infrequently (we run every 12 hours here).

import json
import time
import requests
from bs4 import BeautifulSoup

USER_ID = "hX4OlS0AAAAJ"
URL = f"https://scholar.google.com/citations?user={USER_ID}&hl=en"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/117.0 Safari/537.36"
}

def fetch_profile_html(url):
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.text

def parse_citations_per_year(html_text):
    soup = BeautifulSoup(html_text, "html.parser")
    # Google Scholar structure: years are in #gsc_g_x .gsc_g_t and counts in .gsc_g_al
    years_elems = soup.select("#gsc_g_x .gsc_g_t")
    cites_elems = soup.select("#gsc_g_x .gsc_g_al")

    result = {}
    for y_el, c_el in zip(years_elems, cites_elems):
        try:
            year = y_el.get_text(strip=True)
            count_text = c_el.get_text(strip=True).replace(',', '')
            count = int(count_text) if count_text.isdigit() else 0
            result[year] = count
        except Exception:
            continue
    return result

def main():
    try:
        html = fetch_profile_html(URL)
        per_year = parse_citations_per_year(html)
        output = {"cited_by_year": per_year}
        with open("citations.json", "w", encoding="utf-8") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print("Saved citations.json with", len(per_year), "years.")
    except Exception as e:
        print("Error:", e)
        # write empty file if failed to avoid breaking fetch
        with open("citations.json", "w", encoding="utf-8") as f:
            json.dump({}, f)
        raise

if __name__ == "__main__":
    main()
