import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class MenuScene {
    constructor() {
        this.el = null;
        this.activeTab = 'consumables';
        this.selectedCharacterIndex = 0;
    }

    init(el) {
        this.el = el;
        this.el.innerHTML = `
            <div id="pause-menu" data-testid="pause-menu" style="width:100%; height:100%; background:rgba(13, 2, 33, 0.95); border:3px solid var(--neon-purple); display:flex; flex-direction:row; padding:20px; box-sizing:border-box; color:var(--text-color); position:relative;">
                
                <!-- Left Panel: Characters -->
                <div style="flex:1; border-right:2px solid var(--neon-blue); padding-right:20px; display:flex; flex-direction:column; overflow-y:auto;" id="menu-party-container" data-testid="menu-party-container">
                    <!-- Injected via updateUI -->
                </div>

                <!-- Right Panel: Inventory -->
                <div style="flex:1; padding-left:20px; display:flex; flex-direction:column;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px;">
                        <h2 style="margin:0; color:var(--neon-pink);">SYSTEM MENU</h2>
                        <div style="color:yellow; font-weight:bold;">Credits: <span id="menu-credits" data-testid="menu-credits">0</span></div>
                    </div>
                    
                    <div style="display:flex; gap:10px; margin-bottom:15px;">
                        <button class="cyber-btn" id="tab-consumables" data-testid="tab-consumables" style="flex:1; font-size:12px;">Consumables</button>
                        <button class="cyber-btn" id="tab-gear" data-testid="tab-gear" style="flex:1; font-size:12px;">Gear</button>
                        <button class="cyber-btn" id="tab-skills" data-testid="tab-skills" style="flex:1; font-size:12px;">Skills</button>
                    </div>

                    <div id="menu-inventory-container" data-testid="menu-inventory-container" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:10px;">
                        <!-- Injected via updateUI -->
                    </div>

                    <button class="cyber-btn" id="btn-save-game" data-testid="btn-save-game" style="margin-top:10px;">Save Game</button>
                    <button class="cyber-btn" id="btn-close-menu" data-testid="btn-close-menu" style="margin-top:10px;">[ESC] Close Menu</button>
                </div>
            </div>
        `;
    }

    start() {
        this.selectedCharacterIndex = 0;
        this.updateUI();

        document.getElementById('tab-consumables').onclick = () => {
            this.activeTab = 'consumables';
            this.updateUI();
        };
        document.getElementById('tab-gear').onclick = () => {
            this.activeTab = 'gear';
            this.updateUI();
        };
        document.getElementById('tab-skills').onclick = () => {
            this.activeTab = 'skills';
            this.updateUI();
        };
        document.getElementById('btn-save-game').onclick = () => {
            if (gameState.save()) {
                audio.playWinSound();
                const saveBtn = document.getElementById('btn-save-game');
                saveBtn.innerText = 'Game Saved!';
                saveBtn.style.borderColor = 'var(--neon-green)';
                saveBtn.style.color = 'var(--neon-green)';
                setTimeout(() => {
                    saveBtn.innerText = 'Save Game';
                    saveBtn.style.borderColor = '';
                    saveBtn.style.color = '';
                }, 2000);
            }
        };
        document.getElementById('btn-close-menu').onclick = () => {
            sceneManager.toggleMenu();
        };
    }

    stop() {}

    unequip(charIndex, type) {
        const char = gameState.party[charIndex];
        if (type === 'weapon' && char.weapon) {
            gameState.inventory.gear.push(char.weapon);
            char.weapon = null;
        } else if (type === 'armor' && char.armor) {
            gameState.inventory.gear.push(char.armor);
            char.armor = null;
        }
        gameState.updateCharacterStats(char);
        audio.playSelectSound();
        this.updateUI();
    }

    equipFromInventory(itemIndex) {
        const item = gameState.inventory.gear[itemIndex];
        const char = gameState.party[this.selectedCharacterIndex];
        
        gameState.inventory.gear.splice(itemIndex, 1);
        
        if (item.type === 'weapon') {
            if (char.weapon) gameState.inventory.gear.push(char.weapon);
            char.weapon = item;
        } else if (item.type === 'armor') {
            if (char.armor) gameState.inventory.gear.push(char.armor);
            char.armor = item;
        }

        gameState.updateCharacterStats(char);
        audio.playSelectSound();
        this.updateUI();
    }

    updateUI() {
        document.getElementById('menu-credits').innerText = gameState.credits;
        
        const mapHTML = gameState.party.map((c, i) => `
            <div class="menu-character-card" data-testid="menu-char-card-${i}" style="border:1px solid ${this.selectedCharacterIndex === i ? 'white' : '#333'}; box-shadow:${this.selectedCharacterIndex === i ? '0 0 10px white' : 'none'}; padding:10px; margin-bottom:10px; background:rgba(0,0,0,0.5); cursor:pointer; transition:all 0.2s ease;" onclick="javascript:document.dispatchEvent(new CustomEvent('menu-select-char', {detail: ${i}}))">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #444; padding-bottom:5px; margin-bottom:5px;">
                    <div style="font-weight:bold; color:var(--neon-blue); font-size:18px;">${c.name}</div>
                    <div style="color:yellow; font-size:14px;">Lv.${c.level}</div>
                </div>
                
                <div style="display:flex; flex-direction:row; font-size:12px;">
                    <div style="flex:1;">
                        <div>HP: ${c.hp}/${c.maxHp}</div>
                        <div>MP: ${c.mp}/${c.maxMp}</div>
                        <div style="margin-top:5px; color:#aaa;">Exp: ${c.xp}/${c.xpToNext}</div>
                    </div>
                    <div style="flex:1;">
                        <div>ATK: ${c.attack} <span style="color:#666;">(Base:${c.baseAttack})</span></div>
                        <div>DEF: ${c.defense} <span style="color:#666;">(Base:${c.baseDefense})</span></div>
                        <div>SPD: ${c.speed}</div>
                    </div>
                </div>

                <div style="margin-top:10px; padding-top:5px; border-top:1px dashed #444; font-size:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:3px; align-items:center;">
                        <span>WPN: ${c.weapon ? c.weapon.name : '<span style="color:#555">None</span>'}</span>
                        ${c.weapon ? `<button class="cyber-btn" style="padding:2px 8px; font-size:10px; border-color:red; color:red;" onclick="event.stopPropagation(); document.dispatchEvent(new CustomEvent('menu-unequip', {detail: {idx: ${i}, type: 'weapon'}}))">Uneq</button>` : ''}
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>ARM: ${c.armor ? c.armor.name : '<span style="color:#555">None</span>'}</span>
                        ${c.armor ? `<button class="cyber-btn" style="padding:2px 8px; font-size:10px; border-color:red; color:red;" onclick="event.stopPropagation(); document.dispatchEvent(new CustomEvent('menu-unequip', {detail: {idx: ${i}, type: 'armor'}}))">Uneq</button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('menu-party-container').innerHTML = mapHTML;

        const invCont = document.getElementById('menu-inventory-container');
        invCont.innerHTML = '';
        
        if (this.activeTab === 'consumables') {
            document.getElementById('tab-consumables').style.backgroundColor = 'var(--neon-blue)';
            document.getElementById('tab-consumables').style.color = 'black';
            document.getElementById('tab-gear').style.backgroundColor = 'transparent';
            document.getElementById('tab-gear').style.color = 'var(--neon-blue)';
            document.getElementById('tab-skills').style.backgroundColor = 'transparent';
            document.getElementById('tab-skills').style.color = 'var(--neon-blue)';

            if (gameState.inventory.consumables.length === 0) {
                invCont.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px;">No consumables.</div>`;
            }

            gameState.inventory.consumables.forEach(item => {
                invCont.innerHTML += `
                    <div style="border:1px solid #333; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div><strong>${item.name}</strong></div>
                            <div style="font-size:12px; color:#aaa;">Qty: ${item.amount}</div>
                        </div>
                        <div style="font-size:12px; color:#555;">(In-Battle Only)</div>
                    </div>
                `;
            });
        } else if (this.activeTab === 'gear') {
            document.getElementById('tab-gear').style.backgroundColor = 'var(--neon-blue)';
            document.getElementById('tab-gear').style.color = 'black';
            document.getElementById('tab-consumables').style.backgroundColor = 'transparent';
            document.getElementById('tab-consumables').style.color = 'var(--neon-blue)';
            document.getElementById('tab-skills').style.backgroundColor = 'transparent';
            document.getElementById('tab-skills').style.color = 'var(--neon-blue)';

            if (gameState.inventory.gear.length === 0) {
                invCont.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px;">No gear in inventory.</div>`;
            }

            gameState.inventory.gear.forEach((item, idx) => {
                invCont.innerHTML += `
                    <div style="border:1px solid #444; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:16px;"><strong>${item.name}</strong></div>
                            <div style="font-size:12px; color:var(--neon-pink);">${item.type.toUpperCase()} (+${item.bonus})</div>
                        </div>
                        <button class="cyber-btn" style="font-size:12px; padding:5px 10px;" onclick="document.dispatchEvent(new CustomEvent('menu-equip', {detail: ${idx}}))">EQUIP</button>
                    </div>
                `;
            });
        } else if (this.activeTab === 'skills') {
            document.getElementById('tab-skills').style.backgroundColor = 'var(--neon-blue)';
            document.getElementById('tab-skills').style.color = 'black';
            document.getElementById('tab-consumables').style.backgroundColor = 'transparent';
            document.getElementById('tab-consumables').style.color = 'var(--neon-blue)';
            document.getElementById('tab-gear').style.backgroundColor = 'transparent';
            document.getElementById('tab-gear').style.color = 'var(--neon-blue)';
            
            const char = gameState.party[this.selectedCharacterIndex];
            invCont.innerHTML = `<h3 style="margin-top:0; color:var(--neon-blue); text-align:center;">${char.name}'s Skill Tree</h3>`;
            
            if (char.skillTree) {
                char.skillTree.forEach(skill => {
                    const unlocked = char.level >= skill.unlockLevel;
                    invCont.innerHTML += `
                        <div style="border:1px solid ${unlocked ? 'var(--neon-green)' : '#333'}; padding:10px; display:flex; justify-content:space-between; align-items:center; opacity:${unlocked ? '1' : '0.5'};">
                            <div>
                                <div style="font-size:16px; color:${unlocked ? 'white' : '#666'};"><strong>${skill.name}</strong></div>
                                <div style="font-size:12px; color:#aaa;">${skill.flavor}</div>
                            </div>
                            <div style="font-size:12px; color:${unlocked ? 'var(--neon-green)' : 'red'}; font-weight:bold;">
                                ${unlocked ? 'UNLOCKED' : `Lv. ${skill.unlockLevel} REQ`}
                            </div>
                        </div>
                    `;
                });
            }
        }
        
        const setupHook = (evtName, handler) => {
             const h = (e) => handler(e.detail);
             if(!this[`_${evtName}`]) {
                 this[`_${evtName}`] = h;
                 document.addEventListener(evtName, h);
             } else {
                 document.removeEventListener(evtName, this[`_${evtName}`]);
                 this[`_${evtName}`] = h;
                 document.addEventListener(evtName, h);
             }
        };

        setupHook('menu-select-char', (idx) => {
            this.selectedCharacterIndex = idx;
            audio.playSelectSound();
            this.updateUI();
        });

        setupHook('menu-unequip', (data) => {
            this.unequip(data.idx, data.type);
        });

        setupHook('menu-equip', (itemIndex) => {
            this.equipFromInventory(itemIndex);
        });
    }
}
