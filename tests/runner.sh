#!/bin/bash
for filename in ./tests/*.rinha; do
  echo " --- ${filename}"
  node --stack-size=10240 --max-old-space-size=1536 ./bin/rinha.js $filename
done