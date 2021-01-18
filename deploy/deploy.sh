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

sudo mkdir /home/ubuntu/blockly-build/.well-known
sudo mkdir /home/ubuntu/blockly-build/.well-known/pki-validation
sudo cp /home/ubuntu/FC37FD18104CADF4FA7E11F21D8D4894.txt /home/ubuntu/blockly-build/.well-known/pki-validation/
sudo chmod -R 775 /home/ubuntu/blockly-build/.well-known/

# go to backend and stop the previous app version and restart the new nodeJS app in back
forever restart backend/index.js || forever start backend/index.js
exit

