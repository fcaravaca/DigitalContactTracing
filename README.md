# DigitalContactTracing

Digital Contact Tracing implementation, based on: "Digital Contact Tracing: Large-Scale Geolocation Data as an Alternative to Bluetooth-Based Apps Failure".

Project is in an early stage, not functional

## Requirements

Docker v20.04+ and docker-compose
Python3 

## Execution

Build environment:

```
pip install pycryptodome
python3 installServers.py configuration.json
```

Execute simulation:

```
python3 src/Health_Authority/fullTransaction.py configuration.json
```

## Configuration file

Default configuration file: configuration.json

## Project Structure

TODO

## Host config

```
127.0.0.1:2000 LP1
127.0.0.1:2100 LP2
127.0.0.1:2200 LP3
127.0.0.1:5000 ITPA
127.0.0.1:3000 IDP
```
