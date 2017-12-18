import requests, json

data = requests.get('https://firebasestorage.googleapis.com/v0/b/actuario-564a6.appspot.com/o/factorio-data%2Fv0_15_34.json.gz?alt=media&token=b6004eb3-c4b5-4cd7-9bab-deade2929d21').json()

categories = { r['category'] for (rn, r) in data['recipes'].items() }
print(categories)


