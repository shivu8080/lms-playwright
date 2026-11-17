const { test } = require('@playwright/test');
const LoginPage = require('../../../../modules/login/loginPage');
const NavigationPage = require('../../../../modules/base/navigationPage');
const ProfilePage = require('../../../../modules/urmg/config/profilePage');
const testdata = require('../../../../testdata/testdata.json');

test('Update Profile - Basic Flow', async ({ page }) => {

    // Initialize pages
    const loginPage = new LoginPage(page);
    const navigationPage = new NavigationPage(page);
    const profilePage = new ProfilePage(page);

    // Step 1: Open application
    await page.goto('https://uat-admin.mindflix360.com');

    // Step 2: Login
    await loginPage.enterCredentials(
        testdata.login.username,
        testdata.login.password
    );

    // Optional wait (better replace with proper wait later)
    await page.waitForLoadState('networkidle');

    // Step 3: Navigate
    await navigationPage.navigateTo(
        'URMG',
        'CONFIG',
        'Profile',
        'Profile' // submenu
    );

    // Step 4: Click Add Record
    const data = testdata.updateProfile;
    await profilePage.updateProfileFlow({
        profile_id: data.profile_id,
        profile_name: data.profile_name,
        profile_type: data.profile_type
    });

});