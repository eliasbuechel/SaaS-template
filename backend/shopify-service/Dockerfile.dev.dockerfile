FROM node:23.8.0-alpine

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=development yarn workspaces focus --all && \
    yarn cache clean

COPY . .

RUN yarn lint

CMD ["yarn", "dev"]