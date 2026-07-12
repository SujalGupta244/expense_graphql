FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend ./backend
COPY frontend/dist ./frontend/dist    # ← Copies pre-built dist from GitHub Actions

EXPOSE 4000

CMD ["node", "backend/index.js"]