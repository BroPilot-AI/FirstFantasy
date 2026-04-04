import { Page, Locator } from '@playwright/test';
import { GamePage } from './GamePage';

export class WorldMapPage {
  readonly page: Page;
  readonly gamePage: GamePage;
  readonly player: Locator;

  constructor(page: Page, gamePage: GamePage) {
    this.page = page;
    this.gamePage = gamePage;
    this.player = page.locator('#worldMap-scene .player');
  }

  async isVisible() {
    return this.player.isVisible();
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
}
