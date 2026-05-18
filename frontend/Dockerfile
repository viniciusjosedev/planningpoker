FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
CMD ["npm", "run", "dev"]

EXPOSE 5173
