FROM node:12

LABEL maintainer="Luke Kaalim"

WORKDIR /home/cartographer

ADD package.json package-lock.json ./

RUN npm i --production

ADD src ./src

ENTRYPOINT [ "npm start" ]