import { GridScene } from './gridScene.js';
import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class ForestScene extends GridScene {
    start(params) {
        this.mapData = Array(15).fill(null).map(() => Array(20).fill(1));
        
        // Build a winding maze with guaranteed paths
        // Main vertical corridor (slightly offset for variety)
        for(let y=1; y<14; y++) {
            this.mapData[y][10] = 0;
        }
        
        // Horizontal corridors connecting to main path
        for(let x=3; x<18; x++) { this.mapData[3][x] = 0; }
        for(let x=2; x<11; x++) { this.mapData[7][x] = 0; }
        for(let x=10; x<18; x++) { this.mapData[7][x] = 0; }
        for(let x=3; x<17; x++) { this.mapData[11][x] = 0; }
        
        // Vertical connectors
        for(let y=3; y<8; y++) { this.mapData[y][3] = 0; }
        for(let y=3; y<8; y++) { this.mapData[y][17] = 0; }
        for(let y=7; y<12; y++) { this.mapData[y][6] = 0; }
        for(let y=7; y<12; y++) { this.mapData[y][14] = 0; }
        
        // Extra rooms for exploration
        this.mapData[5][5] = 0; this.mapData[5][6] = 0; this.mapData[6][5] = 0; this.mapData[6][6] = 0;
        this.mapData[9][15] = 0; this.mapData[9][16] = 0; this.mapData[10][15] = 0; this.mapData[10][16] = 0;
        this.mapData[4][14] = 0; this.mapData[4][15] = 0; this.mapData[5][14] = 0; this.mapData[5][15] = 0;
        
        // Connect rooms to corridors
        for(let x=4; x<=6; x++) { this.mapData[5][x] = 0; }
        for(let x=14; x<=16; x++) { this.mapData[9][x] = 0; }
        for(let y=4; y<=6; y++) { this.mapData[y][15] = 0; }
        
        // Clear tiles around entrance area for signpost
        for(let x=11; x<=14; x++) { this.mapData[2][x] = 0; }
        for(let x=11; x<=14; x++) { this.mapData[3][x] = 0; }

        // Entrance from World Map (North) - wide path
        this.mapData[1][9] = 2;
        this.mapData[1][10] = 2;
        this.mapData[0][9] = 0;
        this.mapData[0][10] = 0;

        // Exit to Dungeon (South) - wide path
        this.mapData[13][9] = 2;
        this.mapData[13][10] = 2;
        this.mapData[14][9] = 0;
        this.mapData[14][10] = 0;

        // Place interactables on guaranteed empty tiles
        this.buildings = [];
        
        // Signpost near entrance (east side)
        this.buildings.push({ x: 12, y: 2, w: 1, h: 1, id: 'signpost', sprite: 'assets/neon_sign.png' });

        // Campfire rest spot (east room)
        if (!gameState.forestCampUsed) {
            this.buildings.push({ x: 15, y: 9, w: 1, h: 1, id: 'campfire', sprite: 'assets/cyber_chest.png' });
        }

        // Hidden treasure (west room)
        if (!gameState.forestChestOpened) {
            this.buildings.push({ x: 5, y: 5, w: 1, h: 1, id: 'forest_chest', sprite: 'assets/cyber_chest.png' });
        }

        // Position player
        if (params && params.from === 'worldMap') {
            this.playerPos = { x: 10, y: 2 };
        } else if (params && params.from === 'dungeon') {
            this.playerPos = { x: 10, y: 12 };
        } else if (params && params.returningFromBattle && params.x !== undefined) {
            this.playerPos = { x: params.x, y: params.y };
        } else {
            this.playerPos = { x: 10, y: 2 };
        }

        // Forest colors
        document.documentElement.style.setProperty('--bg-color', '#0a1a0a');
        document.documentElement.style.setProperty('--grid-color', '#1a3a1a');

        super.start(params);
        
        if (!params || !params.returningFromBattle) {
            this.showOverlay("WHISPERING FOREST", "The data-trees hum with corrupted energy. Navigate the maze to reach the Dungeon to the South.");
        }

        audio.playBGM('forest');
    }

    onStep() {
        // North exit -> world map
        if (this.playerPos.y === 1 && this.playerPos.x >= 9 && this.playerPos.x <= 10) {
            sceneManager.changeScene('worldMap', { from: 'forest' });
            return;
        }

        // South exit -> dungeon
        if (this.playerPos.y === 13 && this.playerPos.x >= 9 && this.playerPos.x <= 10) {
            sceneManager.changeScene('dungeon', { from: 'forest' });
            return;
        }

        // Random encounter (12% chance)
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
            this.showOverlay("FOREST SIGN", "DANGER: Corrupted data entities ahead. South leads to the Tech-Dungeon. North leads back to the World Map.");
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
        if (this.playerPos.y <= 2) return 'North: World Map';
        if (this.playerPos.y >= 12) return 'South: Dungeon';
        return 'Whispering Forest';
    }
}
