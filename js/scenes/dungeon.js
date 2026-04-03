import { GridScene } from './gridScene.js';
import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class DungeonScene extends GridScene {
    start(params) {
        this.mapData = Array(15).fill(null).map(() => Array(20).fill(1)); // All wall
        
        // Dig a simple maze
        for(let y=1; y<14; y++) {
            for(let x=1; x<19; x++) {
                if (y % 2 !== 0 && x % 2 !== 0) {
                    this.mapData[y][x] = 0; // Empty
                    // chance to connect
                    if (Math.random() > 0.5 && x < 17) this.mapData[y][x+1] = 0;
                    if (Math.random() > 0.5 && y < 13) this.mapData[y+1][x] = 0;
                }
            }
        }

        // Make a central path if random generation blocked it
        for(let y=1; y<14; y++) { this.mapData[y][10] = 0; }

        // Exit back to map
        this.mapData[14][10] = 2;
        this.mapData[13][10] = 0;
        
        // Boss Room trigger
        this.mapData[1][10] = 3; // Use NPC tile as Boss trigger

        // Change colors
        document.documentElement.style.setProperty('--bg-color', '#220011');
        document.documentElement.style.setProperty('--grid-color', '#440022');
        this.playerPos = { x: 10, y: 13 };

        if (params && params.pos) {
            this.playerPos = params.pos;
        }

        super.start(params);
        
        if (!params || !params.returningFromBattle) {
            this.showOverlay("TECH-DUNGEON", "Enemies lurk in the shadows. The Boss is at the North end.");
        }
    }

    onStep() {
        if (this.playerPos.y === 14 && this.playerPos.x === 10) {
            sceneManager.changeScene('worldMap', { from: 'dungeon' });
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
        const conf = confirm("Engage the Giant Orange Taco Boss?");
        if (conf) {
            sceneManager.changeScene('battle', { isBoss: true });
        }
    }

    stop() {
        super.stop();
        document.documentElement.style.setProperty('--bg-color', '#0d0221');
        document.documentElement.style.setProperty('--grid-color', '#241738');
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
