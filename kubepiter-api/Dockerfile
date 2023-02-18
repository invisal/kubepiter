FROM node:16.17-alpine3.15
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn run build

FROM node:16.17
WORKDIR /usr/src/app

RUN apt-get install -y ca-certificates curl
RUN apt-get install -y apt-transport-https
RUN curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | tee /etc/apt/sources.list.d/kubernetes.list
RUN apt-get update
RUN apt-get install -y kubectl

COPY package*.json ./
RUN yarn install --only=production
COPY --from=0 /usr/src/app/dist ./dist
CMD [ "yarn", "start" ]`