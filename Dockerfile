FROM node:20-slim

# Install necessary tools for yt-dlp to work (it needs python3 and ffmpeg to extract audio)
RUN apt-get update && apt-get install -y python3 ffmpeg curl && rm -rf /var/lib/apt/lists/*

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
