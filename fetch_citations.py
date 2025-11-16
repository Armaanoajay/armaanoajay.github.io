import json
from scholarly import scholarly

def fetch_data(scholar_id):
    author = scholarly.search_author_id(scholar_id)
    author = scholarly.fill(author, sections=['indices', 'citedby_year'])

    data = {
        'cited_by_year': author.get('citedby_year', {})
    }
    return data

def main():
    scholar_id = "hX4OlS0AAAAJ"
    data = fetch_data(scholar_id)
    
    with open("citations.json", "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    main()
