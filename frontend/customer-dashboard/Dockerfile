FROM node:23.8.0-alpine

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json yarn.lock ./

RUN if [ "$NODE_ENV" = "production" ]; then yarn install --production; else yarn install; fi

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]