copy ..\..\DevelopmentTestKeys\HA_public.pem .
copy ..\..\DevelopmentTestKeys\LP1_public.pem .
copy ..\..\DevelopmentTestKeys\LP2_public.pem .
copy ..\..\DevelopmentTestKeys\LP3_public.pem .
copy ..\..\DevelopmentTestKeys\ITPA.pem .
docker-compose -f docker-compose.yml -p itpa-1 up --force-recreate --build -d
docker image prune -f
del HA_public.pem
del LP1_public.pem
del LP2_public.pem
del LP3_public.pem
del ITPA.pem