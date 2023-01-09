import csv
import datetime
import fullTransaction
import os

results_file = 'execution_results.csv'

def time_execution(infected_phones, mode, number_of_groups, number_non_infected_per_infected):
    start_date = datetime.datetime.now()
    params = fullTransaction.transaction(infected_phones, number_non_infected_per_infected, number_of_groups, mode=mode, allowPrint=False)

    execution_time = str(datetime.datetime.now() - start_date)
    save_execution_result(len(infected_phones), number_non_infected_per_infected,params["K"], params["L"], execution_time)

    return execution_time

def save_execution_result(infected_phones_len, number_non_infected_per_infected, K, L, execution_time):

    if not os.path.exists(results_file):
        with open(results_file, "w", encoding="UTF8", newline='') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(["number_infected_phones", "number_non_infected_per_infected", "K", "L", "execution_time"])

    with open(results_file, "a+", encoding="UTF8", newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow([infected_phones_len, number_non_infected_per_infected, K, L, execution_time])
        


if __name__ == "__main__":

    infected_phones = ["+34 600 200 201", "+34 600 200 202", "+34 600 200 203", 
    "+34 600 200 204", "+34 600 200 205", "+34 600 200 206", "+34 600 200 207", 
    "+34 600 200 208", "+34 600 200 209", "+34 600 200 210"] 
    max_group_size = 25
    number_non_infected_per_infected = 15


    while True:
        results_file = "MprogressionNSettingKReal.csv"
        for j in [50]:
            for i in range(9010, 10012, 500):
                time = time_execution(infected_phones * i, "K", int(len(infected_phones) * i/25), j)
                print(time)
        continue
        results_file = "MprogressionNConstantReal.csv"
        for j in [20]:
            for i in range(10, 6012, 250):
                time = time_execution(infected_phones * i, "L", 10, j)
                print(time)
        continue

        results_file = "NprogressionMSettingL2Real.csv"
        for j in [25,10, 50, 100]:
            for i in range(10, 2011, 100):
                time = time_execution(infected_phones * j, "L", int( j * len(infected_phones) /50), i)
                print(time)
        continue
        results_file = "total_phones.csv"

        for i in range(25, 25000, 100):
            time = time_execution(infected_phones * i, "L", 250, 1500)
            print(time)



        results_file = "MprogressionNConstant.csv"
        for j in [3, 5, 10, 20]:
            for i in range(10, 6012, 250):
                time = time_execution(infected_phones * i, "L", 10, j)
                print(time)
        results_file = "NprogressionMConstant.csv"
        for j in [1, 5, 10, 20]:
            for i in range(10, 1000, 25):
                time = time_execution(infected_phones * j, "L", 10, i)
                print(time)

        results_file = "MprogressionNSettingK.csv"
        for j in [50, 5, 15, 25]:
            for i in range(10, 10012, 500):
                time = time_execution(infected_phones * i, "K", int(len(infected_phones) * i/25), j)
                print(time)



        results_file = "changeKLimited.csv"
        for z in range(1):
            for j in [100, 500, 1000]:
                print(int( (10 + 1) * len(infected_phones) * j / 2), int( (10 + 1) * len(infected_phones) * j / 2 / 50))
                for i in range(2, int( (10 + 1) * len(infected_phones) * j / 2) , int( (10 + 1) * len(infected_phones) * j / 2 / 50)):
                    time = time_execution(infected_phones * j, "K", i, 10)
                    print(time)
        results_file = "changeL.csv"

        for j in [100, 500, 1000]:
            for i in range(1, 500, 10):
                time = time_execution(infected_phones * j, "L", i, 10)
                print(time)


        results_file = "MprogressionNConstantLVaries.csv"
        for j in [3, 5, 10, 20]:
            for i in range(10, 6012, 250):
                time = time_execution(infected_phones * i, "L", int(len(infected_phones * i)/100), j)
                print(time)


        results_file = "changeK.csv"
        for z in range(2):
            for j in [100, 500, 1000]:
                for i in range(10, 5000, 50):
                    time = time_execution(infected_phones * j, "K", i, 10)
                    print(time)

        exit()
        results_file = "execution_results_non_infected_per_infectedHTTPS.csv"
        for i in range(1, 10000, 250):
            continue
            time = time_execution(infected_phones * 10, max_group_size, i)
            print(time)
        results_file = "prueba.csv"
        for j in [3, 5, 10, 15, 20, 25, 100]:
            continue
            for i in range(1, 1002, 100):
                time = time_execution(infected_phones * i, "L", 5, j)
                print(time)
        results_file = "prueba2.csv"
        for j in [600, 400, 800, 10, 30, 100, 200, 1600]:
            for i in range(2, int(len(infected_phones) * j/2), int(len(infected_phones) * j/100)):
                print(i,j)
                time = time_execution(infected_phones * 10, "L", i, j)
                print(time)

