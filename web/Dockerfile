FROM node:10-alpine as build-stage

WORKDIR /app

COPY /web/package.json /web/package-lock.json /app/

RUN npm install
COPY ./web /app

RUN npm run build


FROM nginx as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY /web/nginx.conf /etc/nginx/nginx.conf