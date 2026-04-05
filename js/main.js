import { sceneManager } from './sceneManager.js';
import { audio } from './audioManager.js';
import { gameState } from './gameState.js';
import { InputManager } from './inputManager.js';

window.__testHelpers = {
    triggerBattle: (isBoss = false) => {
        if (window.__sm && window.__sm.changeScene) {
            window.__sm.changeScene('battle', { isBoss });
        }
    },
    getSceneManager: () => window.__sm,
    getGameState: () => window.__gs
};

window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayText = document.getElementById('overlay-text');
    const overlayBtn = document.getElementById('overlay-btn');

    overlayTitle.innerText = "CyberTaco RPG";
    overlayText.innerText = "The Giant Orange Taco threatens the neon city! Gather your party.";
    overlayBtn.innerText = "NEW GAME";
    overlay.classList.add('active');

    InputManager.init();

    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyI' || e.code === 'Escape') {
            sceneManager.toggleMenu();
        }
    });

    const startFn = () => {
        audio.init();
        overlay.classList.remove('active');
        gameState.init();
        sceneManager.init();
        
        if (!gameState.tutorialSeen && !localStorage.getItem('cybertaco_tutorial')) {
            gameState.tutorialSeen = true;
            localStorage.setItem('cybertaco_tutorial', 'seen');
            setTimeout(() => {
                const tutOverlay = document.getElementById('overlay');
                document.getElementById('overlay-title').innerText = "HOW TO PLAY";
                document.getElementById('overlay-text').innerText = "Arrow Keys: Move | I: Menu/Inventory | Walk into buildings to interact | Space: Interact with NPCs";
                document.getElementById('overlay-btn').innerText = "Got it!";
                const oldClick = document.getElementById('overlay-btn').onclick;
                document.getElementById('overlay-btn').onclick = () => {
                    tutOverlay.classList.remove('active');
                    document.getElementById('overlay-btn').onclick = oldClick;
                };
                tutOverlay.classList.add('active');
            }, 500);
        }
        
        sceneManager.changeScene('town');
        
        const urlParams = new URLSearchParams(window.location.search);
        const debugMode = urlParams.get('debug');
        if (debugMode === 'battle') {
            setTimeout(() => sceneManager.changeScene('battle', { isBoss: false }), 500);
        } else if (debugMode === 'boss') {
            setTimeout(() => sceneManager.changeScene('battle', { isBoss: true }), 500);
        }
        
        window.__sm = sceneManager;
        window.__gs = gameState;
        window.__testHelpers = {
            triggerBattle: (isBoss = false) => {
                sceneManager.changeScene('battle', { isBoss });
            },
            getSceneManager: () => sceneManager,
            getGameState: () => gameState
        };
        
        overlayBtn.removeEventListener('click', startFn);
    };

    const loadFn = (slot) => {
        audio.init();
        overlay.classList.remove('active');
        if (gameState.load(slot)) {
            sceneManager.init();
            sceneManager.changeScene('town');
        } else {
            gameState.init();
            sceneManager.init();
            sceneManager.changeScene('town');
        }
        overlayBtn.removeEventListener('click', () => loadFn(0));
    };

    overlayBtn.addEventListener('click', startFn);

    if (gameState.hasAnySave()) {
        overlayText.innerText += "\n\nSave files found. Choose an option:";
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex; flex-direction:column; gap:8px; margin-top:10px;';
        
        for (let i = 0; i < 3; i++) {
            const info = gameState.getSaveInfo(i);
            if (info && info.exists) {
                const date = new Date(info.savedAt).toLocaleString();
                const levels = info.partyLevels.map(p => `Lv.${p.level}`).join('/');
                const btn = document.createElement('button');
                btn.className = 'cyber-btn';
                btn.style.cssText = 'font-size:12px; padding:8px;';
                btn.innerText = `LOAD SLOT ${i+1} | ${info.location} | ${levels} | Cr:${info.credits} | ${date}`;
                btn.addEventListener('click', () => loadFn(i));
                buttonContainer.appendChild(btn);
            }
        }
        
        const newGameBtn = document.createElement('button');
        newGameBtn.className = 'cyber-btn';
        newGameBtn.innerText = 'NEW GAME';
        newGameBtn.style.cssText = 'margin-top:5px;';
        newGameBtn.addEventListener('click', startFn);
        buttonContainer.appendChild(newGameBtn);
        
        overlay.appendChild(buttonContainer);
    }
});
