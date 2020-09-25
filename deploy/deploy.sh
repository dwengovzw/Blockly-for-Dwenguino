#!/bin/sh

# make sure to set production flag of NodeJS
export NODE_ENV=production
export PORT=8081

# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# go to backend and stop the previous app version and start the new nodeJS app in bac$
sudo forever stop $(pwd)/backend/index.js 
sudo forever start $(pwd)/backend/index.js -l ../forever_log.txt&
exit

