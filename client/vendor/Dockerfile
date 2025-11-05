# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_BACKEND_URL

ARG VITE_CLIENT_URL

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

ENV VITE_CLIENT_URL=${VITE_CLIENT_URL}

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
