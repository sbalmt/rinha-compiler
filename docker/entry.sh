#!/bin/sh
file_location="${1}"

if [ -z "${file_location}" ];
then
  file_location="/var/rinha/source.rinha"
fi

node --stack-size=51200 --max-old-space-size=1920 ./bin/rinha.js $file_location