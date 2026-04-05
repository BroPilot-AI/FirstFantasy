import { TownScene } from './scenes/town.js';
import { WorldMapScene } from './scenes/worldMap.js';
import { DungeonScene } from './scenes/dungeon.js';
import { BattleScene } from './scenes/battle.js';
import { ClinicScene } from './scenes/clinic.js';
import { ShopScene } from './scenes/shop.js';
import { MenuScene } from './scenes/menu.js';
import { ForestScene } from './scenes/forest.js';

class SceneManager {
    constructor() {
        this.container = null;
        this.currentScene = null;
        this.scenes = {};
        this.menuActive = false;
    }

    init() {
        this.container = document.getElementById('scene-container');
        
        this.scenes = {
            'town': new TownScene(),
            'worldMap': new WorldMapScene(),
            'dungeon': new DungeonScene(),
            'battle': new BattleScene(),
            'clinic': new ClinicScene(),
            'shop': new ShopScene(),
            'menu': new MenuScene(),
            'forest': new ForestScene()
        };

        // Create DOM elements for each scene
        for (const [key, scene] of Object.entries(this.scenes)) {
            const el = document.createElement('div');
            el.id = `${key}-scene`;
            el.className = 'scene';
            if(key === 'menu') el.style.zIndex = '500'; // keep overlay top level
            scene.init(el);
            this.container.appendChild(el);
        }
    }

    toggleMenu() {
        if (!this.currentScene || this.currentScene.name === 'battle' || this.currentScene.name === 'shop' || this.currentScene.name === 'clinic') return;
        
        let menuEl = document.getElementById('menu-scene');
        if (!this.menuActive) {
            this.menuActive = true;
            menuEl.classList.add('active');
            this.scenes['menu'].init(menuEl);
            this.scenes['menu'].start();
        } else {
            this.menuActive = false;
            menuEl.classList.remove('active');
            this.scenes['menu'].stop();
        }
    }

    changeScene(sceneName, params = null) {
        if (this.currentScene) {
            this.currentScene.stop();
            document.getElementById(`${this.currentScene.name}-scene`).classList.remove('active');
        }

        // Only clear battle/gameover overlays, preserve the base overlay structure
        const uiLayer = document.getElementById('ui-layer');
        const overlays = uiLayer.querySelectorAll('.overlay-message.active');
        overlays.forEach(o => o.remove());

        const nextScene = this.scenes[sceneName];
        if (nextScene) {
            nextScene.name = sceneName;
            this.currentScene = nextScene;
            const el = document.getElementById(`${sceneName}-scene`);
            el.classList.add('active');
            nextScene.init(el);
            nextScene.start(params);
        }
    }
}

export const sceneManager = new SceneManager();
