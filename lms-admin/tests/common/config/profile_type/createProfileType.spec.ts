import { test } from '@playwright/test';

import { LoginPage } from '../../../../modules/login/loginPage';
import { NavigationPage } from '../../../../modules/base/navigationPage';
import ProfileTypePage from '../../../../modules/common/config/profileTypePage';

import testdata from '../../../../testdata/testdata.json';

test('Create ProfileType - Basic Flow', async ({ page }) => {

  // Initialize pages
  const loginPage = new LoginPage(page);
  const navigationPage = new NavigationPage(page);
  const profileTypePage = new ProfileTypePage(page);

  // Step 1: Open application
  await page.goto('https://uat-admin.mindflix360.com');

  // Step 2: Login
  await loginPage.enterCredentials(
    testdata.login.username,
    testdata.login.password
  );

  // Optional wait
  await page.waitForLoadState('networkidle');

  // Step 3: Navigate
  await navigationPage.navigateTo(
    'Common',
    'CONFIG',
    'ProfileType',
    'ProfileType'
  );

  // Step 4: Create Profile Type
  const data = testdata.createProfileType;

  await profileTypePage.createProfileTypeFlow({
    profileType_id: data.profileType_id,
    profileType_name: data.profileType_name,
    profileType_status: data.profileType_status
  });

});