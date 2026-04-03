import { GridScene } from './gridScene.js';
import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';

export class WorldMapScene extends GridScene {
    start(params) {
        this.mapData = Array(15).fill(null).map(() => Array(20).fill(0));
        
        // Borders
        for(let i=0; i<20; i++) { this.mapData[0][i] = 1; this.mapData[14][i] = 1; }
        for(let i=0; i<15; i++) { this.mapData[i][0] = 1; this.mapData[i][19] = 1; }

        // Exit to Town (South)
        this.mapData[12][10] = 2; // Representing town
        // Exit to Dungeon (North)
        this.mapData[2][10] = 2; // Representing dungeon

        // Add some random mountains (obstacles) and trees
        this.buildings = [];
        for(let i=0; i<30; i++) {
            let x = Math.floor(Math.random() * 18) + 1;
            let y = Math.floor(Math.random() * 13) + 1;
            if (this.mapData[y][x] === 0 && y !== 12 && y !== 2) {
                // 50% chance for tree vs rock
                this.mapData[y][x] = Math.random() > 0.5 ? 5 : 1;
            }
        }

        // Add a treasure chest if it hasn't been opened
        if (!gameState.worldChestOpened) {
            this.buildings.push({ x: 5, y: 7, w: 1, h: 1, id: 'world_chest', sprite: 'assets/cyber_chest.png' });
        }

        if (params && params.from === 'town') {
            this.playerPos = { x: 10, y: 11 };
        } else if (params && params.from === 'dungeon') {
            this.playerPos = { x: 10, y: 3 };
        } else {
            this.playerPos = { x: 10, y: 7 };
        }

        // Change colors for world map
        document.documentElement.style.setProperty('--bg-color', '#021810');
        document.documentElement.style.setProperty('--grid-color', '#05311e');

        super.start(params);
    }

    onStep() {
        if (this.playerPos.y === 12 && this.playerPos.x === 10) {
            sceneManager.changeScene('town');
        } else if (this.playerPos.y === 2 && this.playerPos.x === 10) {
            sceneManager.changeScene('dungeon');
        }
    }

    onInteract(target) {
        if (target.id === 'world_chest') {
            if (!gameState.worldChestOpened) {
                gameState.worldChestOpened = true;
                gameState.credits += 500;
                this.showOverlay("SUPPLY CRATE", "You cracked open the crate and found 500 Credits!");
                // Remove chest visually from array
                this.buildings = this.buildings.filter(b => b.id !== 'world_chest');
                // Remove without triggering total scene wipe
                const domNode = Array.from(this.gridContainer.children).find(child => child.innerHTML && child.innerHTML.includes('cyber_chest.png'));
                if (domNode) domNode.remove();
            }
        }
    }

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
        // Reset colors
        document.documentElement.style.setProperty('--bg-color', '#0d0221');
        document.documentElement.style.setProperty('--grid-color', '#241738');
    }
}
