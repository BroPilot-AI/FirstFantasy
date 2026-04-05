import { test, expect } from '../fixtures/game';

test.describe('Game Start', () => {
  test('should show title screen with START GAME button', async ({ gamePage }) => {
    await expect(gamePage.overlayTitle).toContainText('CyberTaco RPG');
    await expect(gamePage.overlayBtn).toContainText('NEW GAME');
  });

  test('should start game and show town', async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
  });

  test('should show tutorial overlay on first play', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="overlay-btn"]').click();
    await page.waitForTimeout(2000);
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

  test('should have player sprite visible in town', async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(2000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(500);
    const player = gamePage.page.locator('#town-scene.scene.active .player');
    await expect(player).toBeVisible({ timeout: 5000 });
  });
});
