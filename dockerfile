FROM node:16

WORKDIR /app

COPY package.json /app
COPY tsconfig.json /app

RUN npm install

COPY . /app

RUN npm run build


CMD ["npm", "run", "start:prod"]
