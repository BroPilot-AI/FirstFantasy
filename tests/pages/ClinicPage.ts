import { Page, Locator } from '@playwright/test';

export class ClinicPage {
  readonly page: Page;
  readonly clinicContainer: Locator;
  readonly healBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clinicContainer = page.locator('#clinic-scene');
    this.healBtn = page.locator('[data-testid="clinic-heal-btn"]');
  }

  async isVisible() {
    return this.clinicContainer.isVisible();
  }
}
