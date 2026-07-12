FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS=--max_old_space_size=1024

COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci --omit=dev --no-audit --no-fund && npm ci --prefix frontend --no-audit --no-fund

COPY . .
RUN npm run build --prefix frontend

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 4000

CMD ["node", "backend/index.js"]
