copy ..\..\DevelopmentTestKeys\HA_public.pem .
copy ..\..\DevelopmentTestKeys\IDP.pem .
mkdir security
cd security
copy ..\..\..\DevelopmentTestKeys\reqIDP.cnf req.cnf
C:\"Program Files"\Git\usr\bin\openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
cd ..
docker-compose -f docker-compose.yml -p idp-1 up --force-recreate --build -d
docker image prune -f
del /Q .\security\*
rmdir -r security
del HA_public.pem
del IDP.pem