FROM node:20.7.0-alpine3.18

WORKDIR /usr/src/rinha

COPY package*.json tsconfig.json webpack.config.js ./
COPY ./docker ./docker
COPY ./src ./src

RUN npm install && npm run build

RUN chmod +x ./docker/entry.sh

ENTRYPOINT [ "./docker/entry.sh" ]