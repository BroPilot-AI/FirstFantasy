import { sceneManager } from './sceneManager.js';
import { audio } from './audioManager.js';
import { gameState } from './gameState.js';
import { InputManager } from './inputManager.js';

window.addEventListener('DOMContentLoaded', () => {
    // Show start menu using UI overlay
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayText = document.getElementById('overlay-text');
    const overlayBtn = document.getElementById('overlay-btn');

    overlayTitle.innerText = "CyberTaco RPG";
    overlayText.innerText = "The Giant Orange Taco threatens the neon city! Gather your party.";
    overlayBtn.innerText = "START GAME";
    overlay.classList.add('active');

    // Init inputs
    InputManager.init();

    // Global Pause/Inventory Input
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyI' || e.code === 'Escape') {
            sceneManager.toggleMenu();
        }
    });

    const startFn = () => {
        // Init audio context on user interaction
        audio.init();
        
        // Hide overlay
        overlay.classList.remove('active');

        // Start game
        gameState.init();
        sceneManager.init();
        sceneManager.changeScene('town');

        // Remove listener to prevent re-initialization 
        overlayBtn.removeEventListener('click', startFn);
    };

    overlayBtn.addEventListener('click', startFn);
});
