FROM node:18-alpine3.17

WORKDIR /usr/taco

ADD . .
RUN npm install -g pnpm && pnpm install && pnpm build

VOLUME [ "/usr/taco/keys", "/usr/taco/config.toml" ]

CMD [ "node", "dist/main.js" ] 

EXPOSE 3000