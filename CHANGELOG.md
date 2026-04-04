# Changelog

All notable changes to CyberTaco RPG will be documented in this file.

## [v0.2.0] — Forest, QOL & Systems Overhaul

### New Content
- **Whispering Forest** — new explorable area between world map and dungeon
  - Random encounters with forest-specific enemies (Cyber Wolf, Data Wraith)
  - Campfire rest spot (one-time 30% HP/MP recovery)
  - Hidden treasure chest (200 credits + 2 potions)
  - Lore signpost with hints
- **New enemy types** — Cyber Wolf and Data Wraith with unique abilities
- **Updated progression path** — Town → World Map → Forest → Dungeon → Boss

### Battle Improvements
- **Item menu** — use Cyber-Potions and EMP-Grenades during combat
- **Post-battle recovery** — 15% HP/MP restore after victories
- **Revive on defeat** — retry option that restores party to 50% HP/MP instead of instant game over
- **Battle log cap** — limited to 50 entries to prevent memory growth
- **Temporary defense buffs** — boss and player def buffs now expire after 3 turns instead of stacking permanently

### Exploration QOL
- **Directional compass** — shows nearby exits on all grid scenes
- **Wider exit paths** — 2-tile-wide paths on world map and forest
- **Boss stats preview** — shows HP/ATK/DEF/abilities before confirming boss fight
- **Guaranteed solvable dungeon** — corridor-based maze instead of random generation

### System Features
- **Save/Load** — save from menu (button), load button appears on start screen if save exists
- **Tutorial overlay** — one-time controls guide on first play
- **Ambient audio** — procedural BGM loops unique to each area (town, forest, dungeon, battle)
- **Boss scaling capped** — level multiplier capped at level 7 with gentler curve (1.2^n vs 1.25^n)

### Boss Balance
- HP: 500 → 200
- ATK: 30 → 18
- DEF: 20 → 10
- Ability damage reduced (Salsa Splash: 35→20, Guacamole Slam: 50→30)
- Crunchy Shell Defense: permanent +20 → temporary +10 for 3 turns

### Files Changed
- `js/scenes/forest.js` — **NEW** Forest scene with encounters, rest spot, hidden items
- `js/entities/enemies.js` — Added forest enemies, capped boss scaling, balanced boss stats
- `js/scenes/battle.js` — Item menu, post-battle regen, revive option, log cap, temp buffs
- `js/scenes/dungeon.js` — Solvable maze, boss stats preview, forest routing
- `js/scenes/worldMap.js` — Routes through forest instead of direct dungeon
- `js/scenes/gridScene.js` — Compass system, BGM stop on scene change
- `js/scenes/town.js` — Compass destination, BGM
- `js/scenes/menu.js` — Save game button
- `js/gameState.js` — Save/load system, new state flags
- `js/audioManager.js` — Procedural BGM system with per-area loops
- `js/main.js` — Tutorial overlay, load game button on start screen
- `js/sceneManager.js` — Forest scene registration
- `style.css` — Compass styling

## [v0.1.0] — Initial Release

- Turn-based combat with Attack, Ability, Defend, Run
- Town, World Map, and Dungeon exploration
- Shop and Clinic interiors
- Character leveling with skill trees
- Inventory system with consumables and gear
