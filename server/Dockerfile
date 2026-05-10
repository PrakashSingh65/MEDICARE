# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for hot-reload
RUN npm install -g nodemon

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Run with nodemon for live reload
CMD ["nodemon", "server.js"]