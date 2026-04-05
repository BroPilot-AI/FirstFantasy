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

        // New: Secret armory room (west side, row 5)
        for(let x=2; x<=5; x++) { this.mapData[5][x] = 0; }
        for(let y=4; y<=6; y++) { this.mapData[y][3] = 0; }
        this.mapData[4][4] = 0; this.mapData[4][5] = 0;
        this.mapData[6][4] = 0; this.mapData[6][5] = 0;

        // New: Prison cells (east side, row 9)
        for(let x=14; x<=17; x++) { this.mapData[9][x] = 0; }
        for(let y=8; y<=10; y++) { this.mapData[y][16] = 0; }
        this.mapData[8][15] = 0; this.mapData[10][15] = 0;

        // New: Server room (center-left, row 12)
        for(let x=6; x<=9; x++) { this.mapData[12][x] = 0; }
        for(let y=11; y<=13; y++) { this.mapData[y][7] = 0; }
        this.mapData[11][8] = 0; this.mapData[11][9] = 0;
        this.mapData[13][8] = 0; this.mapData[13][9] = 0;

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

        // Place interactables
        this.buildings = [];

        // Dungeon chest in armory
        if (!gameState.dungeonChestOpened) {
            this.buildings.push({ x: 3, y: 5, w: 1, h: 1, id: 'dungeon_chest', sprite: 'assets/cyber_chest.png' });
        }

        // Prisoner NPC who gives hints
        this.buildings.push({ x: 15, y: 9, w: 1, h: 1, id: 'prisoner', sprite: 'assets/hacker_sprite_1775220089185.png' });

        // Server terminal with lore
        this.buildings.push({ x: 8, y: 12, w: 1, h: 1, id: 'server_terminal', sprite: 'assets/cyber_building_1775236601593.png' });

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

        // Random encounter chance (15%, dungeon enemies)
        if (Math.random() < 0.15) {
            audio._playTone(200, 'sawtooth', 0.5, 0.8);
            sceneManager.changeScene('battle', { isBoss: false, dungeonPos: { x: this.playerPos.x, y: this.playerPos.y }, encounterType: 'dungeon' });
        }
    }

    onInteract(target) {
        if (target.id === 'dungeon_chest') {
            gameState.dungeonChestOpened = true;
            gameState.credits += 350;
            const emp = gameState.inventory.consumables.find(c => c.id === 'emp');
            if (emp) emp.amount += 3;
            this.showOverlay("ARMORY CACHE", "Found 350 Credits and 3 EMP Grenades!");
            this.buildings = this.buildings.filter(b => b.id !== 'dungeon_chest');
            const domNode = this.gridContainer.querySelector('[data-building-id="dungeon_chest"]');
            if (domNode) domNode.remove();
        } else if (target.id === 'prisoner') {
            const hints = [
                "I was a sysadmin before the Taco took over. The boss has a weakness... it cycles between offense and defense. Watch for the shell defense!",
                "There's an armory hidden in the west wing. I stashed some supplies there before they caught me.",
                "The server room to the south holds logs of the corruption. The Taco came from the deep web...",
                "If you defeat the Boss, the whole network should reset. Please... you're our only hope."
            ];
            this.showOverlay("CAPTIVE ADMIN", hints[Math.floor(Math.random() * hints.length)]);
        } else if (target.id === 'server_terminal') {
            if (!gameState.serverTerminalRead) {
                gameState.serverTerminalRead = true;
                gameState.credits += 100;
                this.showOverlay("SERVER LOGS", "Accessing corrupted server logs... Found 100 Credits in a dormant account. The Boss's power source is the Core Server at the North end.");
            } else {
                this.showOverlay("SERVER LOGS", "The terminal flickers. Most data is corrupted beyond recovery. The Boss looms to the North.");
            }
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
