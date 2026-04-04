import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class ClinicScene {
    constructor() {
        this.el = null;
        this.params = null;
    }

    init(el) {
        this.el = el;
        this.el.innerHTML = `
            <div id="clinic-scene" data-testid="clinic-scene" style="width:100%;height:100%;display:flex;flex-direction:row;background:#0d0221;color:white;padding:20px;box-sizing:border-box;">
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; border-right:2px solid #0f0; padding-right:20px;">
                    <img src="assets/cyber_doc_1775236649213.png" style="width:200px; height:200px; border:2px solid #0f0; border-radius:10px; margin-bottom:20px; object-fit:cover;">
                    <div style="color:#0f0; font-size:20px; text-transform:uppercase; margin-bottom:10px;">Dr. Chrome</div>
                    <p id="clinic-dialogue" data-testid="clinic-dialogue" style="text-align:center; font-style:italic;">"Need a tune up? I can patch your crew up for 50 credits."</p>
                </div>
                <div style="flex:1; padding-left:20px; display:flex; flex-direction:column; justify-content:center;">
                    <div style="font-size:24px; color:var(--neon-blue); margin-bottom:20px;">Credits: <span id="clinic-credits" data-testid="clinic-credits">0</span></div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button class="cyber-btn" id="btn-heal" data-testid="btn-heal" style="font-size:18px;">Full Heal Party (50C)</button>
                        <button class="cyber-btn" id="btn-leave-clinic" data-testid="btn-leave-clinic" style="font-size:18px; margin-top:20px;">Leave Clinic</button>
                    </div>
                </div>
            </div>
        `;
    }

    start(params) {
        this.params = params;
        this.updateUI();
        
        document.getElementById('btn-heal').onclick = () => {
            if (gameState.credits >= 50) {
                gameState.credits -= 50;
                gameState.party.forEach(char => {
                    char.hp = char.maxHp;
                    char.mp = char.maxMp;
                });
                audio.playSelectSound();
                document.getElementById('clinic-dialogue').innerText = '"Good as new! Try not to get your circuits scrambled out there."';
                this.updateUI();
            } else {
                audio.playBumpSound();
                document.getElementById('clinic-dialogue').innerText = '"You are short on credits, chomba. No freebies here."';
            }
        };

        document.getElementById('btn-leave-clinic').onclick = () => {
            sceneManager.changeScene('town', { pos: this.params.returnPos, returningFromInterior: true });
        };
    }

    stop() {
    }

    updateUI() {
        document.getElementById('clinic-credits').innerText = gameState.credits;
    }
}
