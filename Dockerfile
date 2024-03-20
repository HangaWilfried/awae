FROM nginx:stable-alpine3.17-slim as production-satge
COPY /dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]