'use strict';

const entitlementModel = require('../models/entitlementModel');
const responseHandler = require('../utils/responseHandler');
const { BadRequestError } = require('../utils/errorHandler');

/**
 * Controller for Entitlement operations
 */
class EntitlementController {
  /**
   * Create a new entitlement
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createEntitlement(req, res, next) {
    try {
      const entitlement = await entitlementModel.create(req.body);
      responseHandler.success(res, 201, entitlement, 'Entitlement created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get an entitlement by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getEntitlementById(req, res, next) {
    try {
      const entitlementID = req.params.entitlementID;
      if (!entitlementID) {
        throw new BadRequestError('Entitlement ID is required');
      }
      
      const entitlement = await entitlementModel.getById(entitlementID);
      responseHandler.success(res, 200, entitlement);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all entitlements with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getEntitlements(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      
      const result = await entitlementModel.getAll(limit, offset);
      
      responseHandler.paginated(
        res, 
        result.data, 
        result.count, 
        result.total, 
        result.limit, 
        result.offset
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search entitlements based on criteria
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async searchEntitlements(req, res, next) {
    try {
      const { criteria = {}, limit = 20, offset = 0 } = req.body;
      
      const result = await entitlementModel.search(criteria, limit, offset);
      
      responseHandler.paginated(
        res, 
        result.data, 
        result.count, 
        result.total, 
        result.limit, 
        result.offset
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an entitlement
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateEntitlement(req, res, next) {
    try {
      const entitlementID = req.params.entitlementID;
      const updateMask = req.query.updateMask;
      
      if (!entitlementID) {
        throw new BadRequestError('Entitlement ID is required');
      }

      const entitlement = await entitlementModel.update(entitlementID, req.body, updateMask);
      responseHandler.success(res, 200, entitlement, 'Entitlement updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an entitlement
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteEntitlement(req, res, next) {
    try {
      const entitlementID = req.params.entitlementID;
      
      if (!entitlementID) {
        throw new BadRequestError('Entitlement ID is required');
      }

      await entitlementModel.delete(entitlementID);
      responseHandler.success(res, 200, null, 'Entitlement deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EntitlementController();