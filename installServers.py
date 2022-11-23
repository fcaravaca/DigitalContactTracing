import os
import shutil
from pathlib import Path
import json
import sys

###  VARIABLES ###
config = None
with open(sys.argv[1], "r") as fh:
    config = json.loads(fh.read())

for env_variable in config["env_variables"]:
    os.environ[env_variable] = config["env_variables"][env_variable]

lp_urls = {}
for lp in config["location_providers"]:
    lp_urls[lp["id"]] = lp["url"]

# The ITPAs need to know the map between LPs and URLs from config file
os.environ["DTC_LP_URLS"] = str(lp_urls)

### Setup servers ###
def build_docker(path, files, id):
    file_parameters = ""
    for file in files:
        absolute_path = os.path.abspath(file)
        file_parameters += " -f " + absolute_path
    os.chdir(path)
    os.system("docker-compose" + file_parameters +" -p " + id + " up --force-recreate --build -d")
    #os.system("docker image prune -f")
    os.chdir("../..")

def create_security_path(path):
    security_path = path + "security/"
    os.makedirs(security_path, exist_ok=True)
    os.makedirs(security_path + "HAs/", exist_ok=True)
    os.makedirs(security_path + "ITPAs/", exist_ok=True)
    os.makedirs(security_path + "LPs/", exist_ok=True)

def create_https_certificate(path, configFile):
    security_path = path + "security/"
    ## Create HTTPS certificate
    os.system("openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout " + security_path + "cert.key -out " + security_path + "cert.pem -config " + configFile + " -sha256")

def remove_security_dir(path):
    shutil.rmtree(path + "security")

def remove_pem_files(path):
    for filename in Path(path).glob("*.pem"):
        filename.unlink()

def copyHAsPublicKeys(path):
    for ha in config["health_authorities"]:
        shutil.copy(ha["public_key"], path + "security/HAs/" + ha["id"] + "_public.pem")

def copyLPsPublicKeys(path):
    for lp in config["location_providers"]:
        shutil.copy(lp["public_key"], path + "security/LPs/" + lp["id"] + "_public.pem")

def copyITPAsPublicKeys(path):
    for itpa in config["itp_authorities"]:
        shutil.copy(itpa["public_key"], path + "security/ITPAs/" + itpa["id"] + "_public.pem")

#### ID PROVIDERs ####

id_provider_path = "src/ID_Provider/"

create_security_path(id_provider_path)
copyHAsPublicKeys(id_provider_path)

for id_provider in config["id_providers"]:
    shutil.copy(id_provider["private_key"], id_provider_path + "IDP.pem")
    create_https_certificate(id_provider_path, id_provider["https_cert_conf"])
    build_docker(id_provider_path, id_provider["docker_compose_files"], id_provider["id"])

remove_security_dir(id_provider_path)
remove_pem_files(id_provider_path)

#### ITPAs ####
itpa_provider_path = "src/ITP_Authority/"

create_security_path(itpa_provider_path)
copyHAsPublicKeys(itpa_provider_path)
copyLPsPublicKeys(itpa_provider_path)
for itpa in config["itp_authorities"]:
    shutil.copy(itpa["private_key"], itpa_provider_path + "ITPA.pem")
    create_https_certificate(itpa_provider_path, itpa["https_cert_conf"])
    build_docker(itpa_provider_path, itpa["docker_compose_files"], itpa["id"])

remove_security_dir(itpa_provider_path)
remove_pem_files(itpa_provider_path)

#### LPs ####
location_provider_path = "src/Location_Provider/"

create_security_path(location_provider_path)
copyHAsPublicKeys(location_provider_path)
copyITPAsPublicKeys(location_provider_path)
for lp in config["location_providers"]:
    shutil.copy(lp["private_key"], location_provider_path + "private.pem")
    create_https_certificate(location_provider_path, lp["https_cert_conf"])
    build_docker(location_provider_path, lp["docker_compose_files"], lp["id"])

remove_security_dir(location_provider_path)
remove_pem_files(location_provider_path)

