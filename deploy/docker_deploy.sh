#!/bin/bash

# Get the environment from argument or set default
env=${1:-dev.env}
echo $env

echo "changing to deploy directory"
# Go to deploy directory
#cd /home/node/deploy



# Copy the .env files from the config directory on the server into the deploy directory
#cp /var/environments/$env /home/node/deploy/.env
#cat /var/environments/$env
#cat /home/node/deploy/.env

#ls /home/node/deploy

echo "change rights"
# Give jenkins user write access to the compilation folder to be able to create the required files for compilation
#chown -R node:node /home/node/deploy/backend/compilation 

echo "run application"
# go to backend and stop the previous app version and restart the new nodeJS app in back
#npm run start:dev > blockly.log 2> blockly_err.log
#forever restart backend/index.js -r dotenv/config || forever start backend/index.js -r dotenv/config
exit

