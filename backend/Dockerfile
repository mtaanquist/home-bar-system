FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 8080

CMD ["npm", "start"]