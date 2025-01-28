# Використовуємо Node.js для створення білда
FROM node:20.9.0 AS build
WORKDIR /app

# Встановлюємо залежності
COPY package*.json ./
RUN npm install

# Створюємо білд
COPY . .
RUN npm run build

# Використовуємо Nginx для хостингу білда
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
