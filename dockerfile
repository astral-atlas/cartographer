FROM node:10 as builder

WORKDIR /app

COPY . /app

RUN npm ci