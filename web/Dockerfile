FROM node:10-alpine

WORKDIR /app

COPY /web/package.json /web/package-lock.json /app/

RUN npm install
COPY . /app

CMD ["npm", "run", "serve"]
