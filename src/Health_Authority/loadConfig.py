
import os 
import json

config = None
def load_config_file(file="../../configuration.json"):
    global config
    dir_path = os.path.dirname(file)
    os.chdir(dir_path)
    print(os.getcwd()) # change working directory to the configuration file path
    with open("configuration.json", "r") as fh:
        config = json.loads(fh.read())
    return config

def get_ha_private_key(index=0):
    global config
    if config is None:
        load_config_file()
    return config["health_authorities"][index]["private_key"] 

def fill_providers_info(type):
    global config
    if config is None:
        load_config_file()

    groups = []
    useHttps = config["env_variables"]["DCT_HTTPS"] == "true" or config["env_variables"]["DCT_HTTPS"] == ""
    for group in config[type]:
        url = ("https://" if useHttps else "http://") + group["url"]
        public_key = group["public_key"]
        id = group["id"]
        groups.append({
            "url": url, "public_key": public_key, "id": id
        })
    return groups