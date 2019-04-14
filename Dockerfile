FROM node:10

WORKDIR /app

COPY dist /app/dist
COPY node_modules /app/node_modules

EXPOSE 80

RUN node dist