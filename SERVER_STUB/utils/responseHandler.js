'use strict';

/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Response data
 * @param {string} message - Success message
 */
exports.success = function(res, statusCode = 200, data = null, message = 'Success') {
  const response = {
    status: 'success',
    message
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Paginated response format
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} count - Number of items returned
 * @param {number} total - Total number of items available
 * @param {number} limit - Maximum number of items per page
 * @param {number} offset - Starting position
 * @param {number} statusCode - HTTP status code
 */
exports.paginated = function(res, data, count, total, limit = 20, offset = 0, statusCode = 200) {
  res.status(statusCode).json({
    data,
    count,
    total,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} error - Error details (optional)
 */
exports.error = function(res, statusCode = 500, message = 'Internal Server Error', error = null) {
  const response = {
    status: 'error',
    message
  };

  if (error && process.env.NODE_ENV !== 'production') {
    response.error = error.toString();
  }

  res.status(statusCode).json(response);
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
exports.notFound = function(res, message = 'Resource not found') {
  exports.error(res, 404, message);
};