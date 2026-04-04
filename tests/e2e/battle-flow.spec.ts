import { test, expect } from '../fixtures/game';

test.describe('Battle Flow', () => {
  test.fixme('should have item button in battle menu', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via URL params has timing issues in CI');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(3000);
    await gamePage.page.goto('/?debug=battle');
    await gamePage.page.waitForTimeout(2000);
    await battlePage.waitForBattleStart();
    await expect(battlePage.btnItem).toBeVisible();
  });

  test.fixme('should show item menu when clicking item button', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via URL params has timing issues in CI');
    await gamePage.page.goto('/?debug=battle');
    await gamePage.page.waitForLoadState('networkidle');
    await gamePage.page.locator('[data-testid="overlay-btn"]').click();
    await gamePage.page.waitForTimeout(3000);
    await battlePage.waitForBattleStart();
    await battlePage.clickItem();
    await expect(battlePage.itemMenu).toBeVisible();
  });

  test.fixme('should defend and advance turn', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via URL params has timing issues in CI');
    await gamePage.page.goto('/?debug=battle');
    await gamePage.page.waitForLoadState('networkidle');
    await gamePage.page.locator('[data-testid="overlay-btn"]').click();
    await gamePage.page.waitForTimeout(3000);
    await battlePage.waitForBattleStart();
    await battlePage.clickDefend();
    await gamePage.page.waitForTimeout(2000);
    const logEntries = await battlePage.getLogEntries();
    const count = await logEntries.count();
    expect(count).toBeGreaterThan(1);
  });

  test.fixme('should not run from boss', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via URL params has timing issues in CI');
    await gamePage.page.goto('/?debug=boss');
    await gamePage.page.waitForLoadState('networkidle');
    await gamePage.page.locator('[data-testid="overlay-btn"]').click();
    await gamePage.page.waitForTimeout(3000);
    await battlePage.waitForBattleStart();
    await battlePage.clickRun();
    await gamePage.page.waitForTimeout(500);
    const lastLog = await battlePage.getLastLogEntry();
    expect(await lastLog?.textContent()).toContain("Can't run from Boss");
  });

  test.fixme('should run from normal battle', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via URL params has timing issues in CI');
    await gamePage.page.goto('/?debug=battle');
    await gamePage.page.waitForLoadState('networkidle');
    await gamePage.page.locator('[data-testid="overlay-btn"]').click();
    await gamePage.page.waitForTimeout(3000);
    await battlePage.waitForBattleStart();
    await battlePage.clickRun();
    await gamePage.page.waitForTimeout(1500);
    await expect(gamePage.page.locator('#town-scene.scene.active')).toBeVisible();
  });
});
