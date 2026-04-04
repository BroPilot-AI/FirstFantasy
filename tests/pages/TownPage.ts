import { Page, Locator } from '@playwright/test';
import { GamePage } from './GamePage';

export class TownPage {
  readonly page: Page;
  readonly gamePage: GamePage;
  readonly player: Locator;

  constructor(page: Page, gamePage: GamePage) {
    this.page = page;
    this.gamePage = gamePage;
    this.player = page.locator('#town-scene .player');
  }

  async moveDown(steps: number = 1) {
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.down('ArrowDown');
      await this.page.waitForTimeout(160);
      await this.page.keyboard.up('ArrowDown');
    }
  }

  async moveUp(steps: number = 1) {
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.down('ArrowUp');
      await this.page.waitForTimeout(160);
      await this.page.keyboard.up('ArrowUp');
    }
  }

  async moveLeft(steps: number = 1) {
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.down('ArrowLeft');
      await this.page.waitForTimeout(160);
      await this.page.keyboard.up('ArrowLeft');
    }
  }

  async moveRight(steps: number = 1) {
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.down('ArrowRight');
      await this.page.waitForTimeout(160);
      await this.page.keyboard.up('ArrowRight');
    }
  }

  async walkIntoBuilding() {
    await this.moveUp();
    await this.page.waitForTimeout(500);
  }

  async getOverlayTitle() {
    return this.gamePage.overlayTitle.textContent();
  }

  async getOverlayText() {
    return this.gamePage.overlayText.textContent();
  }
}
