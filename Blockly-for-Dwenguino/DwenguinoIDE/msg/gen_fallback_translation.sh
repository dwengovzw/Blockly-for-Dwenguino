#!/bin/bash
cat ./en.js | sed 's/MSG/MSG_FALLBACK/g' > ./fallback.js