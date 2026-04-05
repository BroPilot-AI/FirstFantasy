# CyberTaco RPG

A cyberpunk pixel-art RPG built with vanilla JavaScript. Battle the Giant Orange Taco threatening the neon city — gather your party, explore the town, fight through the Whispering Forest, brave the Tech-Dungeon, and gear up at shops and clinics.

[![Play Now](https://img.shields.io/badge/Play%20Now-CyberTaco%20RPG-ff00ff?style=for-the-badge&logo=googlechrome&logoColor=white)](https://raw.githack.com/BroPilot-AI/FirstFantasy/main/index.html)

## Features

- Turn-based combat system with party management and item usage
- Explorable town, world map, forest, and dungeon scenes with random encounters
- Shop with tabbed catalog (Items, Weapons, Armor), clinic, and inventory systems
- Expanded gear system: 6 weapons + 6 armors across 4 tiers with speed bonuses
- Material drops from enemies for future crafting
- Character leveling with skill trees
- Multi-slot save/load system (3 slots) with detailed save info
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
│   ├── gameState.js    # Party, inventory, progression, multi-slot save/load
│   ├── sceneManager.js # Scene transitions
│   ├── audioManager.js # Sound effects / procedural BGM
│   ├── inputManager.js # Keyboard input
│   ├── entities/       # Characters, enemies, and gear definitions
│   └── scenes/         # Town, battle, shop, clinic, dungeon, world map, forest, menu
└── assets/             # Sprite and background images
```

## Controls

- **Arrow Keys** — move character on grid scenes
- **Click** — interact with UI elements
- **I / Escape** — toggle inventory/menu

## E2E Tests

```bash
npm test          # Run all tests
npm run test:ui   # Run with Playwright UI
```

30 tests total: 25 passing, 5 quarantined (battle debug flow timing).

## Changelog

### v0.3.0 — Content Expansion, Gear System & Save Management

#### New Content
- **Expanded Forest** — Secret Grove shrine (+10 Max HP), Ancient Tree lore NPC, second hidden chest (150 Credits + 2 EMP Grenades), Corrupted Treant enemy
- **Expanded Dungeon** — Secret Armory (chest: 350 Credits + 3 EMP Grenades), Prison Cells with Captive Admin NPC, Server Room with terminal logs (100 Credits), 3 new enemy types (Firewall Guard, Logic Virus, Trap Node)

#### Gear & Weapon System
- **6 weapons** — Laser Sword, Plasma Axe, Neural Whip, Quantum Blade, Glitch Dagger, Data Cannon (ATK 10-50, some with speed bonuses)
- **6 armors** — Kevlar Vest, Nano-Mesh Suit, Firewall Shield, Phase Armor, Stealth Cloak, Titan Plating (DEF 8-40, some with speed bonuses)
- **Speed bonuses** — gear modifies turn order
- **Material drops** — 6 craftable materials from enemy defeats
- **Materials tab** — new inventory tab in menu

#### Save File Management
- **3 save slots** — independent saves with detailed info (party levels, credits, location, timestamp)
- **Save/Load/Delete** — full management from pause menu
- **Title screen selector** — shows all existing saves on game start

#### Battle & Item Improvements
- **Hi-Cyber-Potion** (120 HP heal, 120C) and **Data-Ether** (40 MP restore, 80C)
- **Tabbed shop** — Items, Weapons, Armor categories
- **Ether support** — MP healing items work in battle

### v0.2.0 — Forest, QOL & Systems Overhaul

#### New Content
- **Whispering Forest** — new explorable area between world map and dungeon
- **New enemy types** — Cyber Wolf and Data Wraith with unique abilities
- **Updated progression path** — Town → World Map → Forest → Dungeon → Boss

#### Battle Improvements
- **Item menu** — use Cyber-Potions and EMP-Grenades during combat
- **Post-battle recovery** — 15% HP/MP restore after victories
- **Revive on defeat** — retry option instead of instant game over
- **Temporary defense buffs** — expire after 3 turns

#### System Features
- **Save/Load** — single save with localStorage
- **Tutorial overlay** — first-play controls guide
- **Procedural BGM** — area-specific background music
- **Boss scaling capped** — level multiplier capped at level 7

### v0.1.0 — Initial Release
- Turn-based combat with Attack, Ability, Defend, Run
- Town, World Map, and Dungeon exploration
- Shop and Clinic interiors
- Character leveling with skill trees
- Inventory system with consumables and gear
