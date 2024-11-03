ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM node:${NODE_VERSION}-alpine AS production


ENV NODE_ENV=prod


WORKDIR /app


COPY package*.json ./


RUN npm ci --ignore-scripts


COPY --from=builder /app/dist ./dist


EXPOSE 5500


CMD ["node", "dist/server.js"]