# Use official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git and other dependencies
RUN apk add --no-cache git bash

# Copy package files (when they exist)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose ports
# 3000 for development server
# 5173 for Vite dev server (if using Vite)
EXPOSE 3000 5173 8080

# Default command
CMD ["npm", "run", "dev"]
