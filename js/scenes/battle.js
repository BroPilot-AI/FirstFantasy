import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { createEnemyGroup } from '../entities/enemies.js';
import { audio } from '../audioManager.js';

export class BattleScene {
    constructor() {
        this.el = null;
        this.enemies = [];
        this.activeUnitTimer = null;
        this.dungeonPos = null;
    }

    init(el) {
        this.el = el;
        this.el.innerHTML = `
            <div class="battle-top" data-testid="battle-top">
                <div class="party-container" id="party-container" data-testid="party-container"></div>
                <div class="enemy-container" id="enemy-container" data-testid="enemy-container"></div>
            </div>
            <div class="battle-bottom" data-testid="battle-bottom">
                <div class="battle-menu-container">
                    <div class="battle-menu" id="main-menu" data-testid="battle-main-menu">
                        <button class="cyber-btn" id="btn-attack" data-testid="btn-attack">Attack</button>
                        <button class="cyber-btn" id="btn-ability" data-testid="btn-ability">Ability</button>
                        <button class="cyber-btn" id="btn-item" data-testid="btn-item">Item</button>
                        <button class="cyber-btn" id="btn-defend" data-testid="btn-defend">Defend</button>
                        <button class="cyber-btn" id="btn-run" data-testid="btn-run">Run</button>
                    </div>
                    <div class="battle-menu" id="item-menu" data-testid="battle-item-menu" style="display:none;">
                        <!-- Items injected here -->
                    </div>
                    <div class="battle-menu" id="ability-menu" data-testid="battle-ability-menu" style="display:none;">
                        <!-- Abilities injected here -->
                    </div>
                    <div class="battle-menu" id="target-menu" data-testid="battle-target-menu" style="display:none;">
                        <!-- Targets injected here -->
                    </div>
                </div>
                <div class="battle-log" id="battle-log" data-testid="battle-log"></div>
            </div>
        `;
    }

    start(params) {
        this.dungeonPos = params ? params.dungeonPos : null;
        this.forestPos = params ? params.forestPos : null;
        this.encounterType = params ? params.encounterType : null;
        this.isBoss = params && params.isBoss;
        this.turnCount = 0;
        this.tempBuffs = []; // Track temporary buffs: { target, stat, amount, turnsLeft }
        
        // Calculate average party level
        let avgLevel = Math.max(1, Math.floor(gameState.party.reduce((sum, p) => sum + (p.level || 1), 0) / gameState.party.length));
        
        this.enemies = createEnemyGroup(this.isBoss ? 'boss' : (this.encounterType || 'random'), avgLevel);
        
        // Setup initial party state for battle
        gameState.party.forEach(c => c.isDefending = false);

        this.updateUI();
        this.logMessage(`A battle begins (Threat Level ${avgLevel})!`, "action");
        this.nextTurn();
        
        audio.playBGM('battle');
    }

    stop() {
        if(this.activeUnitTimer) clearTimeout(this.activeUnitTimer);
        const log = document.getElementById('battle-log');
        if (log) log.innerHTML = '';
        this.resetMenus();
        audio.stopBGM();
        if (this.el) this.el.innerHTML = '';
    }

    getAllUnits() {
        const p = gameState.party.filter(c => c.hp > 0).map(c => ({...c, type: 'player', ref: c}));
        const e = this.enemies.filter(e => e.hp > 0).map(e => ({...e, type: 'enemy', ref: e}));
        return [...p, ...e];
    }

