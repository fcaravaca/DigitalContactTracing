import requests
import random
import uuid

def contact_tracing(transaction_id, auth_key, groups, LP_url):
    
    transaction_id = str(transaction_id) # Force string

    url = LP_url + '/contactTracingRequest'
    request_data = {
        "auth": auth_key,
        "transaction_ID": transaction_id,
        "groups": groups
    }


    print("Requested data:", request_data, "\n")
    response = requests.post(url, json = request_data)

    print("Response:", response.status_code, response.text)
    return response

def create_groups(infected_phones, non_infected_phones, max_group_size):

    # Need to check if an infected phone in the non infected array

    infected_phones_groups = [infected_phones[n:n+max_group_size] for n in range(0, len(infected_phones), max_group_size)]
    non_infected_phones_groups = [non_infected_phones[n:n+max_group_size] for n in range(0, len(non_infected_phones), max_group_size)]

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
        "infected_group_ids": infected_group_ids       
    }



if __name__ == "__main__":
    transaction_id = str(uuid.uuid4())
    auth_key_Location_provider = "location_key"
    infected_phones = ["+34 665 815 328","+34 625 939 653","+34 695 860 912"]
    non_infected_phones = ["+34 680 324 855","+34 611 215 353","+34 684 469 808","+34 636 098 607",
                           "+34 649 780 929","+34 690 057 633","+34 624 676 105","+34 663 410 563",
                           "+34 677 557 211","+34 634 539 405","+34 625 719 749","+34 656 429 322",
                           "+34 669 950 633","+34 697 772 263","+34 666 037 833","+34 663 235 390",
                           "+34 644 736 845","+34 686 931 289"]

    groups = create_groups(infected_phones, non_infected_phones, 3)

    print("Infected groups:", groups["infected_group_ids"])

    contact_tracing(transaction_id, auth_key_Location_provider, groups["all_groups"], "http://locationprovider2.com")