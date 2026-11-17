import { Page } from '@playwright/test';

interface ProfileTypeData {
  profileType_id: string;
  profileType_name: string;
  profileType_status: string;
}
interface DeleteProfileTypeData {
  profileType_id: string;
}

interface ViewProfileTypeData {
  profileType_id: string;
}

class ProfileTypePage {
  readonly page: Page;

  readonly addRecordBtn: string;
  readonly profileTypeId: string;
  readonly profileTypeName: string;
  readonly profileTypeStatusDropdown: string;
  readonly dropdownOption: (value: string) => string;
  readonly submitBtn: string;
  readonly updateBtn: string;
  readonly editBtn: (id: string) => string;
  readonly deleteBtn: (id: string) => string;
  readonly viewBtn: (id: string) => string;
  readonly closeBtn: string;

  constructor(page: Page) {
    this.page = page;

    this.addRecordBtn = 'text=Add Record';
    this.profileTypeId = '[formcontrolname="profile_type_id"]';
    this.profileTypeName = '[formcontrolname="profile_type_name"]';
    this.profileTypeStatusDropdown =
      '[formcontrolname="profile_type_status"]';

    this.dropdownOption = (value: string) =>
      `//nz-option-item[@title="${value}"]`;

    this.submitBtn = 'text="Submit"';
    this.updateBtn = 'text=Update';

    this.editBtn = (id: string) =>
      `//tr[td[normalize-space()="${id}"]]//span[normalize-space()="Edit"]`;

    this.deleteBtn = (id: string) =>
      `//tr[td[normalize-space()="${id}"]]//span[normalize-space()="Delete"]`;

    this.viewBtn = (id: string) =>
      `//tr[td[normalize-space()="${id}"]]//span[normalize-space()="View"]`;

    this.closeBtn = 'text=Close';
  }

  async createProfileTypeFlow(data: ProfileTypeData): Promise<void> {
    await this.page.click(this.addRecordBtn);

    await this.page.fill(
      this.profileTypeId,
      data.profileType_id
    );

    await this.page.fill(
      this.profileTypeName,
      data.profileType_name
    );

    await this.page.click(this.profileTypeStatusDropdown);

    await this.page.click(
      this.dropdownOption(data.profileType_status)
    );

    await this.page.click(this.submitBtn);
  }

  async updateProfileTypeFlow(data: ProfileTypeData): Promise<void> {
    await this.page.click(
      this.editBtn(data.profileType_id)
    );

    await this.page.fill(
      this.profileTypeName,
      data.profileType_name
    );

    await this.page.click(this.profileTypeStatusDropdown);

    await this.page.click(
      this.dropdownOption(data.profileType_status)
    );

    await this.page.click(this.updateBtn);
  }

  async deleteProfileTypeFlow(data: DeleteProfileTypeData): Promise<void> {
    await this.page.click(
      this.deleteBtn(data.profileType_id)
    );

    const modal = this.page.locator('.ant-modal-content');

    await modal.waitFor({
      state: 'visible'
    });

    await modal
      .locator('span:has-text("Delete")')
      .click();
  }

  async viewProfileTypeFlow(data: ViewProfileTypeData): Promise<void> {
    // Click correct row View
    await this.page.click(
      this.viewBtn(data.profileType_id)
    );

    // Wait for modal to open
    const modal = this.page.locator('.ant-modal-content');

    await modal.waitFor({
      state: 'visible'
    });

    // Scroll inside modal
    await modal.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });

    // Wait for 5 seconds
    await this.page.waitForTimeout(5000);

    // Click Close
    await modal.locator(this.closeBtn).click();
  }
}

export default ProfileTypePage;