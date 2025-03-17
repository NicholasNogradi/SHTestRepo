'use strict';

const express = require('express');
const router = express.Router();
const entitlementController = require('../controllers/entitlementController');

/**
 * Entitlement routes
 */

// GET /entitlements - Get all entitlements with pagination
router.get('/', entitlementController.getEntitlements);

// GET /entitlements/:entitlementID - Get entitlement by ID
router.get('/:entitlementID', entitlementController.getEntitlementById);

// POST /entitlements - Create a new entitlement
router.post('/', entitlementController.createEntitlement);

// PATCH /entitlements/:entitlementID - Update an entitlement (partial update)
router.patch('/:entitlementID', entitlementController.updateEntitlement);

// POST /entitlements/search - Search entitlements
router.post('/search', entitlementController.searchEntitlements);

// Additional route (optional - not in original API spec):
// DELETE /entitlements/:entitlementID - Delete an entitlement
router.delete('/:entitlementID', entitlementController.deleteEntitlement);

module.exports = router;