copy ..\..\DevelopmentTestKeys\HA_public.pem .
copy ..\..\DevelopmentTestKeys\IDP.pem .
docker-compose -f docker-compose.yml -p idp-1 up --force-recreate --build -d
docker image prune -f
del HA_public.pem
del IDP.pem