import requests
import uuid

def mobile_id_request(n, transaction_id, auth_key, id_provider_url):
    
    transaction_id = str(transaction_id) # Force string

    url = id_provider_url + '/mobileIDs'
    request_data = {
        "auth": auth_key,
        "transaction_ID": transaction_id,
        "amount": n
    }

    print("Requested data:", request_data, "\n")
    response = requests.post(url, json = request_data)

    print("Response:", response.status_code, response.text)
    return response



if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    auth_key_ID_provider = "key"

    mobile_id_request(6, transaction_id, auth_key_ID_provider, "http://idprovider.com")