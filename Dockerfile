FROM nginx:1.19.1

COPY dist/evs-web /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

