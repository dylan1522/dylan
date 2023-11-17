FROM node:lts-buster

WORKDIR /dylan
RUN git clone https://github.com/dylan1522/dylan .

COPY package.json .
COPY yarn.lock .

ENV NODE_VERSION=20.2.0
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@9.8.1
RUN yarn global add supervisor
RUN yarn

COPY . .

CMD ["node", "."]