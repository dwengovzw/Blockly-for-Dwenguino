#!/bin/bash

# Get the environment from argument or set default
env=${1:-dev.env}
echo $env

echo "changing to deploy directory"
# Go to deploy directory
cd /home/node/deploy

echo "change rights"
# Give jenkins user write access to the compilation folder to be able to create the required files for compilation
chown -R node:node /home/node/deploy/backend/compilation 

echo "installing arm-none-eabi-gcc toolchain for Halberd compilation"
ARDUINO_CLI="/home/node/deploy/backend/compilation/bin/linux/arduino-cli"
"$ARDUINO_CLI" config init --overwrite --additional-urls https://adafruit.github.io/arduino-board-index/package_adafruit_index.json
"$ARDUINO_CLI" core update-index
"$ARDUINO_CLI" core install adafruit:nrf52

echo "installing adafruit-nrfutil"
pip3 install --break-system-packages adafruit-nrfutil

echo "run application"
exec npm run start:dev
# go to backend and stop the previous app version and restart the new nodeJS app in back
#npm run start:dev > blockly.log 2> blockly_err.log
#forever restart backend/index.js -r dotenv/config || forever start backend/index.js -r dotenv/config
#exit

