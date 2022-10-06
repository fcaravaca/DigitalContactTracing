mkdir HAs
mkdir ITPAs
copy ..\..\DevelopmentTestKeys\HA_public.pem .\HAs\HA_public.pem
copy ..\..\DevelopmentTestKeys\ITPA_public.pem .\ITPAs\ITPA_public.pem 
copy ..\..\DevelopmentTestKeys\LP1.pem private.pem
mkdir security
cd security
copy ..\..\..\DevelopmentTestKeys\reqLP1.cnf req.cnf
C:\"Program Files"\Git\usr\bin\openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
cd ..
docker-compose -f docker-compose.yml -f docker-compose.lp-1.yml -p lp-1 up --force-recreate --build -d
del /Q .\security\*
rmdir -r security

mkdir security
cd security
copy ..\..\..\DevelopmentTestKeys\reqLP2.cnf req.cnf
C:\"Program Files"\Git\usr\bin\openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
cd ..
copy ..\..\DevelopmentTestKeys\LP2.pem private.pem
docker-compose -f docker-compose.yml -f docker-compose.lp-2.yml -p lp-2 up --force-recreate --build -d
del /Q .\security\*
rmdir -r security

mkdir security
cd security
copy ..\..\..\DevelopmentTestKeys\reqLP3.cnf req.cnf
C:\"Program Files"\Git\usr\bin\openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
cd ..
copy ..\..\DevelopmentTestKeys\LP3.pem private.pem
docker-compose -f docker-compose.yml -f docker-compose.lp-3.yml -p lp-3 up --force-recreate --build -d
del /Q .\security\*
rmdir -r security

del private.pem
del .\HAs\HA_public.pem
del .\ITPAs\ITPA_public.pem
rmdir -r HAs
rmdir -r ITPAs
docker image prune -f