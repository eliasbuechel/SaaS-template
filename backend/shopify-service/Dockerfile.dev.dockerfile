FROM node:23.8.0-alpine

WORKDIR /app

RUN pwd
RUN ls -a

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && corepack prepare yarn@stable --activate

ENV NODE_ENV=development
RUN yarn install --immutable

COPY . .

RUN yarn lint

CMD ["yarn", "dev"]