    checkWinCondition() {
        const aliveEnemies = this.enemies.filter(e => e.hp > 0);
        if (aliveEnemies.length === 0) {
            let totalXp = this.enemies.reduce((a,b) => a + (b.xp || 0), 0);
            let totalCreds = this.enemies.reduce((a,b) => a + (b.credits || 0), 0);
            gameState.credits += totalCreds;
            let leveledUp = gameState.addXp(totalXp);
            
            // Post-battle recovery: restore 15% HP and MP
            gameState.party.forEach(c => {
                if (c.hp > 0) {
                    c.hp = Math.min(c.maxHp, c.hp + Math.floor(c.maxHp * 0.15));
                    c.mp = Math.min(c.maxMp, c.mp + Math.floor(c.maxMp * 0.15));
                }
            });
            
            this.logMessage(`Victory! Gained ${totalXp} XP and ${totalCreds} Credits!`, "heal");
            if (leveledUp) this.logMessage(`The party Leveled Up!`, "critical");
            this.logMessage(`Party recovers 15% HP and MP.`, "heal");
            
            this.updateUI();
            
            setTimeout(() => {
                if (this.isBoss) {
                    document.getElementById('ui-layer').innerHTML = `
                        <div class="overlay-message active" style="pointer-events: auto;">
                            <h1 style="color:var(--neon-green)">SYSTEM OVERRIDE SUCCESSFUL</h1>
                            <p>You have defeated the Giant Orange Taco and saved the cyber-grid.</p>
                            <button class="cyber-btn" onclick="location.reload()">REBOOT SYSTEM</button>
                        </div>
                    `;
                } else if (this.forestPos) {
                    sceneManager.changeScene('forest', { x: this.forestPos.x, y: this.forestPos.y, returningFromBattle: true });
                } else {
                    sceneManager.changeScene('dungeon', { x: this.dungeonPos.x, y: this.dungeonPos.y, returningFromBattle: true });
                }
            }, 3000);
            return true;
        }

        const alivePlayers = gameState.party.filter(p => p.hp > 0);
        if (alivePlayers.length === 0) {
            this.logMessage("The party was defeated...", "damage");
            setTimeout(() => {
                document.getElementById('ui-layer').innerHTML = `
                    <div class="overlay-message active" style="pointer-events: auto;">
                        <h1 style="color:red">SYSTEM FAILURE</h1>
                        <p>Your connection has been terminated.</p>
                        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                            <button class="cyber-btn" id="btn-retry">RETRY (Keep Items)</button>
                            <button class="cyber-btn" id="btn-reload">RESTART GAME</button>
                        </div>
                    </div>
                `;
                document.getElementById('btn-retry').onclick = () => {
                    gameState.party.forEach(c => {
                        c.hp = Math.floor(c.maxHp * 0.5);
                        c.mp = Math.floor(c.maxMp * 0.5);
                    });
                    document.getElementById('ui-layer').innerHTML = '';
                    if (this.forestPos) {
                        sceneManager.changeScene('forest', { x: this.forestPos.x, y: this.forestPos.y, returningFromBattle: true });
                    } else {
                        sceneManager.changeScene('dungeon', { returningFromBattle: true, pos: this.dungeonPos });
                    }
                };
                document.getElementById('btn-reload').onclick = () => location.reload();
            }, 2000);
            return true;
        }
        return false;
    }

    nextTurn() {
        if (this.checkWinCondition()) return;

        this.turnCount++;
        this.expireBuffs();

        const units = this.getAllUnits();
        
        // Extremely simple turn resolver: pick random based on speed weighting
        const totalSpeed = units.reduce((sum, u) => sum + u.speed, 0);
        let rand = Math.random() * totalSpeed;
        let activeUnit = units[0];
        
        for(let u of units) {
            rand -= u.speed;
            if (rand <= 0) { activeUnit = u; break; }
        }

        this.updateUI(activeUnit);

        if (activeUnit.type === 'enemy') {
            this.disableMenu();
            this.activeUnitTimer = setTimeout(() => this.executeEnemyTurn(activeUnit), 1000);
        } else {
            this.enableMainActions(activeUnit);
            this.logMessage(`Waiting for ${activeUnit.name}'s command...`, 'action');
        }
    }

