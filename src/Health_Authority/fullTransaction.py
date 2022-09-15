import mobileIDsRequest
import contactTracingRequest
import requestKeysToITPA

import json
import uuid

from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64

useHttps = True
def load_env():
    global useHttps
    with open("https.env", "r", encoding="utf-16") as fh:
        content = fh.readline().split("\n")[0]
        useHttps = content == "true" or content == "" 
load_env()


IDPURL = ("https://" if useHttps else "http://") + "idprovider.com"
LP1URL = ("https://" if useHttps else "http://") + "locationprovider1.com"
LP2URL = ("https://" if useHttps else "http://") + "locationprovider2.com"
LP3URL = ("https://" if useHttps else "http://") + "locationprovider3.com"
ITPAURL = ("https://" if useHttps else "http://") + "itpa.com"

def process_requests(keys, contact_tr_reply):
    id_list = []
    for group in keys["keys"]:
        print("-"*40,"\n", sep=""),
        encrypt_data = None
        for encrypt_group in contact_tr_reply["groups"]:
            if group["group_id"] == encrypt_group["group_id"]:
                encrypt_data = encrypt_group["contact_ids"]

        print("Encrypted data:", encrypt_data, "\n( Group:", group["group_id"], ")")

        base64_bytes = encrypt_data.encode('ascii')
        message_bytes = base64.b64decode(base64_bytes)

        print("Key:", group["aes_key"], "| IV:", group["iv"],"\n")

        cipher = AES.new(bytes.fromhex(group["aes_key"]), AES.MODE_CBC, bytes.fromhex(group["iv"]))
        pt = unpad(cipher.decrypt(message_bytes),AES.block_size) # The unpad is necessary
        decoded_message = pt.decode("utf-8")
        
        print("Decrypted data: ", decoded_message)
        decoded_message = decoded_message.replace('"','') # Remove unnecessary "
        group_phone_list = decoded_message.split("[")[1].split("]")[0].split(",") # Remove brackets and split by commas
    
        id_list += group_phone_list
    return id_list

if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    infected_phones = ["299", "298"]

    max_group_size = 4

    print("\nGenerated Transaction ID:", transaction_id)
    print("Infected IDs:", infected_phones, "\n")
    
    print("-"*40)
    print("Requesting Mobile IDs")
    print("-"*40)
    non_infected_phones = mobileIDsRequest.mobile_id_request(1100*len(infected_phones), transaction_id, IDPURL, False)

    print("-"*40)
    print("Requesting Contact traicing IDs")
    print("-"*40)
    groups = contactTracingRequest.create_groups(infected_phones, non_infected_phones["ids"], max_group_size)

    print("Infected groups:", groups["infected_group_ids"])

    contact_tr_reply1 = contactTracingRequest.contact_tracing(
        transaction_id, groups["all_groups"], LP1URL, "../../DevelopmentTestKeys/LP1_public.pem", False
    )

    contact_tr_reply2 = contactTracingRequest.contact_tracing(
        transaction_id, groups["all_groups"], LP2URL, "../../DevelopmentTestKeys/LP2_public.pem", False
    )

    contact_tr_reply3 = contactTracingRequest.contact_tracing(
        transaction_id, groups["all_groups"], LP3URL, "../../DevelopmentTestKeys/LP3_public.pem", False
    )

    print("-"*40)
    print("Requesting Keys")
    print("-"*40)

    keys1 = requestKeysToITPA.key_request_ha_itpa(
        transaction_id, len(groups["all_groups"]), groups["infected_group_ids"], "LP1", ITPAURL, False
    )

    keys2 = requestKeysToITPA.key_request_ha_itpa(
        transaction_id, len(groups["all_groups"]), groups["infected_group_ids"], "LP2", ITPAURL, False
    )

    keys3 = requestKeysToITPA.key_request_ha_itpa(
        transaction_id, len(groups["all_groups"]), groups["infected_group_ids"], "LP3", ITPAURL, False
    )

    print("-"*40)
    print("Decryption")

    id_list = process_requests(keys1, contact_tr_reply1)
    id_list = id_list + process_requests(keys2, contact_tr_reply2)
    id_list = id_list + process_requests(keys3, contact_tr_reply3)
        
    print("-"*40)
    print("IDs to notify")
    print("-"*40)
    
    result = list()
    for i in id_list: 
        if i not in result: 
            result.append(i) 
    

    print(len(result), "contacts: ", result)
    print("-"*40)

