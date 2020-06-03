#!/bin/bash
/home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/node_modules/electron/dist/electron /home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/Blockly-for-Dwenguino/index.html --no-sandbox &
electronPid=$!
node --experimental-modules /home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/backend/index.js &
nodePid=$!
echo "DwenguinoBlockly is running"
wait $electronPid
kill $nodePid
echo "Quitting DwenguinoBlockly"
