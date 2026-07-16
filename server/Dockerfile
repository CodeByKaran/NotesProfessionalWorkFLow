# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# Install ALL dependencies (including devDependencies like typescript)
RUN npm ci 
COPY . .
# Compile TS to JS in the /dist folder
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Install ONLY production dependencies
RUN npm ci --omit=dev
# Copy the compiled JS from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]