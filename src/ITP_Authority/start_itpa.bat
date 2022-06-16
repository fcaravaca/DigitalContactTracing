copy ..\..\DevelopmentTestKeys\HA_public.pem .
copy ..\..\DevelopmentTestKeys\LP1_public.pem .
copy ..\..\DevelopmentTestKeys\LP2_public.pem .
copy ..\..\DevelopmentTestKeys\LP3_public.pem .
copy ..\..\DevelopmentTestKeys\ITPA.pem .
mkdir security
cd security
copy ..\..\..\DevelopmentTestKeys\reqITPA.cnf req.cnf
C:\"Program Files"\Git\usr\bin\openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
cd ..
docker-compose -f docker-compose.yml -p itpa-1 up --force-recreate --build -d
docker image prune -f
del /Q .\security\*
rmdir -r security
del HA_public.pem
del LP1_public.pem
del LP2_public.pem
del LP3_public.pem
del ITPA.pem