'use strict';

const http = require('http');
const app = require('./app');
const config = require('./config/server');
const { testConnection } = require('./config/database');

/**
 * Start the server
 */
async function startServer() {
  try {
    // Test database connection if not in test mode
    if (process.env.NODE_ENV !== 'test') {
      console.log('Testing database connection...');
      
      // Comment this out if you want to start without database
      const isConnected = await testConnection();
      if (!isConnected) {
        console.error('Failed to connect to the database. Please check your configuration.');
        process.exit(1);
      }
      
      // For now, we'll skip the database connection check
      console.log('Starting server without database connection check...');
    }
    
    // Create HTTP server and listen on port
    const server = http.createServer(app);
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.env}`);
      console.log(`API version: ${config.apiVersion}`);
      console.log(`Server URL: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();