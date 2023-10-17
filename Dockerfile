FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

ENV PASSWORD=eCo40D
ENV OPEN_AI_KEY=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
RUN npm install -g npm@9.8.1
RUN yarn add supervisor -g
RUN yarn

COPY . .

CMD ["node", "."]
