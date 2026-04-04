import { Page, Locator } from '@playwright/test';

export class ShopPage {
  readonly page: Page;
  readonly shopContainer: Locator;
  readonly creditsDisplay: Locator;
  readonly buyButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shopContainer = page.locator('#shop-scene');
    this.creditsDisplay = page.locator('[data-testid="shop-credits"]');
    this.buyButtons = page.locator('[data-testid="shop-buy-btn"]');
  }

  async isVisible() {
    return this.shopContainer.isVisible();
  }
}
