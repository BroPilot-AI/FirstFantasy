import { GridScene } from './gridScene.js';
import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';

export class TownScene extends GridScene {
    start(params) {
        this.buildings = [
            { x: 2, y: 2, w: 4, h: 3, id: 'shop', sprite: 'assets/cyber_shop_v3.png' },
            { x: 13, y: 2, w: 5, h: 3, id: 'clinic', sprite: 'assets/cyber_clinic_v3.png' },
            { x: 1, y: 8, w: 3, h: 2, id: 'bg-build1', sprite: 'assets/cyber_house_1.png' },
            { x: 12, y: 7, w: 3, h: 2, id: 'bg-build2', sprite: 'assets/cyber_house_2.png' },
            { x: 9, y: 5, w: 2, h: 2, id: 'fountain', sprite: 'assets/cyber_fountain.png' },
            { x: 16, y: 8, w: 2, h: 2, id: 'robot', sprite: 'assets/smashed_robot.png' },
            { x: 2, y: 6, w: 2, h: 2, id: 'sign', sprite: 'assets/neon_sign.png' }
        ];

        this.mapData = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 5, 5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5, 5, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 5, 5, 1],
            [1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 5, 5, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        this.playerPos = { x: 8, y: 12 };

        if(params && params.pos) {
            this.playerPos = params.pos;
        }

        super.start(params);
        if(!params || !params.returningFromInterior) {
            this.showOverlay("NEON TOWN", "Explore the new buildings or head South to the World Map.");
        }

        audio.playBGM('town');
    }

    onInteract(target) {
        if (target.id === 'shop') {
            sceneManager.changeScene('shop', { returnPos: {x: this.playerPos.x, y: this.playerPos.y} });
        } else if (target.id === 'clinic') {
            sceneManager.changeScene('clinic', { returnPos: {x: this.playerPos.x, y: this.playerPos.y} });
        } else if (target.id === 'fountain') {
            this.showOverlay("CYBER FOUNTAIN", "The radioactive water hums with heat. Best not to drink.");
        } else if (target.id === 'robot') {
            this.showOverlay("SMASHED ANDROID", "A busted security drone. Nothing of value is left.");
        } else if (target.id === 'sign') {
            this.showOverlay("NEON SIGN", "The flickering sign buzzes loudly overhead.");
        } else if (target.id === 'bg-build1') {
            this.showOverlay("APARTMENT COMPLEX", "The residential doors are permanently sealed. You don't have clearance to enter.");
        } else if (target.id === 'bg-build2') {
            this.showOverlay("TOWN HOUSE", "A quiet house with glowing satellite dishes. No one is answering.");
        }
    }

    onStep() {
        const val = this.mapData[this.playerPos.y][this.playerPos.x];
        if (val === 2) {
            sceneManager.changeScene('worldMap', { from: 'town' });
        }
    }

    interactNpc() {
        this.showOverlay("Local Fixer", "I hear the Shop and Clinic are newly refurbished. Be sure to gear up with some credits before fighting.");
    }

    showOverlay(title, text) {
        const overlay = document.getElementById('overlay');
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-text').innerText = text;
        const btn = document.getElementById('overlay-btn');
        btn.innerText = "Ok";
        
        // temporary hijack logic:
        const oldClick = btn.onclick;
        btn.onclick = () => {
            overlay.classList.remove('active');
            btn.onclick = oldClick;
        };
        overlay.classList.add('active');
    }

    getCompassDest() {
        if (this.playerPos.y >= 11) return 'South: World Map';
        if (this.playerPos.y <= 3 && this.playerPos.x >= 8 && this.playerPos.x <= 11) return '';
        return 'Explore Town';
    }
}
