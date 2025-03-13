FROM node:23.8.0-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

ENV NODE_ENV=production
RUN yarn install --immutable && \
    yarn cache clean

COPY . .

RUN yarn build

CMD ["node", "/app/dist/server.js"]

