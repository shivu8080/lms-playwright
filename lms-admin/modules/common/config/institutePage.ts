import { Page, Locator, expect } from '@playwright/test';

interface CreateInstituteData {
  institution_id: string;
  institution_name: string;
  institution_type: string;
  institution_status: string;
}

interface UpdateInstituteData {
  institution_id: string;
  institution_name: string;
  institution_status: string;
}

interface ViewInstituteData {
  institution_id: string;
}

class InstitutePage {
  readonly page: Page;

  readonly addRecordBtn: Locator;
  readonly instId: string;
  readonly instName: string;
  readonly instTypeDropdown: string;
  readonly dropdownOption: (value: string) => string;
  readonly instStatusDropdown: string;
  readonly submitBtn: Locator;
  readonly closeBtn: string;

  constructor(page: Page) {
    this.page = page;

    this.addRecordBtn = this.page.getByRole('button', {
      name: 'Add Record',
      exact: true
    });

    this.instId = '[formcontrolname="inst_id"]';

    this.instName = '[formcontrolname="inst_name"]';

    this.instTypeDropdown = '[formcontrolname="inst_type"]';

    this.dropdownOption = (value: string) =>
      `//nz-option-item[@title="${value}"]`;

    this.instStatusDropdown =
      '[formcontrolname="inst_status"]';

    this.submitBtn = this.page.getByRole('button', {
      name: 'Submit',
      exact: true
    });

    this.closeBtn = 'text=Close';
  }

  /**
   * Find Institution row using Institution ID
   */
  institutionRow(id: string): Locator {
    return this.page
      .locator('tr')
      .filter({
        hasText: id
      })
      .first();
  }

  /**
   * Create Institution
   */
  async createInstituteFlow(
    data: CreateInstituteData
  ): Promise<void> {

    // Step 1: Click Add Record
    await expect(this.addRecordBtn).toBeVisible();
    await this.addRecordBtn.click();

    // Step 2: Wait for Institution ID
    const institutionId =
      this.page.locator(this.instId);

    await expect(institutionId).toBeVisible();

    // Step 3: Enter Institution ID
    await institutionId.fill(
      data.institution_id
    );

    // Step 4: Enter Institution Name
    const institutionName =
      this.page.locator(this.instName);

    await expect(institutionName).toBeVisible();

    await institutionName.fill(
      data.institution_name
    );

    // Step 5: Select Institution Type
    const institutionType =
      this.page.locator(
        this.instTypeDropdown
      );

    await institutionType.click();

    const typeOption =
      this.page.locator(
        this.dropdownOption(
          data.institution_type
        )
      );

    await expect(typeOption).toBeVisible();
    await typeOption.click();

    // Step 6: Select Institution Status
    const institutionStatus =
      this.page.locator(
        this.instStatusDropdown
      );

    await institutionStatus.click();

    const statusOption =
      this.page.locator(
        this.dropdownOption(
          data.institution_status
        )
      );

    await expect(statusOption).toBeVisible();
    await statusOption.click();

    // Step 7: Submit
    await expect(this.submitBtn).toBeVisible();
    await this.submitBtn.click();
  }

  /**
   * Update Institution
   */
  async updateInstituteFlow(
    data: UpdateInstituteData
  ): Promise<void> {

    // Step 1: Find Institution row
    const row = this.institutionRow(
      data.institution_id
    );

    await expect(row).toBeVisible();

    // Step 2: Find Edit button using edit icon
    const editButton = row.locator(
      'button:has(span.anticon-edit)'
    );

    await expect(editButton).toBeVisible();

    // Step 3: Click Edit
    await editButton.click();

    // Step 4: Wait for Edit form
    await expect(
      this.page.locator(this.instName)
    ).toBeVisible();

    // Step 5: Update Institution Name
    await this.page.fill(
      this.instName,
      data.institution_name
    );

    // Step 6: Update Institution Status
    await this.page.click(
      this.instStatusDropdown
    );

    await this.page.click(
      this.dropdownOption(
        data.institution_status
      )
    );

    // Step 7: Submit update
    await expect(this.submitBtn).toBeVisible();
    await this.submitBtn.click();
  }

  /**
   * View Institution
   */
  // async viewInstituteFlow(
  //   data: ViewInstituteData
  // ): Promise<void> {

  //   // Step 1: Find the correct Institution row
  //   const row = this.institutionRow(
  //     data.institution_id
  //   );

  //   await expect(row).toBeVisible();

  //   // Step 2: Find View action using eye icon
  //   const viewButton = row.locator(
  //     'button:has(span.anticon-eye)'
  //   );

  //   await expect(viewButton).toBeVisible();

  //   // Step 3: Click View
  //   await viewButton.click();

  //   // Step 4: Wait for View modal
  //   const modal = this.page
  //     .locator('.ant-modal-content')
  //     .last();

  //   await expect(modal).toBeVisible();

  //   // Step 5: Keep View open for 10 seconds
  //   await this.page.waitForTimeout(10_000);

  //   // Step 6: Click Close
  //   const closeButton = modal.getByText(
  //     'Close',
  //     {
  //       exact: true
  //     }
  //   );

  //   await expect(closeButton).toBeVisible();

  //   await closeButton.click();

  //   // Step 7: Confirm modal closed
  //   await expect(modal).toBeHidden();
  // }
}

export default InstitutePage;