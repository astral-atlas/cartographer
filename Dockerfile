FROM node:12 as builder
LABEL maintainer="Luke Kaalim (luke@kaal.im)"
LABEL project="Astral Atlas"

WORKDIR /home/cartographer
COPY package.json package-lock.json ./
RUN npm ci install
COPY . ./
RUN make build
CMD [ "npm", "run" ]

FROM node:12-alpine

WORKDIR /home/cartographer/build
COPY --from=builder /home/cartographer/build .

EXPOSE 80
ENTRYPOINT [ "node", "server" ]