FROM node:16.17-alpine3.15
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn run build

FROM node:16.17-alpine3.15
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --only=production
COPY --from=0 /usr/src/app/dist ./dist
CMD [ "yarn", "start" ]`