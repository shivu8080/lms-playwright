import { test } from '@playwright/test';

import { LoginPage } from '../../../../modules/login/loginPage';
import { NavigationPage } from '../../../../modules/base/navigationPage';
import { ProfilePage } from '../../../../modules/urmg/config/profilePage';

import testdata from '../../../../testdata/testdata.json';

test('Create Profile - Basic Flow', async ({ page }) => {

  // Initialize pages
  const loginPage = new LoginPage(page);
  const navigationPage = new NavigationPage(page);
  const profilePage = new ProfilePage(page);

  // Open application
  await page.goto('https://uat-admin.mindflix360.com');

  // Login
  await loginPage.enterCredentials(
    testdata.login.username,
    testdata.login.password
  );

  await page.waitForLoadState('networkidle');

  // Navigate
  await navigationPage.navigateTo(
    'URMG',
    'CONFIG',
    'Profile',
    'Profile'
  );

  // Create Profile
  const data = testdata.createProfile;

  await profilePage.createProfileFlow({
    profile_id: data.profile_id,
    profile_name: data.profile_name,
    profile_type: data.profile_type
  });

});