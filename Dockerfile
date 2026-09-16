# syntax=docker/dockerfile:1@sha256:ecfaec9ed6d810b56388c508f4121597bfbba70d41a6dfeee4d8cad5f295fc32

ARG PNPM_VERSION=12@sha256:f37ab4b175b5b3bcd8f7334287f908959b09a849b73d5e13678d9fa70ffdb246

FROM ghcr.io/pnpm/pnpm:${PNPM_VERSION} AS deps

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    --mount=type=bind,source=package.json,target=/usr/src/app/package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=/usr/src/app/pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=/usr/src/app/pnpm-workspace.yaml \
    pnpm shim add node && \
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

FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:ea845027bc638317c4b14a8969cc931efc7546ecabb2de1e4dfb2fee835cca2c AS migrations

WORKDIR /typeorm

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/database/migrations ./migrations

ENTRYPOINT ["/nodejs/bin/node", "./node_modules/typeorm/cli.js"]

CMD ["migration:run", "-d", "/typeorm/data-source.js"]

FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:ea845027bc638317c4b14a8969cc931efc7546ecabb2de1e4dfb2fee835cca2c

ARG PORT=3000

WORKDIR /app

COPY package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist .

EXPOSE ${PORT}

CMD ["main.js"]
