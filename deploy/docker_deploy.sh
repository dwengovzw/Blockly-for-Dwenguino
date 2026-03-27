#!/bin/bash

# Get the environment from argument or set default
env=${1:-dev.env}
echo $env

# Go to deploy directory
cd /home/node/deploy

# Copy the .env files from the config directory on the server into the deploy directory
#cp /var/environments/$env /home/node/deploy/.env
#cat /var/environments/$env
#cat /home/node/deploy/.env

#ls /home/node/deploy

# Give jenkins user write access to the compilation folder to be able to create the required files for compilation
sudo chown -R node:node /home/node/deploy/backend/compilation 

# go to backend and stop the previous app version and restart the new nodeJS app in back
npm run start > blockly.log 2> blockly_err.log
#forever restart backend/index.js -r dotenv/config || forever start backend/index.js -r dotenv/config
exit

