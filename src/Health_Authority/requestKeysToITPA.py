import requests
import uuid

def key_request_ha_itpa(transaction_id, auth_key, num_groups, infected_groups, LP_url, ITPA_url):
    
    transaction_id = str(transaction_id) # Force string

    url = ITPA_url + '/keysRequest'
    request_data = {
        "auth": auth_key,
        "transaction_ID": transaction_id,
        "total_groups": num_groups,
        "infected_groups": infected_groups,
        "LP_url": LP_url
    }

    print("Requested data:", request_data, "\n")
    response = requests.post(url, json = request_data)

    print("Response:", response.status_code, response.text)
    return response



if __name__ == "__main__":
    transaction_id = "cbab3e2a-fff4-4c06-b7da-9fab34254e9e"
    auth_key_ID_provider = "key_itpa"
    num_groups = 7
    infected_groups = ["7e0bc17d-1ce6-4724-a5ea-618284fbbb9d"]

    key_request_ha_itpa(transaction_id, auth_key_ID_provider, num_groups, infected_groups, "http://locationprovider2.com", "http://itpa.com")