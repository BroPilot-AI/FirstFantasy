import { test, expect } from '../fixtures/game';

test.describe('Clinic Flow', () => {
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
    for (let i = 0; i < 5; i++) {
      await gamePage.pressKey('ArrowRight');
    }
    await gamePage.pressKey('ArrowUp');
    await gamePage.page.waitForTimeout(500);
  });

  test('should open clinic scene from town', async ({ gamePage }) => {
    await expect(gamePage.page.locator('#clinic-scene.scene.active')).toBeVisible();
  });

  test('should display credits in clinic', async ({ gamePage }) => {
    const credits = await gamePage.page.locator('[data-testid="clinic-credits"]').textContent();
    expect(Number(credits)).toBeGreaterThan(0);
  });

  test('should heal party', async ({ gamePage }) => {
    await gamePage.page.locator('[data-testid="btn-heal"]').click();
    await gamePage.page.waitForTimeout(300);
    const dialogue = await gamePage.page.locator('[data-testid="clinic-dialogue"]').textContent();
    expect(dialogue).toContain('Good as new');
  });

  test('should leave clinic and return to town', async ({ gamePage }) => {
    await gamePage.page.locator('[data-testid="btn-leave-clinic"]').click();
    await gamePage.page.waitForTimeout(500);
    await expect(gamePage.page.locator('#town-scene.scene.active')).toBeVisible();
  });
});
