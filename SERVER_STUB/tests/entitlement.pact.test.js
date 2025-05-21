const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const express = require('express');

// Start your provider API (Express app)
const app = express();
app.use(require('../routes/entitlementRoutes')); // Adjust path if needed

let server;

before(() => {
  server = app.listen(8080, () => {
    console.log('Provider service running on port 8080');
  });
});

after(() => {
  server.close();
});

describe('Pact Verification', () => {
  it('validates the expectations of EntitlementConsumer from PactFlow', async function () {
    if (process.env.PACT_URL) {
      console.log('PACT_URL specified, skipping dynamic verification.');
      return;
    }

    const opts = {
      provider: 'EntitlementProvider',
      providerBaseUrl: 'http://localhost:8080',
      pactBrokerUrl: 'https://nicksdemoorg.pactflow.io', // e.g. https://nicksdemoorg.pactflow.io
      pactBrokerToken: 'wRRUmkd3MsTq3ECkfcD46Q',
      consumerVersionSelectors: [
        { mainBranch: true },
        { deployed: true },
        { matchingBranch: true },
      ],
      enablePending: true,
      includeWipPactsSince: '2020-01-01',
      publishVerificationResult: true,
      providerVersion: process.env.GITHUB_SHA || 'dev-version',
      providerVersionBranch: process.env.GITHUB_REF_NAME || 'local',
      providerVersionTags: [process.env.GITHUB_REF_NAME || 'local'],


      // Required for provider state setup
      stateHandlers: {
        'entitlements exist': async () => {
          // setup logic here (e.g., seed DB or mock service)
          return Promise.resolve();
        },
        'entitlements 5 exists': async () => {
          return Promise.resolve();
        },
        'no entitlement with ID 999 exists': async () => {
          return Promise.resolve();
        },
      },
    };

    await new Verifier(opts).verifyProvider().then((output) => {
      console.log('✅ Pact Verification Complete');
      console.log(output);
    });
  });
});
