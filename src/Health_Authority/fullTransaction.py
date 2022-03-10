import mobileIDsRequest
import contactTracingRequest
import requestKeysToITPA

import json
import uuid

from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64


if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    infected_phones = ["+34 665 815 328","+34 625 939 653","+34 695 860 912","+34 649 069 543",
                       "+34 635 870 176","+34 603 184 059","+34 696 154 033","+34 610 367 133"]

    auth_key_ID_provider = "key"
    auth_key_Location_provider = "location_key"
    auth_key_ITPA_provider = "key_itpa"
    max_group_size = 4

    print("\nGenerated Transaction ID:", transaction_id)
    print("Infected IDs:", infected_phones, "\n")
    
    print("-"*40)
    print("Requesting Mobile IDs")
    print("-"*40)
    non_infected_phones = json.loads(mobileIDsRequest.mobile_id_request(11*len(infected_phones), transaction_id, auth_key_ID_provider).text)

    print("-"*40)
    print("Requesting Contact traicing IDs")
    print("-"*40)
    groups = contactTracingRequest.create_groups(infected_phones, non_infected_phones["ids"], max_group_size)

    print("Infected groups:", groups["infected_group_ids"])
    contact_tr_reply = json.loads(contactTracingRequest.contact_tracing(transaction_id, auth_key_Location_provider, groups["all_groups"]).text)

    print("-"*40)
    print("Requesting Keys")
    print("-"*40)

    keys = json.loads(requestKeysToITPA.key_request_ha_itpa(transaction_id, auth_key_ITPA_provider, len(groups["all_groups"]), groups["infected_group_ids"]).text)

    print("-"*40)
    print("Decryption")

    id_list = []

    for group in keys["keys"]:
        print("-"*40,"\n", sep=""),
        encrypt_data = None
        for encrypt_group in contact_tr_reply["groups"]:
            if group["group_id"] == encrypt_group["group_id"]:
                encrypt_data = encrypt_group["contact_ids"]

        print("Encrypted data:", encrypt_data, "\n")

        base64_bytes = encrypt_data.encode('ascii')
        message_bytes = base64.b64decode(base64_bytes)

        print("Key:", group["aes_key"], "| IV:", group["iv"],"\n")
        

        cipher = AES.new(bytes(group["aes_key"], "utf-8"), AES.MODE_CBC, bytes(group["iv"], "utf-8"))
        pt = unpad(cipher.decrypt(message_bytes),AES.block_size) # The unpad is necessary
        decoded_message = pt.decode("utf-8")
        
        print("Decrypted data: ", decoded_message)
        decoded_message = decoded_message.replace('"','') # Remove unnecessary "
        group_phone_list = decoded_message.split("[")[1].split("]")[0].split(",") # Remove brackets and split by commas
    
        id_list += group_phone_list


        
        
    print("-"*40)
    print("IDs to notify")
    print("-"*40)
    
    result = [] 
    for i in id_list: 
        if i not in result: 
            result.append(i) 
    
    for id in result: 
        print(id)
    print("-"*40)


