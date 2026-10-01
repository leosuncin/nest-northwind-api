# syntax=docker/dockerfile:1@sha256:4edf897a3ffa55b89f906fc8cc78afdb3f1834cc9c7083565e611a8a7d5fe99e

ARG PNPM_VERSION=12@sha256:30c63e3ab5420b79ef0c46e6785d2eabf678cded04b298c9968ec2cabcd1c2d1

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

FROM ghcr.io/pnpm/pnpm:${PNPM_VERSION} AS migrations

WORKDIR /typeorm

RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    pnpm init && \
    pnpm runtime set node && \
    pnpm shim add node && \
    pnpm add mssql typeorm typeorm-extension

COPY --from=build /usr/src/app/dist .

ENTRYPOINT ["/pnpm/bin/node", "./node_modules/typeorm/cli.js"]

CMD ["migration:run", "-d", "/typeorm/data-source.js"]

FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:2ee7b2c54a3e37dfc248af81c9f6bcdcaa50abe4af44aa47a3388431031b9283

ARG PORT=3000

WORKDIR /app

COPY --from=11notes/distroless:localhealth@sha256:e15dd80e060e87a47885a68f296c5b80a3edb4570f6421672d31dfb71913aa48 /usr/local/bin/localhealth /usr/local/bin/localhealth

COPY package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist .

EXPOSE ${PORT}

USER 65532

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD ["/usr/local/bin/localhealth", "http://localhost:${PORT}"]

CMD ["main.js"]
