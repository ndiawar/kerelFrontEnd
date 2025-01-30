# Étape de construction
FROM node:18.17.1-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY angular.json .
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build application
RUN npm run build -- --configuration production

# Build du serveur SSR
RUN npm run build:ssr

# Étape de production
FROM node:18.17.1-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copier depuis le builder
COPY --from=builder /app/dist/kerel-eco-front/browser ./browser
COPY --from=builder /app/dist/kerel-eco-front/server ./server
COPY --from=builder /app/package*.json ./

# Installer les dépendances de production uniquement
RUN npm ci --omit=dev

# Exposer le port et démarrer l'application
EXPOSE 4000

CMD ["npm", "run", "serve:ssr:KerelEcoFront"]