'use strict';

var utils = require('../utils/writer.js');
var Entitlements = require('../service/EntitlementsService');

module.exports.createEntitlement = function createEntitlement (req, res, next, body) {
  Entitlements.createEntitlement(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEntitlementById = function getEntitlementById (req, res, next, entitlementID) {
  Entitlements.getEntitlementById(entitlementID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEntitlements = function getEntitlements (req, res, next, limit, offset, count, total) {
  Entitlements.getEntitlements(limit, offset, count, total)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchEntitlements = function searchEntitlements (req, res, next, body) {
  Entitlements.searchEntitlements(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateEntitlement = function updateEntitlement (req, res, next, body, updateMask, entitlementID) {
  Entitlements.updateEntitlement(body, updateMask, entitlementID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
