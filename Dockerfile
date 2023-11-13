FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
