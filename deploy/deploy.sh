#!/bin/bash

# Nodejs flags are now configured in ./backend/.env 

# Remove all files in the deployment directory to make sure no unused files stay behind from the previous deployment
sudo rm -rf /home/ubuntu/blockly-build/*

# clean the node_modules directory and reinstall to be sure you have latest version 
cd /home/ubuntu/blockly_repo/Blockly-for-Dwenguino

rm -Rf node_modules
npm install
npm install node-pre-gyp
npm install bcrypt

# Run webpack to compile frontend javascript into bundle
# npm run build # -> This chrashes on the server, not enough memory.

# Copy the new files to the deployment directory
sudo cp -r /home/ubuntu/blockly_repo/Blockly-for-Dwenguino/* /home/ubuntu/blockly-build/

# Copy the .env files from the config directory on the server into the deploy directory
sudo cp /home/ubuntu/env/blockly_backend/.env /home/ubuntu/blockly-build/backend/

cd /home/ubuntu/blockly-build

# Give jenkins user write access to the compilation folder to be able to create the required files for compilation
sudo chown -R ubuntu:ubuntu /home/ubuntu/blockly-build/backend/compilation
sudo chown -R ubuntu:ubuntu /home/ubuntu/blockly-build/compilation

# go to backend and stop the previous app version and restart the new nodeJS app in back
pm2 restart blockly || pm2 -n "blockly" start 'npm run start'
#forever restart backend/index.js -r dotenv/config || forever start backend/index.js -r dotenv/config
exit

