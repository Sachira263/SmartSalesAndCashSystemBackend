# Dockerfile
FROM node:22-alpine

# working folder creation
WORKDIR /app

# pa
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# expose the port the server runs on
EXPOSE 5001

# start the server
CMD ["node", "src/server.js"]

















