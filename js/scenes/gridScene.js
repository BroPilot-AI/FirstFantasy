import { InputManager } from '../inputManager.js';
import { audio } from '../audioManager.js';

export class GridScene {
    constructor() {
        this.el = null;
        this.gridContainer = null;
        this.playerEl = null;
        this.cellSize = 40;
        this.width = 20; // 800px / 40px
        this.height = 15; // 600px / 40px
        
        this.playerPos = { x: 1, y: 1 };
        this.mapData = []; // 2D array: 0 = empty, 1 = obstacle, 2 = exit, 3 = npc
        
        this.lastMoveTime = 0;
        this.moveDelay = 150; // ms between moves
        this.loopId = null;
    }

    init(el) {
        this.el = el;
        this.el.innerHTML = `<div class="grid-map"><div class="map-grid-container"></div></div>`;
        this.gridContainer = this.el.querySelector('.map-grid-container');
    }

    start(params) {
        this.buildMap();
        this.loopId = requestAnimationFrame((t) => this.update(t));
    }

    stop() {
        cancelAnimationFrame(this.loopId);
        this.gridContainer.innerHTML = '';
        InputManager.clearInputs();
    }

    buildMap() {
        this.gridContainer.innerHTML = '';
        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                const val = this.mapData[y][x];
                if (val === 1 || val === 5) {
                    const obs = document.createElement('div');
                    obs.className = 'building-sprite';
                    if (val === 5) {
                        obs.innerHTML = `<img src="assets/cyber_tree_v3.png" style="width:100%;height:100%;object-fit:cover;border-radius:5px;">`;
                    } else if (val === 1) {
                        obs.innerHTML = `<img src="assets/cyber_woods.png" style="width:100%;height:100%;object-fit:cover;border-radius:5px;">`;
                    }
                    obs.style.width = this.cellSize + 'px';
                    obs.style.height = this.cellSize + 'px';
                    obs.style.position = 'absolute';
                    obs.style.backgroundColor = 'transparent';
                    obs.style.border = 'none';
                    
                    obs.style.left = `${x * this.cellSize}px`;
                    obs.style.top = `${y * this.cellSize}px`;
                    this.gridContainer.appendChild(obs);
                } else if (val === 2) {
                    const exit = document.createElement('div');
                    exit.className = 'exit';
                    exit.innerText = 'EXIT';
                    exit.style.left = `${x * this.cellSize}px`;
                    exit.style.top = `${y * this.cellSize}px`;
                    this.gridContainer.appendChild(exit);
                } else if (val === 3) {
                    const npc = document.createElement('div');
                    npc.className = 'npc';
                    npc.innerHTML = `<img src="assets/npc_fixer_1775236635886.png" onerror="this.src='assets/npc_fixer_1775220179718.png';" style="width:100%;height:100%;object-fit:cover;border-radius:5px;">`;
                    npc.style.left = `${x * this.cellSize}px`;
                    npc.style.top = `${y * this.cellSize}px`;
                    this.gridContainer.appendChild(npc);
                }
            }
        }

        // Render Buildings
        if (this.buildings) {
            this.buildings.forEach(b => {
                const obs = document.createElement('div');
                obs.className = 'building-sprite';
                obs.style.left = `${b.x * this.cellSize}px`;
                obs.style.top = `${b.y * this.cellSize}px`;
                obs.style.width = `${b.w * this.cellSize}px`;
                obs.style.height = `${b.h * this.cellSize}px`;
                obs.style.position = 'absolute';
                obs.style.zIndex = '5';
                obs.innerHTML = `<img src="${b.sprite}" style="width:100%;height:100%;object-fit:cover;">`;
                this.gridContainer.appendChild(obs);
            });
        }

        // Render player
        this.playerEl = document.createElement('div');
        this.playerEl.className = 'player';
        this.playerEl.innerHTML = `<img src="assets/hacker_sprite_1775220089185.png" style="width:100%;height:100%;object-fit:cover;border-radius:5px;">`;
        this.gridContainer.appendChild(this.playerEl);
        this.updatePlayerVisual();
    }

    updatePlayerVisual() {
        this.playerEl.style.left = `${this.playerPos.x * this.cellSize}px`;
        this.playerEl.style.top = `${this.playerPos.y * this.cellSize}px`;
    }

    update(time) {
        let isMoving = false;
        let dx = 0;
        let dy = 0;

        if (InputManager.isKeyDown('ArrowUp')) { dy = -1; isMoving = true; }
        else if (InputManager.isKeyDown('ArrowDown')) { dy = 1; isMoving = true; }
        else if (InputManager.isKeyDown('ArrowLeft')) { dx = -1; isMoving = true; }
        else if (InputManager.isKeyDown('ArrowRight')) { dx = 1; isMoving = true; }

        if (this.playerEl) {
            if (isMoving) this.playerEl.classList.add('walking');
            else this.playerEl.classList.remove('walking');
        }

        if (time - this.lastMoveTime > this.moveDelay) {
            if (dx !== 0 || dy !== 0) {
                const nx = this.playerPos.x + dx;
                const ny = this.playerPos.y + dy;
                let buildingIntercept = false;

                if (this.buildings) {
                    let bFind = this.buildings.find(b => nx >= b.x && nx < b.x + b.w && ny >= b.y && ny < b.y + b.h);
                    if (bFind) {
                        this.onInteract(bFind);
                        this.lastMoveTime = time;
                        buildingIntercept = true;
                    }
                }

                if (!buildingIntercept) {
                    if (this.canMove(nx, ny)) {
                        this.playerPos.x = nx;
                        this.playerPos.y = ny;
                        this.updatePlayerVisual();
                        this.lastMoveTime = time;
                        audio.playMoveSound();
                        
                        this.onStep();
                    } else {
                        audio.playBumpSound();
                        this.lastMoveTime = time;
                    }
                }
            }
        }

        this.loopId = requestAnimationFrame((t) => this.update(t));
    }

    canMove(x, y) {
        if (y < 0 || y >= this.mapData.length || x < 0 || x >= this.mapData[0].length) return false;
        // 1=wall, 3=npc, 4=building, 5=tree
        const val = this.mapData[y][x];
        if (val === 1 || val === 3 || val === 4 || val === 5) {
            if (val === 3) this.interactNpc();
            return false;
        }
        return true;
    }

    // To override
    onStep() {}
    interactNpc() {}
    onInteract(target) {}
}
