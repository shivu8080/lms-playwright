import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {

  constructor(private readonly page: Page) {}

  /**
   * Select main module
   * Example: Common
   */
  module(name: string): Locator {
    return this.page.locator(
      `//h3[normalize-space()='${name}']/ancestor::div[contains(@class,'wl-card')][1]`
    );
  }

  /**
   * Select feature
   * Example: CONFIG
   *
   * Feature is optional because currently
   * it is removed by the development team.
   */
  feature(name: string): Locator {
    return this.page.locator(
      `//span[contains(@class,'menu-label') and normalize-space()='${name}']`
    );
  }

  /**
   * Select parent menu
   * Example: Institution
   */
  menu(name: string): Locator {
    return this.page.locator(
      `//span[contains(@class,'menu-row-label') and normalize-space()='${name}']`
    );
  }

  /**
   * Select submenu under a particular parent menu.
   *
   * Example:
   * Parent Menu : Institution
   * Submenu     : Institution
   */
  submenu(parentMenu: string, submenuName: string): Locator {
    return this.page.locator(
      `//li[contains(@class,'ant-menu-submenu')]` +
      `[.//span[contains(@class,'menu-row-label') and normalize-space()='${parentMenu}']]` +
      `//li[contains(@class,'ant-menu-item')]` +
      `//span[contains(@class,'ant-menu-title-content') and normalize-space()='${submenuName}']`
    );
  }

  /**
   * Complete navigation flow
   *
   * Current:
   * Common -> Institution -> Institution
   *
   * Future:
   * Common -> CONFIG -> Institution -> Institution
   */
  async navigateTo(
    module: string,
    feature: string | undefined,
    menu: string,
    submenu?: string
  ): Promise<void> {

    // Step 1: Select Module
    const moduleLocator = this.module(module);

    await expect(moduleLocator).toBeVisible();
    await moduleLocator.click();

    // Step 2: Select Feature (Optional)
    if (feature) {
      const featureLocator = this.feature(feature);

      await expect(featureLocator).toBeVisible();
      await featureLocator.click();
    }

    // Step 3: Select Parent Menu
    const menuLocator = this.menu(menu);

    await expect(menuLocator).toBeVisible();
    await menuLocator.click();

    // Step 4: Select Submenu (Optional)
    if (submenu) {
      const submenuLocator = this.submenu(menu, submenu);

      await expect(submenuLocator).toBeVisible();
      await submenuLocator.click();
    }
  }
}