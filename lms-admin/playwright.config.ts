import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({

  // Test folder
  testDir: './tests',

  // Common settings for all environments
  use: {

    // Browser should be visible
    headless: false,

    // Use actual browser window size
    viewport: null,

    // Open browser maximized
    launchOptions: {
      args: ['--start-maximized']
    },

    // Capture screenshot only when test fails
    screenshot: 'only-on-failure',

    // Keep trace when test fails
    trace: 'retain-on-failure',

    // Keep video when test fails
    video: 'retain-on-failure'
  },

  // Environment-wise projects
  projects: [

    // =========================
    // UAT
    // =========================
    {
      name: 'UAT',

      use: {
        baseURL: process.env.UAT_BASE_URL
      }
    },

    // =========================
    // STAGE
    // =========================
    {
      name: 'STAGE',

      use: {
        baseURL: process.env.STAGE_BASE_URL
      }
    }

  ],

  // Reports
  reporter: [
    ['html'],
    ['list']
  ]

});