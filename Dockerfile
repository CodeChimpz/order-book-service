FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm i -g tsx

COPY . .

# Start the application.
CMD ["npm", "run", "dev"]
