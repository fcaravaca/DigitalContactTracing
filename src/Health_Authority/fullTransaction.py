import mobileIDsRequest
import contactTracingRequest
import requestKeysToITPA

import json
import uuid

if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    infected_phones = ["+34 665 815 328","+34 625 939 653","+34 695 860 912"]

    auth_key_ID_provider = "key"
    auth_key_Location_provider = "location_key"
    auth_key_ITPA_provider = "key_itpa"

    print("-"*40)
    print("Requesting Mobile IDs")
    print("-"*40)
    non_infected_phones = json.loads(mobileIDsRequest.mobile_id_request(6, transaction_id, auth_key_ID_provider).text)

    print("-"*40)
    print("Requesting Contact traicing IDs")
    print("-"*40)
    groups = contactTracingRequest.create_groups(infected_phones, non_infected_phones["ids"], 3)

    print("Infected groups:", groups["infected_group_ids"])
    contact_tr_reply = contactTracingRequest.contact_tracing(transaction_id, auth_key_Location_provider, groups["all_groups"]).text



    print("-"*40)
    print("Requesting Keys")
    print("-"*40)

    requestKeysToITPA.key_request_ha_itpa(transaction_id, auth_key_ITPA_provider, len(groups["all_groups"]), groups["infected_group_ids"])
