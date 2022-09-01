#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

echo "Replacing ENV variables"

for file in $ROOT_DIR/js/app.*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  # Replacing ENV variables if specified
  sed -i 's|VUE_APP_PUBLIC_PATH_ENV|'${VUE_APP_PUBLIC_PATH}'|g' $file
  sed -i 's|VUE_APP_API_KEY_ENV|'${VUE_APP_API_KEY:-none1}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_API_KEY_ENV|'${VUE_APP_FIREBASE_API_KEY:-none2}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_AUTH_DOMAIN_ENV|'${VUE_APP_FIREBASE_AUTH_DOMAIN:-none3}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_DATABASE_URL_ENV|'${VUE_APP_FIREBASE_DATABASE_URL:-none4}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_PROJECT_ID_ENV|'${VUE_APP_FIREBASE_PROJECT_ID:-none5}'|g' $file
  sed -i 's|VUE_APP_STORAGE_BUCKET_ENV|'${VUE_APP_STORAGE_BUCKET:-none6}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_MESSAGING_SENDER_ID_ENV|'${VUE_APP_FIREBASE_MESSAGING_SENDER_ID:-none7}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_APP_ID_ENV|'${VUE_APP_FIREBASE_APP_ID:-none8}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_MEASURMENT_ID_ENV|'${VUE_APP_FIREBASE_MEASURMENT_ID:-none9}'|g' $file

done

nginx -g "daemon off;"
