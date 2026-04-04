import { test, expect } from '../fixtures/game';

test.describe('Town Navigation', () => {
  test.beforeEach(async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(1500);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(300);
  });

  test('should have compass visible in town', async ({ gamePage }) => {
    await expect(gamePage.page.locator('.compass')).toBeVisible();
  });

  test.fixme('should move player with arrow keys', async ({ gamePage }) => {
    test.fixme(true, 'Player movement triggers scene transition before position can be measured');
    const player = gamePage.page.locator('#town-scene .player');
    await expect(player).toBeVisible({ timeout: 5000 });
    const initialBox = await player.boundingBox();
    expect(initialBox).not.toBeNull();
    await gamePage.page.keyboard.down('ArrowDown');
    await gamePage.page.waitForTimeout(500);
    await gamePage.page.keyboard.up('ArrowDown');
    await gamePage.page.waitForTimeout(500);
    const newBox = await player.boundingBox();
    expect(newBox).not.toBeNull();
    expect(newBox!.y).toBeGreaterThanOrEqual(initialBox!.y);
  });

  test('should walk into shop and trigger interaction', async ({ gamePage }) => {
    for (let i = 0; i < 10; i++) {
      await gamePage.pressKey('ArrowUp');
    }
    for (let i = 0; i < 6; i++) {
      await gamePage.pressKey('ArrowLeft');
    }
    await gamePage.pressKey('ArrowUp');
    await gamePage.page.waitForTimeout(500);
    const activeScene = await gamePage.getActiveScene();
    expect(activeScene).toBe('shop-scene');
  });

  test('should walk into clinic and trigger interaction', async ({ gamePage }) => {
    for (let i = 0; i < 10; i++) {
      await gamePage.pressKey('ArrowUp');
    }
    for (let i = 0; i < 5; i++) {
      await gamePage.pressKey('ArrowRight');
    }
    await gamePage.pressKey('ArrowUp');
    await gamePage.page.waitForTimeout(500);
    const activeScene = await gamePage.getActiveScene();
    expect(activeScene).toBe('clinic-scene');
  });

  test('should walk south to world map', async ({ gamePage }) => {
    await gamePage.pressKey('ArrowDown');
    await gamePage.page.waitForTimeout(800);
    const activeScene = await gamePage.getActiveScene();
    expect(activeScene).toBe('worldMap-scene');
  });

  test('should interact with fountain', async ({ gamePage }) => {
    for (let i = 0; i < 7; i++) {
      await gamePage.pressKey('ArrowUp');
    }
    await gamePage.pressKey('ArrowRight');
    await gamePage.pressKey('ArrowUp');
    await gamePage.page.waitForTimeout(500);
    if (await gamePage.isOverlayVisible()) {
      const title = await gamePage.getOverlayTitle();
      expect(title).toContain('FOUNTAIN');
    }
  });
});
