#!/bin/sh

# Nodejs flags are now configured in ./backend/.env 

# Remove all files in the deployment directory to make sure no unused files stay behind from the previous deployment
sudo rm -rf /home/ubuntu/blockly-build/*

# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# Copy the new files to the deployment directory
sudo cp -r /var/lib/jenkins/workspace/blockly-build/ /home/ubuntu/

cd /home/ubuntu/blockly-build/

# go to backend and stop the previous app version and restart the new nodeJS app in back
forever restart backend/index.js -r dotenv/config || forever start backend/index.js -r dotenv/config
exit

