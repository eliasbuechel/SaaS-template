FROM node:22-bookworm-slim

RUN corepack enable && \
    corepack prepare yarn@4.7.0 --activate 

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=development yarn workspaces focus --all && \
    yarn cache clean &&  \
    rm -rf /root/.yarn /root/.cache /root/.npm .yarn .next/cache
    
COPY . .

CMD ["yarn", "dev"]

EXPOSE 3000