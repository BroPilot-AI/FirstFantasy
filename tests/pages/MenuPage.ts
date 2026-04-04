import { Page, Locator } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuContainer: Locator;
  readonly partyContainer: Locator;
  readonly inventoryContainer: Locator;
  readonly creditsDisplay: Locator;
  readonly btnClose: Locator;
  readonly btnSave: Locator;
  readonly tabConsumables: Locator;
  readonly tabGear: Locator;
  readonly tabSkills: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuContainer = page.locator('[data-testid="pause-menu"]');
    this.partyContainer = page.locator('[data-testid="menu-party-container"]');
    this.inventoryContainer = page.locator('[data-testid="menu-inventory-container"]');
    this.creditsDisplay = page.locator('[data-testid="menu-credits"]');
    this.btnClose = page.locator('[data-testid="btn-close-menu"]');
    this.btnSave = page.locator('[data-testid="btn-save-game"]');
    this.tabConsumables = page.locator('[data-testid="tab-consumables"]');
    this.tabGear = page.locator('[data-testid="tab-gear"]');
    this.tabSkills = page.locator('[data-testid="tab-skills"]');
  }

  async isVisible() {
    return this.menuContainer.isVisible();
  }

  async open() {
    await this.page.keyboard.press('KeyI');
    await this.menuContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async close() {
    await this.btnClose.click();
    await this.menuContainer.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getCredits() {
    return this.creditsDisplay.textContent();
  }

  async saveGame() {
    await this.btnSave.click();
    await this.page.waitForTimeout(500);
  }
}
