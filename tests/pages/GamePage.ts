import { Page, Locator } from '@playwright/test';

export class GamePage {
  readonly page: Page;
  readonly sceneContainer: Locator;
  readonly overlayTitle: Locator;
  readonly overlayText: Locator;
  readonly overlayBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sceneContainer = page.locator('[data-testid="scene-container"]');
    this.overlayTitle = page.locator('[data-testid="overlay-title"]');
    this.overlayText = page.locator('[data-testid="overlay-text"]');
    this.overlayBtn = page.locator('[data-testid="overlay-btn"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async startGame() {
    await this.overlayBtn.click();
    await this.page.waitForTimeout(500);
  }

  async dismissOverlay() {
    await this.overlayBtn.click();
    await this.page.waitForTimeout(300);
  }

  async getActiveScene() {
    const active = this.page.locator('.scene.active');
    const id = await active.getAttribute('id');
    return id;
  }

  async isOverlayVisible() {
    return this.page.locator('.overlay-message.active').isVisible();
  }

  async pressKey(key: string) {
    await this.page.keyboard.down(key);
    await this.page.waitForTimeout(300);
    await this.page.keyboard.up(key);
    await this.page.waitForTimeout(100);
  }

  async waitForSceneChange(expectedScene: string) {
    await this.page.waitForFunction(
      (scene) => {
        const active = document.querySelector('.scene.active');
        return active && active.id === scene;
      },
      expectedScene,
      { timeout: 10000 }
    );
  }
}
