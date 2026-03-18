#!/usr/bin/env bash

set -eu

PROJECT_ROOT="/root/starplus/starplus"
MONGO_HOST="127.0.0.1"
MONGO_PORT="27017"

cd "$PROJECT_ROOT"
docker compose up -d mongodb

for _ in $(seq 1 30); do
  if nc -z "$MONGO_HOST" "$MONGO_PORT" >/dev/null 2>&1; then
    exit 0
  fi
  sleep 1
done

echo "MongoDB did not become ready at ${MONGO_HOST}:${MONGO_PORT}" >&2
exit 1