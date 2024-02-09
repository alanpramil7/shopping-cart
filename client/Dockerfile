FROM node:14-alpine as builder

WORKDIR /home/shopping/client

COPY package*.json ./

RUN npm install

COPY . .

FROM node:14-alpine

WORKDIR /home/shopping/client

COPY --from=builder /home/shopping/client .

EXPOSE 3000

CMD ["npm", "start"]
