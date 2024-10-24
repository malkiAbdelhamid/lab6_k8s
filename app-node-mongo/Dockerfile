# Use Node.js as the base image
FROM node:21

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the app source
COPY . .

# Expose the app port
EXPOSE 3000

# Run the app
CMD [ "node", "src/app.js" ]
