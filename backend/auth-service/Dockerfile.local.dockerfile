FROM node:22-bookworm

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=development yarn install && \
    yarn cache clean &&  \
    rm -rf /root/.yarn /root/.cache /root/.npm .yarn .next/cache

EXPOSE 4000 4001

CMD ["yarn", "dev"]