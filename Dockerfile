FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

ENV OPEN_AI_KEY=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
ENV PASSWORD=eCo40D
ENV MONGO_URI=mongodb+srv://dark1522:K7sRu6oFMhJfm9tb@cluster17789.rfhje1r.mongodb.net/?retryWrites=true&w=majority

RUN npm install -g npm@9.8.1
RUN yarn add supervisor -g
RUN yarn

COPY . .

CMD ["node", "."]
