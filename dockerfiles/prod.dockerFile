# Base image 
FROM node:20-alpine

# Enable pnpm via corepack (modern, official way)
RUN corepack enable 

WORKDIR /app

# Copy dependency definitions
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile  

#  Copy rest of the app
COPY . .

RUN pnpm build

EXPOSE 3000

CMD [ "pnpm","start"]