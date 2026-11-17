import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly username = "input[formcontrolname='UserId']";
  readonly password = "input[formcontrolname='Password']";
  readonly loginBtn = "button[type='submit']";
  readonly errorMsg = ".error-message";

  constructor(page: Page) {
    this.page = page;
  }

  async enterCredentials(
    username: string,
    password: string
  ): Promise<void> {
    await this.page.fill(
      this.username,
      username
    );

    await this.page.fill(
      this.password,
      password
    );

    await this.page.click(
      this.loginBtn
    );
  }
}