    executeEnemyTurn(enemyUnit) {
        const alivePlayers = gameState.party.filter(p => p.hp > 0);
        const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        
        // Determine ability or attack
        let isMagic = enemyUnit.abilities && enemyUnit.abilities.length > 0 && Math.random() > 0.5;
        let animClass = isMagic ? 'anim-magic' : 'anim-attack';

        this.animateAction(enemyUnit, animClass, 400);

        setTimeout(() => {
            let dealtDamage = false;
            if (isMagic) {
                const ab = enemyUnit.abilities[Math.floor(Math.random() * enemyUnit.abilities.length)];
                this.logMessage(`${enemyUnit.name} uses ${ab.name}!`, "action");
                if (ab.damage) {
                    this.dealDamage(target, ab.damage);
                    dealtDamage = true;
                } else if (ab.defBuff) {
                    const turns = ab.turns || 3;
                    enemyUnit.ref.defense += ab.defBuff;
                    this.tempBuffs.push({
                        target: enemyUnit.ref,
                        stat: 'defense',
                        amount: ab.defBuff,
                        turnsLeft: turns
                    });
                    this.logMessage(`${enemyUnit.name} increases defense for ${turns} turns!`, "action");
                }
            } else {
                this.logMessage(`${enemyUnit.name} attacks!`, "action");
                this.dealDamage(target, enemyUnit.attack);
                dealtDamage = true;
            }
            
            this.updateUI();
            if (dealtDamage) this.animateAction(target, 'anim-damage', 400);

        }, 300);
        
        setTimeout(() => this.nextTurn(), 1500);
    }

    expireBuffs() {
        for (let i = this.tempBuffs.length - 1; i >= 0; i--) {
            const buff = this.tempBuffs[i];
            buff.turnsLeft--;
            if (buff.turnsLeft <= 0) {
                buff.target[buff.stat] = Math.max(0, buff.target[buff.stat] - buff.amount);
                this.tempBuffs.splice(i, 1);
            }
        }
    }

    dealDamage(targetUnit, amount) {
        audio.playDamageSound();
        const def = targetUnit.isDefending ? targetUnit.defense * 2 : targetUnit.defense;
        let dmg = Math.max(1, amount - Math.floor(def / 4));
        dmg = Math.floor(dmg * (0.8 + Math.random() * 0.4));
        
        targetUnit.hp -= dmg;
        if (targetUnit.hp < 0) targetUnit.hp = 0;

        this.logMessage(`${targetUnit.name} takes ${dmg} damage!`, "damage");
    }

    animateAction(unit, animClass, duration) {
        const el = document.getElementById(`unit-${unit.name.replace(/\s+/g,'-')}`);
        if(el) {
            el.classList.add(animClass);
            setTimeout(() => el.classList.remove(animClass), duration);
        }
    }

    healUnit(targetUnit, amount) {
        targetUnit.hp = Math.min(targetUnit.maxHp, targetUnit.hp + amount);
        this.logMessage(`${targetUnit.name} recovers ${amount} HP!`, "heal");
    }

    disableMenu() {
        document.querySelectorAll('.cyber-btn').forEach(b => b.disabled = true);
    }

    enableMainActions(playerUnit) {
        this.resetMenus();
        document.getElementById('btn-attack').onclick = () => this.showTargetMenu(playerUnit, 'attack');
        document.getElementById('btn-ability').onclick = () => this.showAbilityMenu(playerUnit);
        document.getElementById('btn-item').onclick = () => this.showItemMenu(playerUnit);
        document.getElementById('btn-defend').onclick = () => {
            playerUnit.ref.isDefending = true;
            this.logMessage(`${playerUnit.name} defends!`, "action");
            this.updateUI();
            this.nextTurn();
        };
        document.getElementById('btn-run').onclick = () => {
            if (this.enemies.find(e => e.spriteClass === 'boss-taco')) {
                this.logMessage("Can't run from Boss!", "damage");
            } else {
                this.logMessage("Got away safely!", "action");
                if (this.forestPos) {
                    setTimeout(() => sceneManager.changeScene('forest', { returningFromBattle: true, x: this.forestPos.x, y: this.forestPos.y }), 1000);
                } else {
                    setTimeout(() => sceneManager.changeScene('dungeon', { returningFromBattle: true, pos: this.dungeonPos }), 1000);
                }
            }
        };
    }

