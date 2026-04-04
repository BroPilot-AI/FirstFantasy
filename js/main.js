import { sceneManager } from './sceneManager.js';
import { audio } from './audioManager.js';
import { gameState } from './gameState.js';
import { InputManager } from './inputManager.js';

window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayText = document.getElementById('overlay-text');
    const overlayBtn = document.getElementById('overlay-btn');

    overlayTitle.innerText = "CyberTaco RPG";
    overlayText.innerText = "The Giant Orange Taco threatens the neon city! Gather your party.";
    overlayBtn.innerText = "START GAME";
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
        
        window.__testHelpers = {
            triggerBattle: (isBoss = false) => {
                sceneManager.changeScene('battle', { isBoss });
            },
            getSceneManager: () => sceneManager,
            getGameState: () => gameState
        };
        
        overlayBtn.removeEventListener('click', startFn);
    };

    const loadFn = () => {
        audio.init();
        overlay.classList.remove('active');
        if (gameState.load()) {
            sceneManager.init();
            sceneManager.changeScene('town');
        } else {
            gameState.init();
            sceneManager.init();
            sceneManager.changeScene('town');
        }
        overlayBtn.removeEventListener('click', loadFn);
    };

    overlayBtn.addEventListener('click', startFn);

    if (gameState.hasSave()) {
        overlayText.innerText += "\n\nA save file was found.";
        const loadBtn = document.createElement('button');
        loadBtn.className = 'cyber-btn';
        loadBtn.innerText = 'LOAD GAME';
        loadBtn.style.marginTop = '10px';
        overlay.appendChild(loadBtn);
        loadBtn.addEventListener('click', loadFn);
    }
});
