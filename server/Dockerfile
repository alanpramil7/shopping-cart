# Use a smaller base image
FROM node:14-alpine

WORKDIR /home/shopping/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
