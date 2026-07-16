FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite requires the --host flag to expose the network to the Docker container
CMD ["npm", "run", "dev", "--", "--host"]