import requests
import uuid

def mobile_id_request(n, transaction_id, auth_key):
    
    transaction_id = str(transaction_id) # Force string

    url = 'http://localhost:3000/mobileIDs'
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
    transaction_id = uuid.uuid4()
    auth_key_ID_provider = "key"

    mobile_id_request(6, transaction_id.int, auth_key_ID_provider)