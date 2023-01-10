import requests
import random
import uuid
import base64
import encryptSignMessages
import json
import os

def contact_tracing(transaction_id, groups, LP, private_key, verifySLL):
    
    transaction_id = str(transaction_id) # Force string

    if not verifySLL:
        requests.urllib3.disable_warnings()

    url = LP["url"] + '/contactTracingRequest'
    request_data = {
        "transaction_ID": transaction_id,
        "groups": groups
    }
    request_data = base64.b64encode(json.dumps(request_data).encode()).decode("utf-8")
    signature = encryptSignMessages.get_signature(request_data, private_key)

    #print("Requested data:", request_data, "\n")
    response = requests.post(url, json = {"id": "HA", "info": (request_data), "signature": signature}, verify=verifySLL)
    #print(response)
    response_data = json.loads(response.text)
    
    if response.status_code != 200:
        print(response_data["error_message"])
        return None
        
    valid_signature = encryptSignMessages.check_signature(
        response_data["info"], 
        response_data["signature"],
        LP["public_key"]
    )   

    if valid_signature:
        #print("Response:", response_data["info"])
        return json.loads(base64.b64decode(response_data["info"]))
    else:
        return None

def fill_groups(phones, number_of_groups):
    groups = []
    for l in range(0,number_of_groups):
        groups.append([])
    amount = 0
    for phone in phones:
        if amount < 2*number_of_groups: # Minimun of 2 phones per group
            index = amount
            if index >= number_of_groups:
                index-=number_of_groups
        else: # Then assign the rest randomly
            index = random.randint(0, number_of_groups-1)
        groups[index].append(phone)
        amount += 1

    return groups

def reuse_prev_ids(non_infected_phones, infected_phones):

    prev = []
    if os.path.isfile("prev_reqs"):
        with open("prev_reqs", "r") as fh:
            try:
                v = fh.read().split(",")
                for i in range(len(v)):
                    v[i] = v[i].strip()
                prev = v
                print(prev)
            except:
                pass
    non_infected_phones = non_infected_phones + prev
    random.shuffle(non_infected_phones)

    all_phones = infected_phones + non_infected_phones
    sample_size = int(len(all_phones) * random.uniform(0.1, 0.3))
    random_sample = random.sample(all_phones, sample_size)

    with open("prev_reqs", "w") as fh:
        fh.write(str(random_sample).replace("[", "").replace("]", "").replace("'", ""))

    return non_infected_phones

def create_groups(infected_phones, non_infected_phones, number_of_groups, mode="L", reuse_groups=False):

    if reuse_groups:
        non_infected_phones = reuse_prev_ids(non_infected_phones, infected_phones) # Reuse IDs from previous transactions

    # Need to check if an infected phone in the non infected array
    new_non_infected_phones = []
    for item in non_infected_phones:
        if item not in infected_phones:
            new_non_infected_phones.append(item)
    non_infected_phones = new_non_infected_phones

    if mode == "L":
        L = number_of_groups
        group_size = len(infected_phones)/L
        K = int(len(non_infected_phones) / group_size) + L
    else:
        K = number_of_groups
        group_size = (len(infected_phones) + len(non_infected_phones)) / K
        L = int(len(infected_phones) / group_size)
        if L == 0: 
            L = 1

    infected_phones_groups = fill_groups(infected_phones, L)
    non_infected_phones_groups = fill_groups(non_infected_phones, K - L)

    all_groups = []
    infected_group_ids = []

    for group in (infected_phones_groups + non_infected_phones_groups):

        group_id = str(uuid.uuid4()) # Random ID
        if group in infected_phones_groups:
            infected_group_ids.append(group_id)

        all_groups.append(
            {
                "group_id": group_id, 
                "ids": group
            }
        )

    random.shuffle(all_groups)

    return {
        "all_groups": all_groups,
        "infected_group_ids": infected_group_ids,
        "K": K,
        "L": L
    }

import datetime


if __name__ == "__main__":
    import loadConfig

    transaction_id = str(uuid.uuid4())
    start_date = datetime.datetime.now()

    infected_phones = ["+34 665 815 328","+34 625 939 653","+34 695 860 912", "+34 680 324 855"]
    non_infected_phones = ["+34 680 324 855","+34 611 215 353","+34 684 469 808","+34 636 098 607",
                           "+34 649 780 929","+34 690 057 633","+34 624 676 105","+34 663 410 563",
                           "+34 677 557 211","+34 634 539 405","+34 625 719 749","+34 656 429 322",
                           "+34 669 950 633","+34 697 772 263","+34 666 037 833","+34 663 235 390",
                           "+34 644 736 845","+34 686 931 289"]

    groups = create_groups(infected_phones, non_infected_phones, 1, "L")
    LPs = loadConfig.fill_providers_info("location_providers")
    private_key = loadConfig.get_ha_private_key()
    print(contact_tracing(transaction_id, groups["all_groups"], LPs[0], private_key, False))
    print(groups["K"], groups["L"])