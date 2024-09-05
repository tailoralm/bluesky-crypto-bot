FROM node:lts-iron

WORKDIR /usr/app

COPY . .

RUN npm install

CMD ["npm","start"]
