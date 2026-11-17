import { test } from '@playwright/test';

import { LoginPage } from '../../../../modules/login/loginPage';
import { NavigationPage } from '../../../../modules/base/navigationPage';
import InstitutePage from '../../../../modules/common/config/institutePage';

import testdata from '../../../../testdata/testdata.json';

test('Create Institution - Basic Flow', async ({ page }) => {

  // Initialize Page Objects
  const loginPage = new LoginPage(page);
  const navigationPage = new NavigationPage(page);
  const institutePage = new InstitutePage(page);

  // Step 1: Open application
  await page.goto('https://uat-admin.mindflix360.com');

  // Step 2: Login
  await loginPage.enterCredentials(
    testdata.login.username,
    testdata.login.password
  );

  // Step 3: Navigate
  await navigationPage.navigateTo(
    'Common',
    undefined, // 'CONFIG' - currently removed by development team
    'Institution',
    'Institution'
  );

  // Step 4: Get Create Institution test data
  const data = testdata.createInstitution;

  // Step 5: Create Institution
  await institutePage.createInstituteFlow({
    institution_id: data.institution_id,
    institution_name: data.institution_name,
    institution_type: data.institution_type,
    institution_status: data.institution_status
  });

});