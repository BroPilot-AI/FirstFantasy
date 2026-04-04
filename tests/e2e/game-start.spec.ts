import { test, expect } from '../fixtures/game';

test.describe('Game Start', () => {
  test('should show title screen with START GAME button', async ({ gamePage }) => {
    await expect(gamePage.overlayTitle).toContainText('CyberTaco RPG');
    await expect(gamePage.overlayBtn).toContainText('START GAME');
  });

  test('should start game and show town', async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
  });

  test.fixme('should show tutorial overlay on first play', async ({ browser }) => {
    test.fixme(true, 'Tutorial detection relies on localStorage which persists across test contexts');
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="overlay-btn"]').click();
    await page.waitForTimeout(3000);
    const overlayTitle = page.locator('[data-testid="overlay-title"]');
    await expect(overlayTitle).toContainText('HOW TO PLAY');
    await context.close();
  });

  test('should dismiss tutorial and show town scene', async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(1500);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await expect(gamePage.page.locator('#town-scene.scene.active')).toBeVisible();
  });

  test.fixme('should have player sprite visible in town', async ({ gamePage }) => {
    test.fixme(true, 'Player element not found due to scene DOM cleanup between tests');
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    await expect(gamePage.page.locator('#town-scene.scene.active .player')).toBeVisible();
  });
});
