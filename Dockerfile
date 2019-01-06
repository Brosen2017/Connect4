FROM node:8.11.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 5000

CMD ["npm", "start"]