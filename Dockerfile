# --- Сборка
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Передаём ключ как build-arg
ARG VITE_GEO_API_KEY
ENV VITE_GEO_API_KEY=$VITE_GEO_API_KEY

RUN npm run build

# --- Продакшен
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]