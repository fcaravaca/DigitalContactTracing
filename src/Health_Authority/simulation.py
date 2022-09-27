import csv
import datetime
import fullTransaction
import os

results_file = 'execution_results.csv'

def time_execution(infected_phones, max_group_size, number_non_infected_per_infected):
    start_date = datetime.datetime.now()

    fullTransaction.transaction(infected_phones, max_group_size, number_non_infected_per_infected, allowPrint=False)

    execution_time = str(datetime.datetime.now() - start_date)
    save_execution_result(len(infected_phones), max_group_size, number_non_infected_per_infected, execution_time)

    return execution_time

def save_execution_result(infected_phones_len, max_group_size, number_non_infected_per_infected, execution_time):

    if not os.path.exists(results_file):
        with open(results_file, "w", encoding="UTF8", newline='') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(["number_infected_phones", "max_group_size", "number_non_infected_per_infected", "execution_time"])

    with open(results_file, "a+", encoding="UTF8", newline='') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow([infected_phones_len, max_group_size, number_non_infected_per_infected, execution_time])
        


if __name__ == "__main__":

    infected_phones = ["299", "298", "297", "296", "295", "294", "293", "292", "291", "290"] 
    max_group_size = 5
    number_non_infected_per_infected = 15

    results_file = "execution_results_number_of_infected_phones4.csv"
    for j in [3, 5, 10, 15, 20, 25, 100]:
        for i in range(1, 1002, 100):
            time = time_execution(infected_phones * i, max_group_size, j)
            print(time)

    results_file = "execution_results_group_size3.csv"
    for j in [600, 400, 800, 10, 30, 100, 200]:
        for i in range(2, int(len(infected_phones) * j/2), int(len(infected_phones) * j/100)):
            time = time_execution(infected_phones * j, i, number_non_infected_per_infected)
            print(time)

    results_file = "execution_results_non_infected_per_infected5.csv"
    for i in range(1, 5000, 100):
        continue
        time = time_execution(infected_phones * 10, max_group_size, i)
        print(time)