import { test } from '@playwright/test';

import { LoginPage } from '../../modules/login/loginPage';

test.describe('Login Test Cases', () => {

  test('Valid Login', async ({ page }, testInfo) => {

    const loginPage =
      new LoginPage(page);

    // Get selected Playwright project
    // UAT or STAGE
    const environment =
      testInfo.project.name.toUpperCase();

    let username: string | undefined;
    let password: string | undefined;

    // UAT Credentials
    if (environment === 'UAT') {
      username =
        process.env.UAT_USERNAME;

      password =
        process.env.UAT_PASSWORD;
    }

    // STAGE Credentials
    else if (environment === 'STAGE') {
      username =
        process.env.STAGE_USERNAME;

      password =
        process.env.STAGE_PASSWORD;
    }

    // Unsupported environment
    else {
      throw new Error(
        `Unsupported environment: ${environment}`
      );
    }

    // Validate credentials
    if (!username || !password) {
      throw new Error(
        `Username or password missing for environment: ${environment}`
      );
    }

    // Open application using baseURL
    await page.goto('/');

    // Login
    await loginPage.enterCredentials(
      username,
      password
    );

  });

});