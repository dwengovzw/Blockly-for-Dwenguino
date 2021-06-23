#!/bin/sh

# Nodejs flags are now configured in ./backend/.env 

# Remove all files in the deployment directory to make sure no unused files stay behind from the previous deployment
sudo rm -rf /home/ubuntu/blockly-build/*

# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# Run webpack to compile frontend javascript into bundle
# npm run build # -> This chrashes on the server, not enough memory.

# Copy the new files to the deployment directory
sudo cp -r /var/lib/jenkins/workspace/blockly-build/ /home/ubuntu/

cd /home/ubuntu/blockly-build/backend

# Give jenkins user write access to the compilation folder to be able to create the required files for compilation
sudo chown -R jenkins:jenkins /home/ubuntu/blockly-build/backend/compilation

# go to backend and stop the previous app version and restart the new nodeJS app in back
forever restart index.js -r dotenv/config || forever start index.js -r dotenv/config
exit

