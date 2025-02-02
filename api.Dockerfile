FROM node:20 AS module_builder

WORKDIR /tmp

COPY devU-shared .

RUN npm install && \
    npm run clean-directory && \
    npm run build-docker

FROM docker.io/python:alpine AS config-builder

WORKDIR /config

RUN apk add --no-cache bash jq openssl \
  && pip install yq

COPY devU-api/scripts/ .

COPY devU-api/config/ ./config

RUN ./generateConfig.sh default.yml

FROM node:20

WORKDIR /app

COPY ./devU-api/package.json ./

RUN npm install

COPY ./devU-api .

COPY --from=config-builder /config/default.yml ./config/default.yml

COPY --from=module_builder /tmp/devu-shared-modules ./devu-shared-modules

# Indicate that the api is running in docker; value here is irrelevant
ENV IS_DOCKER=0

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# TypeORM Migrations
CMD /wait && npm run typeorm -- migration:run -d src/database.ts && npm start

