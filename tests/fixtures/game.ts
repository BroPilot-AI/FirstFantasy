import { test as base } from '@playwright/test';
import { GamePage } from '../pages/GamePage';
import { TownPage } from '../pages/TownPage';
import { ShopPage } from '../pages/ShopPage';
import { ClinicPage } from '../pages/ClinicPage';
import { BattlePage } from '../pages/BattlePage';
import { MenuPage } from '../pages/MenuPage';
import { DungeonPage } from '../pages/DungeonPage';
import { WorldMapPage } from '../pages/WorldMapPage';

type GameFixtures = {
  gamePage: GamePage;
  townPage: TownPage;
  shopPage: ShopPage;
  clinicPage: ClinicPage;
  battlePage: BattlePage;
  menuPage: MenuPage;
  dungeonPage: DungeonPage;
  worldMapPage: WorldMapPage;
};

export const test = base.extend<GameFixtures>({
  gamePage: async ({ page }, use) => {
    const gamePage = new GamePage(page);
    await gamePage.goto();
    await use(gamePage);
  },
  townPage: async ({ page, gamePage }, use) => {
    await use(new TownPage(page, gamePage));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  clinicPage: async ({ page }, use) => {
    await use(new ClinicPage(page));
  },
  battlePage: async ({ page }, use) => {
    await use(new BattlePage(page));
  },
  menuPage: async ({ page }, use) => {
    await use(new MenuPage(page));
  },
  dungeonPage: async ({ page, gamePage }, use) => {
    await use(new DungeonPage(page, gamePage));
  },
  worldMapPage: async ({ page, gamePage }, use) => {
    await use(new WorldMapPage(page, gamePage));
  },
});

export { expect } from '@playwright/test';
