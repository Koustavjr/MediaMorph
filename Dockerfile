FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm install

RUN npm run build

CMD ["npm","start"]