import { test, expect } from '../fixtures/game';

test.describe('Battle Flow', () => {
  test.fixme('should have item button in battle menu', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via programmatic trigger has timing issues with module initialization');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    await gamePage.page.evaluate(() => window.__testHelpers.triggerBattle(false));
    await gamePage.page.waitForTimeout(1000);
    await battlePage.waitForBattleStart();
    await expect(battlePage.btnItem).toBeVisible();
  });

  test.fixme('should show item menu when clicking item button', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via programmatic trigger has timing issues with module initialization');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    await gamePage.page.evaluate(() => window.__testHelpers.triggerBattle(false));
    await gamePage.page.waitForTimeout(1000);
    await battlePage.waitForBattleStart();
    await battlePage.clickItem();
    await expect(battlePage.itemMenu).toBeVisible();
  });

  test.fixme('should defend and advance turn', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via programmatic trigger has timing issues with module initialization');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    await gamePage.page.evaluate(() => window.__testHelpers.triggerBattle(false));
    await gamePage.page.waitForTimeout(1000);
    await battlePage.waitForBattleStart();
    await battlePage.clickDefend();
    await gamePage.page.waitForTimeout(2000);
    const logEntries = await battlePage.getLogEntries();
    const count = await logEntries.count();
    expect(count).toBeGreaterThan(1);
  });

  test.fixme('should not run from boss', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via programmatic trigger has timing issues with module initialization');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    await gamePage.page.evaluate(() => window.__testHelpers.triggerBattle(true));
    await gamePage.page.waitForTimeout(1000);
    await battlePage.waitForBattleStart();
    await battlePage.clickRun();
    await gamePage.page.waitForTimeout(500);
    const lastLog = await battlePage.getLastLogEntry();
    expect(await lastLog?.textContent()).toContain("Can't run from Boss");
  });

  test.fixme('should run from normal battle', async ({ gamePage, battlePage }) => {
    test.fixme(true, 'Battle scene activation via programmatic trigger has timing issues with module initialization');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    await gamePage.page.evaluate(() => window.__testHelpers.triggerBattle(false));
    await gamePage.page.waitForTimeout(1000);
    await battlePage.waitForBattleStart();
    await battlePage.clickRun();
    await gamePage.page.waitForTimeout(1500);
    await expect(gamePage.page.locator('#town-scene')).toHaveClass(/active/);
  });
});
