#!/bin/bash

CLIENT_PATH=/usr/src/app/client
SERVER_PATH=/usr/src/app/server

echo "test"

if [ "$NODE_ENV" == "prod" ]; then
	echo ""
	echo "############### PRODUCTION ###############"
	echo ""
	
	npm i -g @nestjs/cli

	cd $CLIENT_PATH 
	npm install
	npm run build

	cd $SERVER_PATH
	npm install
	# npm run build
	npm run start:dev

else
	echo ""
	echo "############### DEVELOPMENT ###############"
	echo ""

	cd $SERVER_PATH
	npm install
	npm run build
	npm run start:dev &

	cd $CLIENT_PATH
	npm install
	npm run dev

fi
