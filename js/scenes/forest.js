import { GridScene } from './gridScene.js';
import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class ForestScene extends GridScene {
    start(params) {
        this.mapData = Array(15).fill(null).map(() => Array(20).fill(0));
        
        // Borders (dense trees)
        for(let i=0; i<20; i++) { this.mapData[0][i] = 1; this.mapData[14][i] = 1; }
        for(let i=0; i<15; i++) { this.mapData[i][0] = 1; this.mapData[i][19] = 1; }

        // Exit to World Map (South) - wide path
        this.mapData[13][9] = 2;
        this.mapData[13][10] = 2;
        this.mapData[14][9] = 0;
        this.mapData[14][10] = 0;

        // Exit to Dungeon (North) - wide path
        this.mapData[1][9] = 2;
        this.mapData[1][10] = 2;
        this.mapData[0][9] = 0;
        this.mapData[0][10] = 0;

        // Dense forest with clear paths
        for(let y=1; y<14; y++) {
            for(let x=1; x<19; x++) {
                if (this.mapData[y][x] === 0) {
                    const isPath = (x >= 8 && x <= 11) || (y >= 11 && y <= 13 && x >= 8 && x <= 11) || (y >= 1 && y <= 3 && x >= 8 && x <= 11);
                    if (!isPath) {
                        this.mapData[y][x] = Math.random() > 0.35 ? 5 : (Math.random() > 0.5 ? 1 : 0);
                    }
                }
            }
        }

        // Campfire rest spot (east side)
        this.buildings = [];
        if (!gameState.forestCampUsed) {
            this.buildings.push({ x: 15, y: 7, w: 1, h: 1, id: 'campfire', sprite: 'assets/cyber_chest.png' });
        }

        // Hidden treasure (west side)
        if (!gameState.forestChestOpened) {
            this.buildings.push({ x: 3, y: 5, w: 1, h: 1, id: 'forest_chest', sprite: 'assets/cyber_chest.png' });
        }

        // Signpost (off the central path)
        this.buildings.push({ x: 12, y: 6, w: 1, h: 1, id: 'signpost', sprite: 'assets/neon_sign.png' });

        // Position player
        if (params && params.from === 'worldMap') {
            this.playerPos = { x: 10, y: 12 };
        } else if (params && params.from === 'dungeon') {
            this.playerPos = { x: 10, y: 2 };
        } else if (params && params.returningFromBattle && params.x !== undefined) {
            this.playerPos = { x: params.x, y: params.y };
        } else {
            this.playerPos = { x: 10, y: 7 };
        }

        // Forest colors
        document.documentElement.style.setProperty('--bg-color', '#0a1a0a');
        document.documentElement.style.setProperty('--grid-color', '#1a3a1a');

        super.start(params);
        
        if (!params || !params.returningFromBattle) {
            this.showOverlay("WHISPERING FOREST", "The data-trees hum with corrupted energy. Rest at the campfire or push North to the Dungeon.");
        }

        audio.playBGM('forest');
    }

    onStep() {
        // South exit -> world map
        if (this.playerPos.y === 13 && this.playerPos.x >= 9 && this.playerPos.x <= 10) {
            sceneManager.changeScene('worldMap', { from: 'forest' });
            return;
        }

        // North exit -> dungeon
        if (this.playerPos.y === 1 && this.playerPos.x >= 9 && this.playerPos.x <= 10) {
            sceneManager.changeScene('dungeon', { from: 'forest' });
            return;
        }

        // Random encounter (12% chance, lower than dungeon)
        if (Math.random() < 0.12) {
            audio._playTone(200, 'sawtooth', 0.5, 0.8);
            sceneManager.changeScene('battle', { isBoss: false, forestPos: { x: this.playerPos.x, y: this.playerPos.y }, encounterType: 'forest' });
        }
    }

    onInteract(target) {
        if (target.id === 'campfire') {
            gameState.forestCampUsed = true;
            gameState.party.forEach(c => {
                if (c.hp > 0) {
                    c.hp = Math.min(c.maxHp, c.hp + Math.floor(c.maxHp * 0.3));
                    c.mp = Math.min(c.maxMp, c.mp + Math.floor(c.maxMp * 0.3));
                }
            });
            this.showOverlay("CAMPFIRE", "You rest by the warm glow. Party recovered 30% HP and MP.");
            this.buildings = this.buildings.filter(b => b.id !== 'campfire');
            const domNode = this.gridContainer.querySelector('[data-building-id="campfire"]');
            if (domNode) domNode.remove();
        } else if (target.id === 'forest_chest') {
            gameState.forestChestOpened = true;
            gameState.credits += 200;
            const potion = gameState.inventory.consumables.find(c => c.id === 'potion');
            if (potion) potion.amount += 2;
            this.showOverlay("HIDDEN CACHE", "Found 200 Credits and 2 Cyber-Potions!");
            this.buildings = this.buildings.filter(b => b.id !== 'forest_chest');
            const domNode = this.gridContainer.querySelector('[data-building-id="forest_chest"]');
            if (domNode) domNode.remove();
        } else if (target.id === 'signpost') {
            this.showOverlay("FOREST SIGN", "DANGER: Corrupted data entities ahead. North leads to the Tech-Dungeon. South leads back to the World Map.");
        }
    }

    interactNpc() {}

    showOverlay(title, text) {
        const overlay = document.getElementById('overlay');
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-text').innerText = text;
        const btn = document.getElementById('overlay-btn');
        btn.innerText = "Ok";
        const oldClick = btn.onclick;
        btn.onclick = () => {
            overlay.classList.remove('active');
            btn.onclick = oldClick;
        };
        overlay.classList.add('active');
    }

    stop() {
        super.stop();
        document.documentElement.style.setProperty('--bg-color', '#0d0221');
        document.documentElement.style.setProperty('--grid-color', '#241738');
    }

    getCompassDest() {
        if (this.playerPos.y >= 12) return 'South: World Map';
        if (this.playerPos.y <= 2) return 'North: Dungeon';
        return 'Whispering Forest';
    }
}
