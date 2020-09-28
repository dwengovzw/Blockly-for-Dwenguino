#!/bin/sh

# make sure to set production flag of NodeJS
export NODE_ENV=production
export PORT=8081
export MONGODB_URI="mongodb://localhost/dwenguinoblockly"
export PM2_HOME=/etc/pm2deamon


# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# Copy the new files to the deployment directory
sudo cp -r * /home/ubuntu/blockly-build/

# go to backend and stop the previous app version and start the new nodeJS app in bac$
#pm2 stop backend/index.js
#export BUILD_ID=dontKillMePlease 
#pm2 start backend/index.js
exit

