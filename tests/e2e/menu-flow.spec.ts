import { test, expect } from '../fixtures/game';

test.describe('Menu Flow', () => {
  test.beforeEach(async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.waitForSceneChange('town-scene');
    await gamePage.page.waitForTimeout(1000);
    if (await gamePage.isOverlayVisible()) {
      await gamePage.dismissOverlay();
    }
  });

  test('should open menu with I key', async ({ menuPage }) => {
    await menuPage.open();
    await expect(menuPage.menuContainer).toBeVisible();
  });

  test('should close menu with close button', async ({ menuPage }) => {
    await menuPage.open();
    await menuPage.close();
    await expect(menuPage.menuContainer).toBeHidden();
  });

  test('should show party info in menu', async ({ menuPage }) => {
    await menuPage.open();
    await expect(menuPage.partyContainer).toBeVisible();
    const charCards = menuPage.page.locator('[data-testid^="menu-char-card-"]');
    expect(await charCards.count()).toBe(3);
  });

  test('should show credits in menu', async ({ menuPage }) => {
    await menuPage.open();
    const credits = await menuPage.getCredits();
    expect(Number(credits)).toBeGreaterThan(0);
  });

  test('should switch between tabs', async ({ menuPage }) => {
    await menuPage.open();
    await menuPage.tabConsumables.click();
    await expect(menuPage.inventoryContainer).toBeVisible();
    await menuPage.tabGear.click();
    await expect(menuPage.inventoryContainer).toBeVisible();
    await menuPage.tabSkills.click();
    await expect(menuPage.inventoryContainer).toBeVisible();
  });

  test('should save game from menu', async ({ menuPage, gamePage }) => {
    await menuPage.open();
    await menuPage.saveGame();
    const saveBtn = menuPage.btnSave;
    await expect(saveBtn).toContainText('Game Saved!');
  });
});