    showAbilityMenu(playerUnit) {
        document.getElementById('main-menu').style.display = 'none';
        const amap = document.getElementById('ability-menu');
        amap.style.display = 'flex';
        amap.innerHTML = '';

        const abBtn = document.createElement('button');
        abBtn.className = 'cyber-btn';
        abBtn.innerText = 'Back';
        abBtn.onclick = () => this.resetMenus();
        amap.appendChild(abBtn);

        playerUnit.abilities.forEach(ab => {
            const btn = document.createElement('button');
            btn.className = 'cyber-btn';
            btn.innerText = `${ab.name} (${ab.cost}MP)`;
            if (playerUnit.mp < ab.cost) btn.disabled = true;
            btn.onclick = () => {
                if (ab.type === 'heal' || ab.type === 'defend') {
                    this.showTargetMenu(playerUnit, 'ability', ab, gameState.party);
                } else {
                    this.showTargetMenu(playerUnit, 'ability', ab, this.enemies);
                }
            };
            amap.appendChild(btn);
        });
    }

    showItemMenu(playerUnit) {
        document.getElementById('main-menu').style.display = 'none';
        const imap = document.getElementById('item-menu');
        imap.style.display = 'flex';
        imap.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'cyber-btn';
        backBtn.innerText = 'Back';
        backBtn.onclick = () => this.resetMenus();
        imap.appendChild(backBtn);

        gameState.inventory.consumables.forEach(item => {
            if (item.amount <= 0) return;
            const btn = document.createElement('button');
            btn.className = 'cyber-btn';
            btn.innerText = `${item.name} (x${item.amount})`;
            btn.onclick = () => this.useItem(playerUnit, item);
            imap.appendChild(btn);
        });

        if (imap.children.length <= 1) {
            const emptyMsg = document.createElement('span');
            emptyMsg.style.color = '#666';
            emptyMsg.style.padding = '5px';
            emptyMsg.innerText = 'No items available';
            imap.appendChild(emptyMsg);
        }
    }

    useItem(playerUnit, item) {
        if (item.amount <= 0) return;
        item.amount--;

        if (item.heal) {
            const alivePlayers = gameState.party.filter(p => p.hp > 0);
            const target = alivePlayers.find(p => p.name === playerUnit.name) || alivePlayers[0];
            this.healUnit(target, item.heal);
            audio.playMagicSound();
        } else if (item.damage) {
            const aliveEnemies = this.enemies.filter(e => e.hp > 0);
            if (aliveEnemies.length > 0) {
                const target = aliveEnemies[0];
                this.logMessage(`${playerUnit.name} throws ${item.name} at ${target.name}!`, "action");
                this.dealDamage(target, item.damage);
                audio.playAttackSound();
                this.animateAction(target, 'anim-damage', 400);
            }
        }

        this.updateUI();
        this.disableMenu();
        setTimeout(() => this.nextTurn(), 1500);
    }

    showTargetMenu(playerUnit, actionType, ability = null, targetGroup = this.enemies) {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('ability-menu').style.display = 'none';
        const tmap = document.getElementById('target-menu');
        tmap.style.display = 'flex';
        tmap.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'cyber-btn';
        backBtn.innerText = 'Cancel';
        backBtn.onclick = () => this.resetMenus();
        tmap.appendChild(backBtn);

        targetGroup.forEach((u, i) => {
            if (u.hp <= 0) return;
            const btn = document.createElement('button');
            btn.className = 'cyber-btn';
            btn.innerText = `Target: ${u.name}`;
            btn.onclick = () => this.executePlayerAction(playerUnit, actionType, ability, u);
            tmap.appendChild(btn);
        });
    }

    resetMenus() {
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.display = 'flex';
        const abilityMenu = document.getElementById('ability-menu');
        if (abilityMenu) abilityMenu.style.display = 'none';
        const targetMenu = document.getElementById('target-menu');
        if (targetMenu) targetMenu.style.display = 'none';
        const itemMenu = document.getElementById('item-menu');
        if (itemMenu) itemMenu.style.display = 'none';
        document.querySelectorAll('.cyber-btn').forEach(b => b.disabled = false);
    }

