# Mazooq Foods - container for Google Cloud Run
# Builds the website (Vite) and runs server.js (site + APIs) on the port Cloud Run gives us.
# On Cloud Run the database is Google Firestore automatically (see server/admin-store.js).

FROM node:24-slim

WORKDIR /app

# Install dependencies first (better build caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project and build the site
COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
# Cloud Run sets PORT (usually 8080); server.js reads it.
EXPOSE 8080
CMD ["node", "server.js"]
