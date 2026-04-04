import { test, expect } from '../fixtures/game';

test.describe('Shop Flow', () => {
  test.beforeEach(async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(1500);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
    await gamePage.page.waitForTimeout(300);
    for (let i = 0; i < 10; i++) {
      await gamePage.pressKey('ArrowUp');
    }
    for (let i = 0; i < 6; i++) {
      await gamePage.pressKey('ArrowLeft');
    }
    await gamePage.pressKey('ArrowUp');
    await gamePage.page.waitForTimeout(500);
  });

  test('should open shop scene from town', async ({ gamePage }) => {
    await expect(gamePage.page.locator('#shop-scene.scene.active')).toBeVisible();
  });

  test('should display credits in shop', async ({ gamePage }) => {
    const credits = await gamePage.page.locator('#shop-scene.scene.active [data-testid="shop-credits"]').textContent();
    expect(Number(credits)).toBeGreaterThan(0);
  });

  test('should buy an item', async ({ gamePage }) => {
    const shop = gamePage.page.locator('#shop-scene.scene.active');
    const initialCredits = Number(await shop.locator('[data-testid="shop-credits"]').textContent());
    const buyBtn = shop.locator('button', { hasText: 'Buy (50C)' }).first();
    await buyBtn.click();
    await gamePage.page.waitForTimeout(300);
    const newCredits = Number(await shop.locator('[data-testid="shop-credits"]').textContent());
    expect(newCredits).toBe(initialCredits - 50);
  });

  test('should leave shop and return to town', async ({ gamePage }) => {
    await gamePage.page.locator('#shop-scene.scene.active [data-testid="btn-leave-shop"]').click();
    await gamePage.page.waitForTimeout(500);
    await expect(gamePage.page.locator('#town-scene.scene.active')).toBeVisible();
  });
});
