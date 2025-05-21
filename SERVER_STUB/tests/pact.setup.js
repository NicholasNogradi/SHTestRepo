const controller = require('../controllers/entitlementController');
const Entitlement = require('../models/entitlementModel')


const baseOpts = {
    logLevel: "INFO",
    providerBaseUrl: "http://localhost:8080",
    providerVersion: process.env.GIT_COMMIT,
    providerVersionBranch: process.env.GIT_BRANCH, // the recommended way of publishing verification results with the branch property
    verbose: process.env.VERBOSE === "true",
};