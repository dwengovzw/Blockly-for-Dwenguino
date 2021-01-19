#!/bin/sh

# make sure to set production flag of NodeJS
export NODE_ENV=production
export PORT=8081
export MONGODB_URI="mongodb://localhost/dwenguinoblockly"

# Remove all files in the deployment directory to make sure no unused files stay behind from the previous deployment
sudo rm -rf /home/ubuntu/blockly-build/*

# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# Copy the new files to the deployment directory
sudo cp -r * /home/ubuntu/blockly-build/

sudo rm /home/ubuntu/blockly-build/backend/index.js
sudo cp /home/ubuntu/certs/index.js /home/ubuntu/blockly-build/backend/

cd /home/ubuntu/blockly-build/

# go to backend and stop the previous app version and restart the new nodeJS app in back
sudo forever restart backend/index.js || sudo forever start backend/index.js
exit

