FROM node:lts-iron

WORKDIR /usr/app/backend

COPY . .

RUN npm install

CMD ["npm","start"]
