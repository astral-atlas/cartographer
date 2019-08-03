FROM node:12-alpine

LABEL maintainer="Luke Kaalim (luke@kaal.im)"
LABEL project="Astral Atlas"

WORKDIR /home/cartographer

ADD package.json package-lock.json ./

RUN npm ci install --production

ADD src ./src

EXPOSE 80

ENTRYPOINT [ "node", "src" ]