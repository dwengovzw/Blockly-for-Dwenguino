#!/bin/sh

# make sure to set production flag of NodeJS
export NODE_ENV=production

# clean the node_modules directory and reinstall to be sure you have latest version 
rm -Rf node_modules
npm install

# go to backend and stop the previous app version and start the new nodeJS app in bac$
pwd
pm2 stop $(pwd)/backend/index.js
pm2 start $(pwd)/backend/index.js
exit

