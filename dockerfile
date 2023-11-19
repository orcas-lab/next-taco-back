FROM node:18-alpine3.17

WORKDIR /usr/taco

ADD . .

RUN apk add --no-cache libc6-compat && \
    apk add --update --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev && \
    npm install -g pnpm && \
    pnpm install && pnpm build

ENV REDIS_MODE=cluster

VOLUME [ "/usr/taco/keys", "/usr/taco/config.toml", "/usr/taco/public" ]

CMD [ "node", "dist/main.js" ] 

EXPOSE 3000