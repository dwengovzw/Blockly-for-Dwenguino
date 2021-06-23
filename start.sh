mongod --fork --syslog
/home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/node_modules/electron/dist/electron --ignore-certificate-errors /home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/Blockly-for-Dwenguino/index.html --no-sandbox &
electronPid=$!
cd /home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/backend/
node -r dotenv/config --experimental-modules index.js &
cd /home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly
nodePid=$!
echo "DwenguinoBlockly is running"
wait $electronPid
kill $nodePid
echo "Quitting DwenguinoBlockly"
