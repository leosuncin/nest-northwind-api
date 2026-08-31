# syntax=docker/dockerfile:1

ARG NODE_VERSION=26-slim

FROM node:${NODE_VERSION} AS deps

ENV PNPM_HOME="/pnpm"

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    --mount=type=bind,source=package.json,target=/usr/src/app/package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=/usr/src/app/pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=/usr/src/app/pnpm-workspace.yaml \
    npm install -g pnpm && \
    pnpm install --frozen-lockfile

FROM deps AS build

COPY ./src ./src

RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    --mount=type=bind,source=package.json,target=/usr/src/app/package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=/usr/src/app/pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=/usr/src/app/pnpm-workspace.yaml \
    --mount=type=bind,source=tsconfig.json,target=/usr/src/app/tsconfig.json \
    --mount=type=bind,source=tsconfig.build.json,target=/usr/src/app/tsconfig.build.json \
    pnpm run build && \
    pnpm prune --prod && \
    pnpm dlx node-prune

FROM gcr.io/distroless/nodejs26-debian13:nonroot AS migrations

WORKDIR /typeorm

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/database/migrations ./migrations

ENTRYPOINT ["/nodejs/bin/node", "./node_modules/typeorm/cli.js"]

CMD ["migration:run", "-d", "/typeorm/data-source.js"]

FROM gcr.io/distroless/nodejs26-debian13:nonroot

ARG PORT=3000

WORKDIR /app

COPY package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist .

EXPOSE ${PORT}

CMD ["main.js"]
