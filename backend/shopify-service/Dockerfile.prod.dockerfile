FROM node:23.8.0-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=production yarn workspaces focus --all --production && \
    yarn cache clean

COPY . .

RUN yarn build

CMD ["node", "/app/dist/server.js"]

