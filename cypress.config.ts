import { defineConfig } from "cypress";
require('dotenv').config()

export default defineConfig({
  e2e: {
    specPattern: 'cypress/tests/**/*.test.ts',
    env: {
      CYPRESS_API_URL: process.env.CYPRESS_API_URL
    }
  },
});
