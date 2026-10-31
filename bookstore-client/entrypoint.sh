#!/bin/sh

# Replace placeholder in env.json with actual ENV vars
envsubst < /usr/share/nginx/html/assets/env.template.json > /usr/share/nginx/html/assets/env.json

# Start Nginx
exec nginx -g 'daemon off;'
