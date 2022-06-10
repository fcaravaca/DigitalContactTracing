docker-compose -f docker-compose.yml -f docker-compose.lp-1.yml -p lp-1 up --force-recreate --build -d
docker-compose -f docker-compose.yml -f docker-compose.lp-2.yml -p lp-2 up --force-recreate --build -d
docker-compose -f docker-compose.yml -f docker-compose.lp-3.yml -p lp-3 up --force-recreate --build -d
docker image prune -f