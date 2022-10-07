import requests
import encryptSignMessages
import json 
import base64
def key_request_ha_itpa(transaction_id, num_groups, infected_groups, LP_ID, ITPA, private_key, verifySLL):
    
    if not verifySLL:
        requests.urllib3.disable_warnings()

    transaction_id = str(transaction_id) # Force string

    url = ITPA["url"] + '/keysRequest'
    request_data = {
        "transaction_ID": transaction_id,
        "total_groups": num_groups,
        "infected_groups": infected_groups,
        "LP_ID": LP_ID
    }
    request_data = base64.b64encode(json.dumps(request_data).encode()).decode("utf-8")
    #print("Requested data:", request_data, "\n")
    signature = encryptSignMessages.get_signature(request_data, private_key)
    
    response = requests.post(url, json = {"id": "HA", "info": (request_data), "signature": signature}, verify=verifySLL)
    response_data = json.loads(response.text)

    if response.status_code != 200:
        print(response_data["error_message"])
        return None

    valid_signature = encryptSignMessages.check_signature(
        response_data["info"], 
        response_data["signature"],
        ITPA["public_key"]
    )   
    if valid_signature:
        #print("Response:", response_data["info"])
        return json.loads(base64.b64decode(response_data["info"]))
    else:
        return None



if __name__ == "__main__":
    import loadConfig

    transaction_id = "d77db212-1757-47c8-80a5-724780e8c584"
    num_groups = 7
    infected_groups = ["b6db67d8-2b29-4654-8f03-bf41658a1838"]
    
    ITPAs = loadConfig.fill_providers_info("itp_authorities")
    LPs = loadConfig.fill_providers_info("location_providers")

    private_key = loadConfig.get_ha_private_key()

    print(
        key_request_ha_itpa(transaction_id, num_groups, infected_groups, LPs[0]["id"], ITPAs[0], private_key, False)
    )