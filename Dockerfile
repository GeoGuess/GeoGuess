FROM node:lts-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm install
COPY . .

# SET ENV VARS FOR REPLACE
ENV VITE_APP_PUBLIC_PATH=VITE_APP_PUBLIC_PATH_ENV
ENV VITE_APP_API_KEY=VITE_APP_API_KEY_ENV
ENV VITE_APP_FIREBASE_API_KEY=VITE_APP_FIREBASE_API_KEY_ENV
ENV VITE_APP_FIREBASE_AUTH_DOMAIN=VITE_APP_FIREBASE_AUTH_DOMAIN_ENV
ENV VITE_APP_FIREBASE_DATABASE_URL=VITE_APP_FIREBASE_DATABASE_URL_ENV
ENV VITE_APP_FIREBASE_PROJECT_ID=VITE_APP_FIREBASE_PROJECT_ID_ENV
ENV VITE_APP_STORAGE_BUCKET=VITE_APP_STORAGE_BUCKET_ENV
ENV VITE_APP_FIREBASE_MESSAGING_SENDER_ID=VITE_APP_FIREBASE_MESSAGING_SENDER_ID_ENV
ENV VITE_APP_FIREBASE_APP_ID=VITE_APP_FIREBASE_APP_ID_ENV
ENV VITE_APP_FIREBASE_MEASURMENT_ID=VITE_APP_FIREBASE_MEASURMENT_ID_ENV

RUN npm run build

FROM nginx:stable-alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
