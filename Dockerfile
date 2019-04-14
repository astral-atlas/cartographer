FROM node:10

WORKDIR /app

COPY dist /app/dist
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json

EXPOSE 80

RUN npm ci --production

CMD ["node", "dist"]