# Base image
From node:14-alpine as base

# Build stage
From base as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Final stage
FROM base
WORKDIR /
COPY package*.json ./
COPY --from=builder /app ./
RUN npm install --only=production
EXPOSE 5000
CMD ["server.js"]