#!/bin/bash

source ./.env

docker-compose up -d
docker exec -it -u $NODE_USER:$NODE_USER $CONTAINER_WEB sh

docker-compose down
