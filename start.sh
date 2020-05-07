#!/bin/bash
cd /home/tneutens/Documents/UGent/Onderzoek/DwenguinoBlockly/backend
# the -r esm flag uses the esm package to fix issues with em6 module support in nodejs
# this can be removed in future versions of nodejs if support is complete
#node -r esm index.js
node --experimental-modules index.js
#node index.js
