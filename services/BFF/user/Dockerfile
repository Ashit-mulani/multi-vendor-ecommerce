From node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .


FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5001

CMD ["node", "src/index.js"]
