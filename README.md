# CyberTaco RPG

A cyberpunk pixel-art RPG built with vanilla JavaScript. Battle the Giant Orange Taco threatening the neon city — gather your party, explore the town, fight through the Whispering Forest, brave the Tech-Dungeon, and gear up at shops and clinics.

[![Play Now](https://img.shields.io/badge/Play%20Now-CyberTaco%20RPG-ff00ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://raw.githack.com/BroPilot-AI/FirstFantasy/main/index.html)

## Features

- Turn-based combat system with party management
- Explorable town, world map, forest, and dungeon scenes
- Shop, clinic, and inventory systems
- Character leveling with skill trees
- Save/load system with localStorage
- Ambient procedural audio per area
- Directional compass on exploration scenes
- Pixel-art cyberpunk aesthetic

## Getting Started

Open `index.html` in a browser to play — no build step required.

## Project Structure

```
├── index.html          # Entry point
├── style.css           # UI and scene styling
├── js/
│   ├── main.js         # Game bootstrap
│   ├── gameState.js    # Party, inventory, progression, save/load
│   ├── sceneManager.js # Scene transitions
│   ├── audioManager.js # Sound effects / procedural BGM
│   ├── inputManager.js # Keyboard input
│   ├── entities/       # Character and enemy definitions
│   └── scenes/         # Town, battle, shop, clinic, dungeon, world map, forest, menu
└── assets/             # Sprite and background images
```

## Controls

- **Arrow Keys** — move character on grid scenes
- **Click** — interact with UI elements
- **I / Escape** — toggle inventory/menu

## Changelog

### v0.2.0 — Forest, QOL & Systems Overhaul

#### New Content
- **Whispering Forest** — new explorable area between world map and dungeon
  - Random encounters with forest-specific enemies (Cyber Wolf, Data Wraith)
  - Campfire rest spot (one-time 30% HP/MP recovery)
  - Hidden treasure chest (200 credits + 2 potions)
  - Lore signpost with hints
- **New enemy types** — Cyber Wolf and Data Wraith with unique abilities
- **Updated progression path** — Town → World Map → Forest → Dungeon → Boss

#### Battle Improvements
- **Item menu** — use Cyber-Potions and EMP-Grenades during combat
- **Post-battle recovery** — 15% HP/MP restore after victories
- **Revive on defeat** — retry option that restores party to 50% HP/MP instead of instant game over
- **Battle log cap** — limited to 50 entries to prevent memory growth
- **Temporary defense buffs** — boss and player def buffs now expire after 3 turns instead of stacking permanently

#### Exploration QOL
- **Directional compass** — shows nearby exits on all grid scenes
- **Wider exit paths** — 2-tile-wide paths on world map and forest
- **Boss stats preview** — shows HP/ATK/DEF/abilities before confirming boss fight
- **Guaranteed solvable dungeon** — corridor-based maze instead of random generation

#### System Features
- **Save/Load** — save from menu (S key or button), load button appears on start screen if save exists
- **Tutorial overlay** — one-time controls guide on first play
- **Ambient audio** — procedural BGM loops unique to each area (town, forest, dungeon, battle)
- **Boss scaling capped** — level multiplier capped at level 7 with gentler curve (1.2^n vs 1.25^n)

#### Boss Balance
- HP: 500 → 200
- ATK: 30 → 18
- DEF: 20 → 10
- Ability damage reduced (Salsa Splash: 35→20, Guacamole Slam: 50→30)
- Crunchy Shell Defense: permanent +20 → temporary +10 for 3 turns

### v0.1.0 — Initial Release
- Turn-based combat with Attack, Ability, Defend, Run
- Town, World Map, and Dungeon exploration
- Shop and Clinic interiors
- Character leveling with skill trees
- Inventory system with consumables and gear
