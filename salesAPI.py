import requests

query = {'access_token':"4DuGUsQ_Jx6kE407r_MROiJrAc325nGMxZmf1UqHe1s"}

response = requests.get("https://api.gumroad.com/v2/products", params=query)
# print(response.json())

for entry in response.json()['products']:
    # print(entry)
    print(entry['name'],":",entry['sales_count'])
    print()