copy ..\..\DevelopmentTestKeys\LP1.pem private.pem
docker-compose -f docker-compose.yml -f docker-compose.lp-1.yml -p lp-1 up --force-recreate --build -d
copy ..\..\DevelopmentTestKeys\LP2.pem private.pem
docker-compose -f docker-compose.yml -f docker-compose.lp-2.yml -p lp-2 up --force-recreate --build -d
copy ..\..\DevelopmentTestKeys\LP3.pem private.pem
docker-compose -f docker-compose.yml -f docker-compose.lp-3.yml -p lp-3 up --force-recreate --build -d
del private.pem
docker image prune -f