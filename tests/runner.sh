#!/bin/bash
for filename in ./tests/*.rinha; do
  echo " --- ${filename}"
  node --stack-size=51200 --max-old-space-size=1920 ./bin/rinha.js $filename
done