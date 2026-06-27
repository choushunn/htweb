# Build stage
FROM node:22-alpine AS builder

RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

COPY package.json ./

RUN npm install

COPY prisma/ ./prisma/
RUN npx prisma generate

COPY tsconfig.json ./
COPY src/ ./src/

RUN npx tsc

# Run stage
FROM node:22-alpine AS runner

RUN apk add --no-cache wget

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY package.json ./

RUN npm prune --omit=dev && npx prisma generate

EXPOSE 3001

CMD ["node", "dist/index.js"]
