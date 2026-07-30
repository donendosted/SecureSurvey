FROM node:20-alpine AS base
RUN npm i -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-sdk/package.json ./packages/shared-sdk/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm build

FROM base AS backend
WORKDIR /app
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/shared-types ./packages/shared-types/
COPY --from=builder /app/packages/shared-sdk ./packages/shared-sdk/
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "packages/backend/dist/index.js"]

FROM nginx:alpine AS frontend
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
