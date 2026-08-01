# Use Node.js 20 as the base image (non-alpine to avoid some compatibility issues)
FROM node:20 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Remove esbuild and reinstall it to ensure proper platform-specific binary
RUN rm -rf node_modules/esbuild
RUN npm install esbuild

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Production stage: Use a lightweight web server
FROM nginx:alpine AS production

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy custom nginx configuration to serve the React app properly
RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
}' > /etc/nginx/conf.d/react-app.conf

# Expose port 80 (standard HTTP port)
EXPOSE 80

# Start nginx to serve the React application
CMD ["nginx", "-g", "daemon off;"]