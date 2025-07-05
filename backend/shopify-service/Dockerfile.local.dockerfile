FROM node:23.8.0-alpine

RUN apk add --no-cache curl
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=development yarn install && \
    yarn cache clean &&  \
    rm -rf /root/.yarn /root/.cache /root/.npm .yarn .next/cache 

EXPOSE 4010

CMD ["yarn", "dev"]