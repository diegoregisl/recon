FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (we need devDependencies for the build process)
RUN npm install

# Copy source code
COPY . .

# Build the frontend (Vite) and backend (esbuild)
RUN npm run build

# Remove development dependencies to save space
RUN npm prune --production

# Expose the standard port the server listens on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
