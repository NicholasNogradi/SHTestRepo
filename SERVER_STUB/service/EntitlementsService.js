'use strict';


/**
 * Create an entitlement record
 *
 * body Entitlement 
 * returns Entitlement
 **/
exports.createEntitlement = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "end_date" : "2000-01-23",
  "csp_ID" : "csp_ID",
  "quantity" : 2,
  "activation_date" : "2000-01-23",
  "is_eval" : true,
  "entitlementID" : 5,
  "entitlement_version" : "entitlement_version",
  "entitlement_group_ID" : "entitlement_group_ID",
  "uom" : "uom",
  "product_type" : "product_type",
  "term" : "term",
  "source_ID" : "source_ID",
  "sku" : "sku",
  "ship_date" : "2000-01-23",
  "start_date" : "2000-01-23",
  "status" : "FULFILLED"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retrieve entitlement records based on filter criteria
 *
 * limit Integer The number of items to return (optional)
 * offset Integer The number of items to skip before returning the results (optional)
 * count Integer The count of items returned (optional)
 * total Integer  (optional)
 * returns inline_response_200
 **/
exports.getEntitlements = function(limit,offset,count,total) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "total" : 5,
  "offset" : 6,
  "data" : [ {
    "end_date" : "2000-01-23",
    "csp_ID" : "csp_ID",
    "quantity" : 2,
    "activation_date" : "2000-01-23",
    "is_eval" : true,
    "entitlementID" : 5,
    "entitlement_version" : "entitlement_version",
    "entitlement_group_ID" : "entitlement_group_ID",
    "uom" : "uom",
    "product_type" : "product_type",
    "term" : "term",
    "source_ID" : "source_ID",
    "sku" : "sku",
    "ship_date" : "2000-01-23",
    "start_date" : "2000-01-23",
    "status" : "FULFILLED"
  }, {
    "end_date" : "2000-01-23",
    "csp_ID" : "csp_ID",
    "quantity" : 2,
    "activation_date" : "2000-01-23",
    "is_eval" : true,
    "entitlementID" : 5,
    "entitlement_version" : "entitlement_version",
    "entitlement_group_ID" : "entitlement_group_ID",
    "uom" : "uom",
    "product_type" : "product_type",
    "term" : "term",
    "source_ID" : "source_ID",
    "sku" : "sku",
    "ship_date" : "2000-01-23",
    "start_date" : "2000-01-23",
    "status" : "FULFILLED"
  } ],
  "limit" : 0,
  "count" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Search entitlement records
 *
 * body Entitlements_search_body 
 * returns inline_response_200_1
 **/
exports.searchEntitlements = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "results" : [ {
    "end_date" : "2000-01-23",
    "csp_ID" : "csp_ID",
    "quantity" : 2,
    "activation_date" : "2000-01-23",
    "is_eval" : true,
    "entitlementID" : 5,
    "entitlement_version" : "entitlement_version",
    "entitlement_group_ID" : "entitlement_group_ID",
    "uom" : "uom",
    "product_type" : "product_type",
    "term" : "term",
    "source_ID" : "source_ID",
    "sku" : "sku",
    "ship_date" : "2000-01-23",
    "start_date" : "2000-01-23",
    "status" : "FULFILLED"
  }, {
    "end_date" : "2000-01-23",
    "csp_ID" : "csp_ID",
    "quantity" : 2,
    "activation_date" : "2000-01-23",
    "is_eval" : true,
    "entitlementID" : 5,
    "entitlement_version" : "entitlement_version",
    "entitlement_group_ID" : "entitlement_group_ID",
    "uom" : "uom",
    "product_type" : "product_type",
    "term" : "term",
    "source_ID" : "source_ID",
    "sku" : "sku",
    "ship_date" : "2000-01-23",
    "start_date" : "2000-01-23",
    "status" : "FULFILLED"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update an entitlement record
 *
 * body Entitlement 
 * updateMask String 
 * entitlementID Integer 
 * returns Entitlement
 **/
exports.updateEntitlement = function(body,updateMask,entitlementID) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "end_date" : "2000-01-23",
  "csp_ID" : "csp_ID",
  "quantity" : 2,
  "activation_date" : "2000-01-23",
  "is_eval" : true,
  "entitlementID" : 5,
  "entitlement_version" : "entitlement_version",
  "entitlement_group_ID" : "entitlement_group_ID",
  "uom" : "uom",
  "product_type" : "product_type",
  "term" : "term",
  "source_ID" : "source_ID",
  "sku" : "sku",
  "ship_date" : "2000-01-23",
  "start_date" : "2000-01-23",
  "status" : "FULFILLED"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

