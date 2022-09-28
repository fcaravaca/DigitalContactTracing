import requests
import uuid

import encryptSignMessages
import json 
import base64

def mobile_id_request(n, transaction_id, id_provider_url, verifySLL):
    
    if not verifySLL:
        requests.urllib3.disable_warnings()

    transaction_id = str(transaction_id) # Force string

    url = id_provider_url + '/mobileIDs'
    request_data = {
        "transaction_ID": transaction_id,
        "amount": n
    }
    request_data = base64.b64encode(json.dumps(request_data).encode()).decode("utf-8")
    #print("Requested data:", request_data, "\n")
    signature = encryptSignMessages.get_signature(request_data, "../../DevelopmentTestKeys/HA.pem")
    
    response = requests.post(url, json = {"id": "HA", "info": (request_data), "signature": signature}, verify=verifySLL)
    response_data = json.loads(response.text)

    valid_signature = encryptSignMessages.check_signature(
        response_data["info"], 
        response_data["signature"],
        "../../DevelopmentTestKeys/IDP_public.pem"
    ) 

    if valid_signature:
        #print("Response:", response_data["info"])
        return json.loads(base64.b64decode(response_data["info"]))
    else:
        return None


if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    auth_key_ID_provider = "key"

    print(mobile_id_request(6, transaction_id, "http://idprovider.com", False))