'use strict';

const { pool } = require('../config/database');
const { NotFoundError } = require('../utils/errorHandler');

/**
 * Entitlement Model - Handles all database operations for entitlements
 */
class EntitlementModel {
  /**
   * Create a new entitlement
   * @param {Object} entitlement - Entitlement data
   * @returns {Promise<Object>} Created entitlement
   */
  async create(entitlement) {
    try {
      // Extract fields from the entitlement object
      const {
        csp_ID = null, 
        quantity = null, 
        activation_date = null, 
        end_date = null, 
        is_eval = false,
        entitlement_version = null, 
        entitlement_group_ID = null, 
        uom = null, 
        product_type = null,
        term = null, 
        source_ID = null, 
        sku = null, 
        ship_date = null, 
        start_date = null, 
        status = 'PENDING'
      } = entitlement;

      const [result] = await pool.execute(
        `INSERT INTO entitlements (
          csp_ID, quantity, activation_date, end_date, is_eval,
          entitlement_version, entitlement_group_ID, uom, product_type,
          term, source_ID, sku, ship_date, start_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          csp_ID, quantity, activation_date, end_date, is_eval,
          entitlement_version, entitlement_group_ID, uom, product_type,
          term, source_ID, sku, ship_date, start_date, status
        ]
      );

      // Get the newly created entitlement
      return this.getById(result.insertId);
    } catch (error) {
      console.error('Error creating entitlement:', error);
      throw error;
    }
  }

  /**
   * Get entitlement by ID
   * @param {number} id - Entitlement ID
   * @returns {Promise<Object>} Entitlement object
   * @throws {NotFoundError} If entitlement not found
   */
  async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM entitlements WHERE entitlementID = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new NotFoundError(`Entitlement with ID ${id} not found`);
      }

      return rows[0];
    } catch (error) {
      console.error(`Error getting entitlement ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all entitlements with pagination
   * @param {number} limit - Maximum number of items to return
   * @param {number} offset - Number of items to skip
   * @returns {Promise<Object>} Paginated entitlements
   */
  async getAll(limit = 20, offset = 0) {
    try {
      // Get total count of entitlements
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM entitlements');
      const total = countResult[0].total;

      const safeLimit = parseInt(limit, 10);
      const safeOffset = parseInt(offset, 10);

      // Get paginated entitlements
      const [rows] = await pool.execute(
        `SELECT * FROM entitlements ORDER BY entitlementID LIMIT ${safeLimit} OFFSET ${safeOffset}`
      );

      return {
        data: rows,
        count: rows.length,
        total,
        limit: safeLimit,
        offset: safeOffset
      };
    } catch (error) {
      console.error('Error getting entitlements:', error);
      throw error;
    }
  }

  /**
   * Search entitlements based on criteria
   * @param {Object} criteria - Search criteria
   * @param {number} limit - Maximum number of items to return
   * @param {number} offset - Number of items to skip
   * @returns {Promise<Object>} Search results
   */
  async search(criteria = {}, limit = 20, offset = 0) {
    try {
      // Build WHERE clause based on search criteria
      let whereConditions = [];
      let params = [];

      if (criteria.sku) {
        whereConditions.push('sku = ?');
        params.push(criteria.sku);
      }

      if (criteria.status) {
        whereConditions.push('status = ?');
        params.push(criteria.status);
      }

      if (criteria.csp_ID) {
        whereConditions.push('csp_ID = ?');
        params.push(criteria.csp_ID);
      }

      if (criteria.start_date_from) {
        whereConditions.push('start_date >= ?');
        params.push(criteria.start_date_from);
      }

      if (criteria.start_date_to) {
        whereConditions.push('start_date <= ?');
        params.push(criteria.start_date_to);
      }

      if (criteria.end_date_from) {
        whereConditions.push('end_date >= ?');
        params.push(criteria.end_date_from);
      }

      if (criteria.end_date_to) {
        whereConditions.push('end_date <= ?');
        params.push(criteria.end_date_to);
      }

      // Construct the query
      let countQuery = 'SELECT COUNT(*) as total FROM entitlements';
      let dataQuery = 'SELECT * FROM entitlements';

      if (whereConditions.length > 0) {
        const whereClause = 'WHERE ' + whereConditions.join(' AND ');
        countQuery += ' ' + whereClause;
        dataQuery += ' ' + whereClause;
      }

      dataQuery += ' ORDER BY entitlementID LIMIT ? OFFSET ?';
      params.push(Number(limit), Number(offset));

      // Execute queries
      const [countResult] = await pool.execute(countQuery, params.slice(0, params.length - 2));
      const [rows] = await pool.execute(dataQuery, params);

      return {
        data: rows,
        count: rows.length,
        total: countResult[0].total,
        limit: Number(limit),
        offset: Number(offset)
      };
    } catch (error) {
      console.error('Error searching entitlements:', error);
      throw error;
    }
  }

  /**
   * Update an entitlement
   * @param {number} id - Entitlement ID 
   * @param {Object} updates - Fields to update
   * @param {string} updateMask - Comma-separated list of fields to update
   * @returns {Promise<Object>} Updated entitlement
   * @throws {NotFoundError} If entitlement not found
   */
  async update(id, updates, updateMask) {
    try {
      // Check if entitlement exists
      await this.getById(id);

      // Determine which fields to update
      const allowedFields = [
        'csp_ID', 'quantity', 'activation_date', 'end_date', 'is_eval',
        'entitlement_version', 'entitlement_group_ID', 'uom', 'product_type',
        'term', 'source_ID', 'sku', 'ship_date', 'start_date', 'status'
      ];

      let fieldsToUpdate = allowedFields;
      
      // If updateMask is specified, use it to filter fields
      if (updateMask) {
        const requestedFields = updateMask.split(',').map(field => field.trim());
        fieldsToUpdate = allowedFields.filter(field => requestedFields.includes(field));
      }

      // Build SET clause for UPDATE query
      const setClause = fieldsToUpdate
        .filter(field => updates[field] !== undefined)
        .map(field => `${field} = ?`)
        .join(', ');

      // If no fields to update, return existing record
      if (setClause.length === 0) {
        return this.getById(id);
      }

      // Get parameter values for SET clause
      const params = fieldsToUpdate
        .filter(field => updates[field] !== undefined)
        .map(field => updates[field]);

      // Add ID parameter
      params.push(id);

      // Execute update query
      await pool.execute(
        `UPDATE entitlements SET ${setClause} WHERE entitlementID = ?`,
        params
      );

      // Return updated record
      return this.getById(id);
    } catch (error) {
      console.error('Error updating entitlement:', error);
      throw error;
    }
  }

  /**
   * Delete an entitlement
   * @param {number} id - Entitlement ID
   * @returns {Promise<boolean>} Success status
   * @throws {NotFoundError} If entitlement not found
   */
  async delete(id) {
    try {
      // Check if entitlement exists
      await this.getById(id);

      // Delete the entitlement
      await pool.execute('DELETE FROM entitlements WHERE entitlementID = ?', [id]);
      
      return true;
    } catch (error) {
      console.error('Error deleting entitlement:', error);
      throw error;
    }
  }
}

module.exports = new EntitlementModel();