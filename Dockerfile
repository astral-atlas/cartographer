FROM node:12

LABEL maintainer="Luke Kaalim"

WORKDIR /home/cartographer

ADD package.json package-lock.json ./
ADD local.cartographer.json ./

RUN npm i --production

ADD src ./src

EXPOSE 80

ENTRYPOINT [ "npm", "start" ]