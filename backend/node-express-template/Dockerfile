FROM node:23.8.0-alpine

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack prepare yarn@stable --activate
RUN yarn install --immutable
COPY . .
RUN yarn build

EXPOSE 4001

CMD ["yarn", "start"]