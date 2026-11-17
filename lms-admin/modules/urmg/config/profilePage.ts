import { Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  readonly addRecordBtn = 'text=Add Record';
  readonly profileId = '[formcontrolname="profile_id"]';
  readonly profileName = '[formcontrolname="profile_name"]';
  readonly profileTypeDropdown = '[formcontrolname="profile_type"]';
  readonly commonTab = 'text=Common';
  readonly urmgTab = 'text=URMG';
  readonly lmsTab = 'text=LMS';
  readonly commonModuleToggle =
    'text=Select Common module >> xpath=.. >> .ant-switch';
  readonly urmgModuleToggle =
    'text=Select User Management module >> xpath=.. >> .ant-switch';
  readonly lmsModuleToggle =
    'text=Select Learner Management System module >> xpath=.. >> .ant-switch';
  readonly submitBtn = 'text=Submit';
  readonly closeBtn = 'text=Close';
  readonly searchBox = 'input[placeholder="Search"]';

  constructor(page: Page) {
    this.page = page;
  }

  dropdownOption(value: string): string {
    return `//nz-option-item[@title="${value}"]`;
  }

  editBtn(id: string): string {
    return `//tr[td[normalize-space()="${id}"]]//span[normalize-space()="Edit"]`;
  }

  viewBtn(id: string): string {
    return `//tr[td[normalize-space()="${id}"]]//span[normalize-space()="View"]`;
  }

  async createProfileFlow(data: {
    profile_id: string;
    profile_name: string;
    profile_type: string;
  }): Promise<void> {
    await this.page.click(this.addRecordBtn);
    await this.page.fill(this.profileId, data.profile_id);
    await this.page.fill(this.profileName, data.profile_name);

    await this.page.click(this.profileTypeDropdown);
    await this.page.click(this.dropdownOption(data.profile_type));

    await this.page.click(this.commonTab);
    await this.page.click(this.commonModuleToggle);

    await this.page.click(this.urmgTab);
    await this.page.click(this.urmgModuleToggle);

    await this.page.click(this.lmsTab);
    await this.page.click(this.lmsModuleToggle);

    await this.page.click(this.submitBtn);
  }

  async updateProfileFlow(data: {
    profile_id: string;
    profile_type: string;
  }): Promise<void> {
    await this.page.fill(this.searchBox, data.profile_id);
    await this.page.keyboard.press('Enter');

    await this.page.click(this.editBtn(data.profile_id));

    await this.page.waitForSelector(this.profileName, {
      state: 'visible',
    });

    await this.page.click(this.profileTypeDropdown);
    await this.page.click(this.dropdownOption(data.profile_type));
  }
}