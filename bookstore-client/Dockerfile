# build application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build --prod

# setup image
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
RUN apk add --no-cache gettext
COPY --from=build /app/dist/book-store/browser /usr/share/nginx/html
COPY --from=build /app/src/assets/env.template.json /usr/share/nginx/html/assets/env.template.json
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
