From node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .


FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 7000

CMD ["node", "src/index.js"]
