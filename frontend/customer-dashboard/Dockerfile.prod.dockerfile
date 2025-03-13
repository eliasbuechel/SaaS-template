FROM node:20-alpine AS builder

RUN corepack enable && \
    corepack prepare yarn@4.7.0 --activate 

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN NODE_ENV=production yarn workspaces focus --all --production && \
    yarn cache clean &&  \
    rm -rf /root/.yarn /root/.cache /root/.npm .yarn .next/cache

COPY . .

RUN yarn build


FROM node:20-alpine

WORKDIR /app

RUN corepack enable && \
    corepack prepare yarn@4.7.0 --activate

COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.yarn /app/.yarn

RUN ls

EXPOSE 3000

CMD ["next", "start"]