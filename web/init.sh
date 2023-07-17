#!/bin/bash

CLIENT_PATH=/usr/src/app/client
SERVER_PATH=/usr/src/app/server

if [ "$NODE_ENV" == "production" ]; then
	echo "PRODUCTION!!!"
	cd $CLIENT_PATH 
	npm install
	npm run build

	cd $SERVER_PATH
	npm install
	npm run build
	npm run start:prod

else
	cd $SERVER_PATH
	npm install
	npm run build
	npm run start &

	echo "DEV!!!"
	cd $CLIENT_PATH
	npm install
	npm run dev

fi
