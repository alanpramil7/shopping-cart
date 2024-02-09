FROM node:14

WORKDIR /home/shopping/api

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]