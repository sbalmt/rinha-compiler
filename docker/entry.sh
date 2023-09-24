#!/bin/sh
file_location="${1}"

if [ -z "${file_location}" ];
then
  file_location="/var/rinha/source.rinha"
fi

node --stack-size=10240 --max-old-space-size=1536 ./bin/rinha.js $file_location