import { GridScene } from './gridScene.js';
import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class DungeonScene extends GridScene {
    start(params) {
        this.mapData = Array(15).fill(null).map(() => Array(20).fill(1));
        
        // Build guaranteed solvable maze: central corridor + side rooms
        // Central vertical corridor (always passable)
        for(let y=1; y<14; y++) {
            this.mapData[y][10] = 0;
        }
        
        // Horizontal corridors at key points
        for(let x=2; x<18; x++) {
            this.mapData[3][x] = 0;
            this.mapData[7][x] = 0;
            this.mapData[11][x] = 0;
        }
        
        // Vertical connectors
        for(let y=3; y<12; y++) { this.mapData[y][5] = 0; }
        for(let y=3; y<8; y++) { this.mapData[y][15] = 0; }
        
        // Random side rooms (guaranteed to connect to corridors)
        for(let i=0; i<8; i++) {
            let rx = Math.floor(Math.random() * 14) + 2;
            let ry = Math.floor(Math.random() * 10) + 2;
            this.mapData[ry][rx] = 0;
            if (rx < 19) this.mapData[ry][rx+1] = 0;
            if (ry < 14) this.mapData[ry+1][rx] = 0;
        }
        
        // Ensure boss tile is accessible (connect to corridor)
        this.mapData[1][10] = 0;
        this.mapData[1][9] = 0;
        this.mapData[1][11] = 0;
        this.mapData[2][10] = 0;

        // Exit back to forest (South)
        this.mapData[14][10] = 2;
        this.mapData[13][10] = 0;
        
        // Boss trigger (North center)
        this.mapData[1][10] = 3;

        // Change colors
        document.documentElement.style.setProperty('--bg-color', '#220011');
        document.documentElement.style.setProperty('--grid-color', '#440022');
        this.playerPos = { x: 10, y: 13 };

        if (params && params.pos) {
            this.playerPos = params.pos;
        } else if (params && params.x !== undefined && params.y !== undefined) {
            this.playerPos = { x: params.x, y: params.y };
        }

        super.start(params);
        
        if (!params || !params.returningFromBattle) {
            this.showOverlay("TECH-DUNGEON", "Enemies lurk in the shadows. The Boss is at the North end.");
        }

        audio.playBGM('dungeon');
    }

    onStep() {
        if (this.playerPos.y === 14 && this.playerPos.x === 10) {
            sceneManager.changeScene('forest', { from: 'dungeon' });
            return;
        }

        // Random encounter chance
        if (Math.random() < 0.15) {
            audio._playTone(200, 'sawtooth', 0.5, 0.8);
            // transition to battle scene!
            sceneManager.changeScene('battle', { isBoss: false, dungeonPos: { x: this.playerPos.x, y: this.playerPos.y } });
        }
    }

    interactNpc() {
        audio.playWinSound();
        const boss = this.getBossStats();
        const conf = confirm(`Engage the Giant Orange Taco Boss?\n\nHP: ${boss.hp} | ATK: ${boss.attack} | DEF: ${boss.defense}\nAbilities: ${boss.abilities}`);
        if (conf) {
            sceneManager.changeScene('battle', { isBoss: true });
        }
    }

    getBossStats() {
        const avgLevel = Math.max(1, Math.floor(gameState.party.reduce((sum, p) => sum + (p.level || 1), 0) / gameState.party.length));
        const levelMult = Math.pow(1.2, Math.min(avgLevel, 7) - 1);
        const hp = Math.floor(200 * levelMult);
        const atk = Math.floor(18 * levelMult);
        const def = Math.floor(10 * levelMult);
        const abilities = 'Salsa Splash, Guacamole Slam, Crunchy Shell Defense';
        return { hp, attack: atk, defense: def, abilities };
    }

    stop() {
        super.stop();
        document.documentElement.style.setProperty('--bg-color', '#0d0221');
        document.documentElement.style.setProperty('--grid-color', '#241738');
    }

    getCompassDest() {
        if (this.playerPos.y >= 13) return 'South: Forest';
        if (this.playerPos.y <= 2) return 'North: Boss Room';
        return 'Tech-Dungeon';
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
}
