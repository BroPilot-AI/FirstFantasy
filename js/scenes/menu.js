import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class MenuScene {
    constructor() {
        this.el = null;
        this.activeTab = 'consumables';
        this.selectedCharacterIndex = 0;
        this.saveMode = false;
    }

    init(el) {
        this.el = el;
        this.el.innerHTML = `
            <div data-testid="pause-menu" style="width:100%; height:100%; background:rgba(13, 2, 33, 0.95); border:3px solid var(--neon-purple); display:flex; flex-direction:row; padding:20px; box-sizing:border-box; color:var(--text-color); position:relative;">
                
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
                        <button class="cyber-btn" id="tab-materials" data-testid="tab-materials" style="flex:1; font-size:12px;">Materials</button>
                        <button class="cyber-btn" id="tab-skills" data-testid="tab-skills" style="flex:1; font-size:12px;">Skills</button>
                    </div>

                    <div id="menu-inventory-container" data-testid="menu-inventory-container" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:10px; padding-right:10px;">
                        <!-- Injected via updateUI -->
                    </div>

                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button class="cyber-btn" id="btn-save-game" data-testid="btn-save-game" style="flex:1;">Save Game</button>
                        <button class="cyber-btn" id="btn-load-game" data-testid="btn-load-game" style="flex:1;">Load Game</button>
                    </div>
                    <button class="cyber-btn" id="btn-close-menu" data-testid="btn-close-menu" style="margin-top:10px;">[ESC] Close Menu</button>
                </div>
            </div>
        `;
    }

    start() {
        this.selectedCharacterIndex = 0;
        this.saveMode = false;
        this.updateUI();

        document.getElementById('tab-consumables').onclick = () => {
            this.activeTab = 'consumables';
            this.saveMode = false;
            this.updateUI();
        };
        document.getElementById('tab-gear').onclick = () => {
            this.activeTab = 'gear';
            this.saveMode = false;
            this.updateUI();
        };
        document.getElementById('tab-materials').onclick = () => {
            this.activeTab = 'materials';
            this.saveMode = false;
            this.updateUI();
        };
        document.getElementById('tab-skills').onclick = () => {
            this.activeTab = 'skills';
            this.saveMode = false;
            this.updateUI();
        };
        document.getElementById('btn-save-game').onclick = () => {
            this.saveMode = true;
            this.renderSaveSlots('save');
        };
        document.getElementById('btn-load-game').onclick = () => {
            this.saveMode = true;
            this.renderSaveSlots('load');
        };
        document.getElementById('btn-close-menu').onclick = () => {
            sceneManager.toggleMenu();
        };
    }

    stop() {
        if (this.el) this.el.innerHTML = '';
    }

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

    renderSaveSlots(mode) {
        const container = document.getElementById('menu-inventory-container');
        const label = mode === 'save' ? 'SELECT SAVE SLOT' : 'SELECT LOAD SLOT';
        let html = `<h3 style="margin-top:0; color:var(--neon-blue); text-align:center;">${label}</h3>`;

        for (let i = 0; i < 3; i++) {
            const info = gameState.getSaveInfo(i);
            if (info && info.exists) {
                const date = new Date(info.savedAt).toLocaleString();
                const levels = info.partyLevels.map(p => `${p.name} Lv.${p.level}`).join(', ');
                html += `
                    <div style="border:1px solid var(--neon-green); padding:10px; margin-bottom:8px; background:rgba(0,50,0,0.2);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <div style="font-size:14px; color:var(--neon-green);"><strong>Slot ${i + 1}</strong></div>
                                <div style="font-size:11px; color:#aaa;">${date}</div>
                                <div style="font-size:12px;">${levels}</div>
                                <div style="font-size:12px; color:yellow;">Cr: ${info.credits} | ${info.location}</div>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:5px;">
                                ${mode === 'save' ? `<button class="cyber-btn" style="font-size:11px; padding:4px 8px; border-color:var(--neon-green); color:var(--neon-green);" onclick="document.dispatchEvent(new CustomEvent('menu-save-slot', {detail: ${i}}))">OVERWRITE</button>` : ''}
                                ${mode === 'load' ? `<button class="cyber-btn" style="font-size:11px; padding:4px 8px; border-color:var(--neon-blue); color:var(--neon-blue);" onclick="document.dispatchEvent(new CustomEvent('menu-load-slot', {detail: ${i}}))">LOAD</button>` : ''}
                                <button class="cyber-btn" style="font-size:11px; padding:4px 8px; border-color:red; color:red;" onclick="document.dispatchEvent(new CustomEvent('menu-delete-slot', {detail: ${i}}))">DEL</button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div style="border:1px solid #333; padding:15px; margin-bottom:8px; text-align:center; color:#555;">
                        <div style="font-size:14px;"><strong>Slot ${i + 1}</strong></div>
                        <div style="font-size:12px;">Empty</div>
                        ${mode === 'save' ? `<button class="cyber-btn" style="font-size:11px; padding:4px 8px; margin-top:5px;" onclick="document.dispatchEvent(new CustomEvent('menu-save-slot', {detail: ${i}}))">SAVE HERE</button>` : ''}
                    </div>
                `;
            }
        }

        html += `<button class="cyber-btn" style="margin-top:10px;" onclick="document.dispatchEvent(new CustomEvent('menu-cancel-save'))">Back</button>`;
        container.innerHTML = html;

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

        setupHook('menu-save-slot', (slot) => {
            if (gameState.save(slot)) {
                audio.playWinSound();
                this.renderSaveSlots('save');
                const existing = container.querySelector('.save-success');
                if (existing) existing.remove();
                const msg = document.createElement('div');
                msg.className = 'save-success';
                msg.style.cssText = 'text-align:center; color:var(--neon-green); padding:10px; font-size:14px;';
                msg.innerText = 'Game Saved!';
                container.prepend(msg);
                setTimeout(() => msg.remove(), 2000);
            }
        });

        setupHook('menu-load-slot', (slot) => {
            if (gameState.load(slot)) {
                audio.playWinSound();
                sceneManager.toggleMenu();
                sceneManager.changeScene('town');
            }
        });

        setupHook('menu-delete-slot', (slot) => {
            if (confirm(`Delete save slot ${slot + 1}? This cannot be undone.`)) {
                gameState.deleteSave(slot);
                audio.playBumpSound();
                this.renderSaveSlots(mode);
            }
        });

        setupHook('menu-cancel-save', () => {
            this.saveMode = false;
            this.updateUI();
        });
    }

    updateUI() {
        if (this.saveMode) return;

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
                        <div>SPD: ${c.speed} <span style="color:#666;">(Base:${c.baseSpeed || c.speed})</span></div>
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
            document.getElementById('tab-materials').style.backgroundColor = 'transparent';
            document.getElementById('tab-materials').style.color = 'var(--neon-blue)';
            document.getElementById('tab-skills').style.backgroundColor = 'transparent';
            document.getElementById('tab-skills').style.color = 'var(--neon-blue)';

            if (gameState.inventory.consumables.length === 0) {
                invCont.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px;">No consumables.</div>`;
            }

            gameState.inventory.consumables.forEach(item => {
                const typeLabel = item.heal ? `HP+${item.heal}` : (item.mpHeal ? `MP+${item.mpHeal}` : `DMG+${item.damage}`);
                invCont.innerHTML += `
                    <div style="border:1px solid #333; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div><strong>${item.name}</strong></div>
                            <div style="font-size:12px; color:#aaa;">Qty: ${item.amount} (${typeLabel})</div>
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
            document.getElementById('tab-materials').style.backgroundColor = 'transparent';
            document.getElementById('tab-materials').style.color = 'var(--neon-blue)';
            document.getElementById('tab-skills').style.backgroundColor = 'transparent';
            document.getElementById('tab-skills').style.color = 'var(--neon-blue)';

            if (gameState.inventory.gear.length === 0) {
                invCont.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px;">No gear in inventory.</div>`;
            }

            gameState.inventory.gear.forEach((item, idx) => {
                const isWeapon = item.id.startsWith('wpn');
                const bonusLabel = isWeapon ? `ATK+${item.bonus}` : `DEF+${item.bonus}`;
                const speedLabel = item.speedBonus ? ` SPD${item.speedBonus > 0 ? '+' : ''}${item.speedBonus}` : '';
                invCont.innerHTML += `
                    <div style="border:1px solid #444; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:16px;"><strong>${item.name}</strong></div>
                            <div style="font-size:12px; color:var(--neon-pink);">${item.type.toUpperCase()} (${bonusLabel}${speedLabel})</div>
                            ${item.description ? `<div style="font-size:11px; color:#666; font-style:italic;">${item.description}</div>` : ''}
                        </div>
                        <button class="cyber-btn" style="font-size:12px; padding:5px 10px;" onclick="document.dispatchEvent(new CustomEvent('menu-equip', {detail: ${idx}}))">EQUIP</button>
                    </div>
                `;
            });
        } else if (this.activeTab === 'materials') {
            document.getElementById('tab-materials').style.backgroundColor = 'var(--neon-blue)';
            document.getElementById('tab-materials').style.color = 'black';
            document.getElementById('tab-consumables').style.backgroundColor = 'transparent';
            document.getElementById('tab-consumables').style.color = 'var(--neon-blue)';
            document.getElementById('tab-gear').style.backgroundColor = 'transparent';
            document.getElementById('tab-gear').style.color = 'var(--neon-blue)';
            document.getElementById('tab-skills').style.backgroundColor = 'transparent';
            document.getElementById('tab-skills').style.color = 'var(--neon-blue)';
            
            if (!gameState.inventory.materials || gameState.inventory.materials.length === 0) {
                invCont.innerHTML = `<div style="text-align:center; color:#555; margin-top:20px;">No materials collected. Defeat enemies to find drops!</div>`;
            }
            
            gameState.inventory.materials.forEach(mat => {
                invCont.innerHTML += `
                    <div style="border:1px solid #333; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div><strong>${mat.name}</strong></div>
                            <div style="font-size:12px; color:#aaa;">Qty: ${mat.amount}</div>
                        </div>
                        <div style="font-size:12px; color:#555;">(Crafting Material)</div>
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
            document.getElementById('tab-materials').style.backgroundColor = 'transparent';
            document.getElementById('tab-materials').style.color = 'var(--neon-blue)';
            
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
