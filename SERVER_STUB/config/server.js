'use strict';

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Server configuration
 */
module.exports = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1'
};