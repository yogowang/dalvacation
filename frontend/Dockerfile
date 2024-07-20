# Use Node.js image as base
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Install serve to serve the static build files
RUN npm install -g serve

# Expose port 5000 (or whichever port your app uses)
EXPOSE 5000

# Command to serve the React app
CMD ["serve", "-s", "build", "-l", "5000"]


docker tag react-app gcr.io/dalvacationhome-429720/react-app
