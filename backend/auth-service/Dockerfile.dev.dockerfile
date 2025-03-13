FROM node:22-bookworm-slim

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=development yarn workspaces focus --all && \
    yarn cache clean

COPY . .

RUN yarn lint

EXPOSE 4000 4001

CMD ["yarn", "tsx", "watch", "src/server.ts"]