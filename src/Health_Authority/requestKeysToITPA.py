import requests
import encryptSignMessages
import json 

def key_request_ha_itpa(transaction_id, num_groups, infected_groups, LP_ID, ITPA_url):
    
    transaction_id = str(transaction_id) # Force string

    url = ITPA_url + '/keysRequest'
    request_data = {
        "transaction_ID": transaction_id,
        "total_groups": num_groups,
        "infected_groups": infected_groups,
        "LP_ID": LP_ID
    }

    print("Requested data:", request_data, "\n")
    signature = encryptSignMessages.get_signature(request_data, "../../DevelopmentTestKeys/HA.pem")
    
    response = requests.post(url, json = {"id": "HA", "info": (request_data), "signature": signature})
    response_data = json.loads(response.text)

    valid_signature = encryptSignMessages.check_signature(
        response_data["info"], 
        response_data["signature"],
        "../../DevelopmentTestKeys/ITPA_public.pem"
    )   
    if valid_signature:
        print("Response:", response_data["info"])
        return response_data["info"]
    else:
        return None



if __name__ == "__main__":
    transaction_id = "a6fce1b6-e91e-46f6-a7c6-1eb5e50f796b"
    num_groups = 7
    infected_groups = ["eb346f68-d94c-4d8b-9b67-e644d71484b9"]

    key_request_ha_itpa(transaction_id, num_groups, infected_groups, "LP_1", "http://itpa.com")