# DigitalContactTracing

Digital Contact Tracing implementation, based on: "Digital Contact Tracing: Large-Scale Geolocation Data as an Alternative to Bluetooth-Based Apps Failure". Article available online: https://doi.org/10.3390/electronics10091093


## Requirements in local environment

Docker (v20.10+ needed in linux)  

Docker-compose

Python3 (and pycryptodome)

## Execution

Build environment:

```
python3 installServers.py configuration.json
```

Install pycryptodome
```
pip install pycryptodome
``` 

Execute simulation:

```
python3 src/Health_Authority/fullTransaction.py ./configuration.json
```

## Project Structure

3 servers 1 client

Servers -> HTTPs server + database for auditing

## Configuration 

Default configuration file: `configuration.json`

### Default Host configuration

By default, 1 ITPAs, 1 LPDs and 3 LPs will be launched.

```
127.0.0.1:2000 LP1
127.0.0.1:2100 LP2
127.0.0.1:2200 LP3
127.0.0.1:5000 ITPA
127.0.0.1:3000 IDP
```

### Environment variables
`DCT_HTTPS` enables HTTPs connections

`DCT_VALIDATE_HTTPS` if set to `false` will avoid checking HTTPs certificate validity (needed for local environment)
