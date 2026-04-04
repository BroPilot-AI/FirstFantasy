import { Page, Locator } from '@playwright/test';

export class BattlePage {
  readonly page: Page;
  readonly battleTop: Locator;
  readonly battleBottom: Locator;
  readonly partyContainer: Locator;
  readonly enemyContainer: Locator;
  readonly mainMenu: Locator;
  readonly abilityMenu: Locator;
  readonly itemMenu: Locator;
  readonly targetMenu: Locator;
  readonly battleLog: Locator;
  readonly btnAttack: Locator;
  readonly btnAbility: Locator;
  readonly btnItem: Locator;
  readonly btnDefend: Locator;
  readonly btnRun: Locator;

  constructor(page: Page) {
    this.page = page;
    this.battleTop = page.locator('[data-testid="battle-top"]');
    this.battleBottom = page.locator('[data-testid="battle-bottom"]');
    this.partyContainer = page.locator('[data-testid="party-container"]');
    this.enemyContainer = page.locator('[data-testid="enemy-container"]');
    this.mainMenu = page.locator('[data-testid="battle-main-menu"]');
    this.abilityMenu = page.locator('[data-testid="battle-ability-menu"]');
    this.itemMenu = page.locator('[data-testid="battle-item-menu"]');
    this.targetMenu = page.locator('[data-testid="battle-target-menu"]');
    this.battleLog = page.locator('[data-testid="battle-log"]');
    this.btnAttack = page.locator('[data-testid="btn-attack"]');
    this.btnAbility = page.locator('[data-testid="btn-ability"]');
    this.btnItem = page.locator('[data-testid="btn-item"]');
    this.btnDefend = page.locator('[data-testid="btn-defend"]');
    this.btnRun = page.locator('[data-testid="btn-run"]');
  }

  async isVisible() {
    return this.battleTop.isVisible();
  }

  async waitForBattleStart() {
    await this.battleTop.waitFor({ state: 'visible', timeout: 10000 });
    await this.mainMenu.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getLogEntries() {
    return this.battleLog.locator('.log-entry');
  }

  async getLastLogEntry() {
    const entries = await this.getLogEntries();
    const count = await entries.count();
    if (count === 0) return null;
    return entries.nth(count - 1);
  }

  async clickAttack() {
    await this.btnAttack.click();
  }

  async clickDefend() {
    await this.btnDefend.click();
  }

  async clickItem() {
    await this.btnItem.click();
  }

  async clickRun() {
    await this.btnRun.click();
  }

  async selectTarget(targetName: string) {
    const targetBtn = this.page.locator('button', { hasText: `Target: ${targetName}` });
    await targetBtn.click();
  }

  async selectAbility(abilityName: string) {
    const abBtn = this.page.locator('button', { hasText: abilityName });
    await abBtn.click();
  }

  async selectItem(itemName: string) {
    const itemBtn = this.page.locator('button', { hasText: itemName });
    await itemBtn.click();
  }

  async clickBack() {
    const backBtn = this.page.locator('button', { hasText: 'Back' });
    await backBtn.click();
  }

  async waitForVictory() {
    await this.page.waitForFunction(() => {
      const log = document.getElementById('battle-log');
      if (!log) return false;
      return log.textContent?.includes('Victory') || false;
    }, { timeout: 30000 });
  }

  async waitForDefeat() {
    await this.page.waitForFunction(() => {
      const log = document.getElementById('battle-log');
      if (!log) return false;
      return log.textContent?.includes('defeated') || false;
    }, { timeout: 30000 });
  }

  async waitForRetryButton() {
    await this.page.locator('#btn-retry').waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickRetry() {
    await this.page.locator('#btn-retry').click();
  }
}
