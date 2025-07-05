FROM node:22-bookworm

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && \
    corepack prepare yarn@4.7.0 --activate 

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=development yarn install && \
    yarn cache clean &&  \
    rm -rf /root/.yarn /root/.cache /root/.npm .yarn .next/cache
    
ENV NODE_ENV=production

CMD ["yarn", "dev"]

EXPOSE 3000