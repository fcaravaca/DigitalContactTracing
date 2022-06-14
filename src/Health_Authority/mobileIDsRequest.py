import requests
import uuid

import encryptSignMessages
import json 

def mobile_id_request(n, transaction_id, auth_key, id_provider_url):
    
    transaction_id = str(transaction_id) # Force string

    url = id_provider_url + '/mobileIDs'
    request_data = {
        "auth": auth_key,
        "transaction_ID": transaction_id,
        "amount": n
    }

    print("Requested data:", request_data, "\n")
    encryptedData, signature = encryptSignMessages.get_ciphertext_and_signature(request_data, "../../DevelopmentTestKeys/HA.pem", "../../DevelopmentTestKeys/IDP_public.pem")
    
    response = requests.post(url, json = {"id": "HA", "encryptedData": encryptedData, "signature": signature})
    encrypted_response = json.loads(response.text)

    decypted_response = encryptSignMessages.get_text_from_ciphertext_and_signature(
        encrypted_response["encryptedData"], 
        encrypted_response["signature"],
         "../../DevelopmentTestKeys/HA.pem",
        "../../DevelopmentTestKeys/IDP_public.pem"
    )


    print("Response:", decypted_response)
    return decypted_response



if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    auth_key_ID_provider = "key"

    mobile_id_request(6, transaction_id, auth_key_ID_provider, "http://idprovider.com")