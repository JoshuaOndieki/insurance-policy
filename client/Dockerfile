FROM ubuntu:latest
LABEL authors="JoshuaOmbatiOndieki"

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DEPLOY_LOCAL=false
RUN if [ "$DEPLOY_LOCAL" = "true" ]; then npm run build:local; else npm run build; fi

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist/insurance-policy/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
