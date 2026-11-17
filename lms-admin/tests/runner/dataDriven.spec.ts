import { test } from '@playwright/test';
import path from 'path';

import ExcelReader, { ExcelRow } from '../../utils/excelReader';
import { LoginPage } from '../../modules/login/loginPage';
import { NavigationPage } from '../../modules/base/navigationPage';

import InstitutePage from '../../modules/common/config/institutePage';
import ProfileTypePage from '../../modules/common/config/profileTypePage';
import { ProfilePage } from '../../modules/urmg/config/profilePage';

interface TestCase extends ExcelRow {
  test_case: string;
  scenario: string;
  module: string;
  feature: string;
  menu: string;
  submenu: string;
  operation: string;
  data_key: string;
  expected_result: string;
  test_type: string;
  priority: string;
  enabled: string;
  tags: string;
}

interface ExcelData extends ExcelRow {
  data_key: string;
}

interface MenuConfig {
  data: ExcelData[];
  page: any;
  actions: Record<string, string>;
}

const filePath = path.resolve(
  process.cwd(),
  'testdata',
  'testdata.xlsx'
);

const workbook = ExcelReader.loadWorkbook(filePath);

const testCases = ExcelReader.getData<TestCase>(
  workbook,
  'TestCases'
);

const institutionData = ExcelReader.getData<ExcelData>(
  workbook,
  'Institution'
);

const profileData = ExcelReader.getData<ExcelData>(
  workbook,
  'Profile'
);

const profileTypeData = ExcelReader.getData<ExcelData>(
  workbook,
  'ProfileType'
);

console.log('Loaded TestCases:', testCases.length);

if (!testCases.length) {
  throw new Error('No test cases found in Excel');
}

function getCredentials(
  environment: string
): {
  username: string;
  password: string;
} {
  let username: string | undefined;
  let password: string | undefined;

  if (environment.toUpperCase() === 'UAT') {
    username = process.env.UAT_USERNAME;
    password = process.env.UAT_PASSWORD;
  } else if (environment.toUpperCase() === 'STAGE') {
    username = process.env.STAGE_USERNAME;
    password = process.env.STAGE_PASSWORD;
  } else {
    throw new Error(`Unsupported environment: ${environment}`);
  }

  if (!username || !password) {
    throw new Error(
      `Username or password missing for environment: ${environment}`
    );
  }

  return {
    username,
    password
  };
}

testCases
  .filter(
    tc =>
      String(tc.enabled ?? '')
        .trim()
        .toUpperCase() === 'YES'
  )
  .forEach((tc: TestCase) => {
    const testCaseId = String(tc.test_case).trim();
    const scenario = String(tc.scenario ?? '').trim();
    const menu = String(tc.menu).trim();
    const operation = String(tc.operation)
      .trim()
      .toLowerCase();

    test(
      `${testCaseId} | ${operation} | ${menu} | ${scenario}`,
      async ({ page }, testInfo) => {
        const loginPage = new LoginPage(page);
        const navigationPage = new NavigationPage(page);

        const environment = testInfo.project.name;
        const credentials = getCredentials(environment);

        await page.goto('/');

        await loginPage.enterCredentials(
          credentials.username,
          credentials.password
        );

        const moduleName = String(tc.module ?? '').trim();

        const featureValue = String(tc.feature ?? '').trim();

        const feature = featureValue
          ? featureValue
          : undefined;

        const submenuValue = String(tc.submenu ?? '').trim();

        const submenu = submenuValue
          ? submenuValue
          : menu;

        await navigationPage.navigateTo(
          moduleName,
          feature,
          menu,
          submenu
        );

        const menuConfig: Record<string, MenuConfig> = {
          Institution: {
            data: institutionData,
            page: new InstitutePage(page),
            actions: {
              create: 'createInstituteFlow',
              update: 'updateInstituteFlow',
              view: 'viewInstituteFlow',
              delete: 'deleteInstituteFlow'
            }
          },

          Profile: {
            data: profileData,
            page: new ProfilePage(page),
            actions: {
              create: 'createProfileFlow'
            }
          },

          ProfileType: {
            data: profileTypeData,
            page: new ProfileTypePage(page),
            actions: {
              create: 'createProfileTypeFlow',
              view: 'viewProfileTypeFlow',
              edit: 'editProfileTypeFlow',
              delete: 'deleteProfileTypeFlow'
            }
          }
        };

        const config = menuConfig[menu];

        if (!config) {
          throw new Error(
            `Unsupported menu: ${menu}`
          );
        }

        const dataKey = String(
          tc.data_key ?? ''
        ).trim();

        if (!dataKey) {
          throw new Error(
            `data_key missing for test case: ${testCaseId}`
          );
        }

        const data = ExcelReader.getDataByKey(
          config.data,
          dataKey
        );

        const action = config.actions[operation];

        if (!action) {
          throw new Error(
            `Unsupported operation "${operation}" for menu "${menu}"`
          );
        }

        console.log('--------------------------------------');
        console.log(`Environment     : ${environment}`);
        console.log(`Test Case       : ${testCaseId}`);
        console.log(`Scenario        : ${scenario}`);
        console.log(`Module          : ${moduleName}`);
        console.log(`Feature         : ${feature ?? 'NONE'}`);
        console.log(`Menu            : ${menu}`);
        console.log(`Submenu         : ${submenu}`);
        console.log(`Operation       : ${operation}`);
        console.log(`Data Key        : ${dataKey}`);
        console.log(`Expected Result : ${tc.expected_result}`);
        console.log('--------------------------------------');

        await config.page[action](data);
      }
    );
  });