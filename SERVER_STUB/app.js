'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');


// Import routes
const entitlementRoutes = require('./routes/entitlementRoutes');

// Import error handler
const errorHandler = require('./utils/errorHandler');

// Create Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (if needed)
  next();
});


// API routes
app.use('/entitlements', entitlementRoutes);

// Swagger documentation
try {
  const openApiPath = path.join(__dirname, 'api/openapi.yaml');
  if (fs.existsSync(openApiPath)) {
    const swaggerDocument = YAML.load(openApiPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('OpenAPI documentation available at /docs');
  } else {
    console.warn(`OpenAPI specification not found at ${openApiPath}`);
  }
} catch (error) {
  console.warn('Error loading OpenAPI specification:', error.message);
}

// Homepage with API information
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Entitlements API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          h2 { color: #555; margin-top: 30px; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
          .endpoint { margin-bottom: 20px; }
          .method { display: inline-block; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
          .get { background-color: #61affe; color: white; }
          .post { background-color: #49cc90; color: white; }
          .patch { background-color: #fca130; color: white; }
          .delete { background-color: #f93e3e; color: white; }
        </style>
      </head>
      <body>
        <h1>Entitlements API</h1>
        <p>API for managing entitlements</p>
        
        <h2>Available Endpoints</h2>
        
        <div class="endpoint">
          <span class="method get">GET</span> <code>/entitlements</code>
          <p>List all entitlements with pagination</p>
        </div>
        
        <div class="endpoint">
          <span class="method get">GET</span> <code>/entitlements/:entitlementID</code>
          <p>Get a specific entitlement by ID</p>
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span> <code>/entitlements</code>
          <p>Create a new entitlement</p>
        </div>
        
        <div class="endpoint">
          <span class="method patch">PATCH</span> <code>/entitlements/:entitlementID</code>
          <p>Update an existing entitlement</p>
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span> <code>/entitlements/search</code>
          <p>Search for entitlements based on criteria</p>
        </div>
        
        <div class="endpoint">
          <span class="method delete">DELETE</span> <code>/entitlements/:entitlementID</code>
          <p>Delete an entitlement (optional extension)</p>
        </div>
        
        <h2>API Documentation</h2>
        <p>Explore the full API documentation at <a href="/docs">/docs</a></p>
      </body>
    </html>
  `);
});

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: 'GET,POST,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;