FROM node:22-alpine as build 

RUN corepack enable pnpm

WORKDIR /work

COPY package*.json ./

RUN pnpm install

COPY . ./

RUN pnpm run build

FROM alpine:latest AS production
WORKDIR /work

RUN apk add --no-cache rsync

VOLUME /app/frontend/build

COPY --from=build /work/build /work/build

CMD ["sh", "-c", "rsync -av /work/build/ /app/frontend/build && echo 'Frontend build copied to volume'"]
