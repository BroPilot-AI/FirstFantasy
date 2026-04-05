import { Page, Locator } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuContainer: Locator;
  readonly partyContainer: Locator;
  readonly inventoryContainer: Locator;
  readonly creditsDisplay: Locator;
  readonly btnClose: Locator;
  readonly btnSave: Locator;
  readonly btnLoad: Locator;
  readonly tabConsumables: Locator;
  readonly tabGear: Locator;
  readonly tabMaterials: Locator;
  readonly tabSkills: Locator;

  constructor(page: Page) {
    this.page = page;
    const activeMenu = page.locator('#menu-scene.scene.active');
    this.menuContainer = activeMenu.locator('[data-testid="pause-menu"]');
    this.partyContainer = activeMenu.locator('[data-testid="menu-party-container"]');
    this.inventoryContainer = activeMenu.locator('[data-testid="menu-inventory-container"]');
    this.creditsDisplay = activeMenu.locator('[data-testid="menu-credits"]');
    this.btnClose = activeMenu.locator('[data-testid="btn-close-menu"]');
    this.btnSave = activeMenu.locator('[data-testid="btn-save-game"]');
    this.btnLoad = activeMenu.locator('[data-testid="btn-load-game"]');
    this.tabConsumables = activeMenu.locator('[data-testid="tab-consumables"]');
    this.tabGear = activeMenu.locator('[data-testid="tab-gear"]');
    this.tabMaterials = activeMenu.locator('[data-testid="tab-materials"]');
    this.tabSkills = activeMenu.locator('[data-testid="tab-skills"]');
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

  async loadGame() {
    await this.btnLoad.click();
    await this.page.waitForTimeout(500);
  }
}
