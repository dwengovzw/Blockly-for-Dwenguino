#!/bin/sh

# make sure to set production flag of NodeJS
export NODE_ENV=production
export PORT=8081
export MONGODB_URI="mongodb://localhost/dwenguinoblockly"
export PM2_HOME=/etc/pm2deamon

# Remove all files in the deployment directory to make sure no unused files stay behind from the previous deployment
sudo rm -rf /home/ubuntu/blockly-build/*

# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# Overwrite the default server configuration with the server configuration for production
echo "export default class ServerConfig{static getServerUrl(){return 'http://blockly-backend.dwengo.org';}}" > Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js

# Build the new bundle that uses the new server configuration with webpack 
npm run build 

# Copy the new files to the deployment directory
sudo cp -r * /home/ubuntu/blockly-build/

# go to backend and stop the previous app version and start the new nodeJS app in bac$
#pm2 stop backend/index.js
#export BUILD_ID=dontKillMePlease 
#pm2 start backend/index.js
exit