    executePlayerAction(playerUnit, actionType, ability, target) {
        playerUnit.ref.isDefending = false;
        
        let animClass = actionType === 'attack' ? 'anim-attack' : 'anim-magic';
        this.animateAction(playerUnit, animClass, 400);

        setTimeout(() => {
            let dealtDamage = false;
            if (actionType === 'attack') {
                audio.playAttackSound();
                this.logMessage(`${playerUnit.name} attacks ${target.name}!`, "action");
                this.dealDamage(target, playerUnit.attack);
                dealtDamage = true;
            } else if (actionType === 'ability') {
                audio.playMagicSound();
                playerUnit.ref.mp -= ability.cost;
                this.logMessage(`${playerUnit.name} uses ${ability.name}! ${ability.flavor}`, "action");
                
                if (ability.damage) {
                    this.dealDamage(target, playerUnit.attack + ability.damage);
                    dealtDamage = true;
                } else if (ability.heal) {
                    this.healUnit(target, ability.heal);
                } else if (ability.defBuff) {
                    const turns = ability.turns || 3;
                    target.isDefending = true;
                    target.defense += ability.defBuff;
                    this.tempBuffs.push({
                        target: target,
                        stat: 'defense',
                        amount: ability.defBuff,
                        turnsLeft: turns
                    });
                    this.logMessage(`${target.name}'s defense is boosted for ${turns} turns!`, "heal");
                }
            }
            
            this.disableMenu();
            this.updateUI();
            if (dealtDamage) this.animateAction(target, 'anim-damage', 400);

        }, 300);

        setTimeout(() => this.nextTurn(), 1500);
    }

    updateUI(activeUnit = null) {
        // Player stats
        const pCont = document.getElementById('party-container');
        if(pCont) {
            pCont.innerHTML = gameState.party.map(c => `
                <div class="character-card ${c.hp <= 0 ? 'dead' : ''} ${activeUnit && activeUnit.name === c.name ? 'active-character' : ''}" id="unit-${c.name.replace(/\s+/g,'-')}">
                    ${c.sprite ? `<img src="${c.sprite}" class="battle-sprite" style="width:60px;height:60px;margin-right:15px;object-fit:cover;border-radius:5px;">` : ''}
                    <div class="char-info">
                        <strong>${c.name} (Lv.${c.level})</strong>
                        <div class="stats-text">
                            <span>HP: ${c.hp}/${c.maxHp}</span>
                        </div>
                        <div class="health-bar-container"><div class="health-bar" style="width: ${(c.hp/c.maxHp)*100}%"></div></div>
                        <div class="stats-text">
                            <span>MP: ${c.mp}/${c.maxMp}</span>
                        </div>
                        <div class="mp-bar-container"><div class="mp-bar" style="width: ${(c.mp/c.maxMp)*100}%"></div></div>
                    </div>
                </div>
            `).join('');
        }

        // Enemy stats
        const eCont = document.getElementById('enemy-container');
        if(eCont) {
            eCont.innerHTML = this.enemies.map(e => {
                if (e.hp <= 0) return '';
                return `
                <div class="${e.spriteClass} ${activeUnit && activeUnit.name === e.name ? 'active-character' : ''}" id="unit-${e.name.replace(/\s+/g,'-')}">
                    ${e.sprite ? `<img src="${e.sprite}" style="max-width:100px; max-height:100px; flex: 1; object-fit:contain;">` : ''}
                    <span>${e.name}</span>
                    <div class="health-bar-container"><div class="health-bar" style="width: ${(e.hp/e.maxHp)*100}%"></div></div>
                </div>
                `;
            }).join('');
        }
    }

    logMessage(msg, typeClass) {
        const log = document.getElementById('battle-log');
        if(log) {
            const el = document.createElement('div');
            el.className = `log-entry ${typeClass}`;
            el.innerText = msg;
            log.appendChild(el);
            while (log.children.length > 50) {
                log.removeChild(log.firstChild);
            }
            log.scrollTop = log.scrollHeight;
        }
    }
}
