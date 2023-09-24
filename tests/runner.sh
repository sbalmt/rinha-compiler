#!/bin/bash
for filename in ./tests/*.rinha; do
  echo " --- ${filename}"
  node ./bin/rinha.js $filename
done