import { sceneManager } from '../sceneManager.js';
import { gameState } from '../gameState.js';
import { audio } from '../audioManager.js';

export class ShopScene {
    constructor() {
        this.el = null;
        this.params = null;
        this.inventory = [
            { id: 'potion', name: 'Cyber-Potion', type:'consumable', cost: 50 },
            { id: 'emp', name: 'Emp-Grenade', type:'consumable', cost: 100 },
            { id: 'wpn_laser', name: 'Laser Sword', type:'weapon', cost: 300, bonus: 15 },
            { id: 'arm_vest', name: 'Kevlar Vest', type:'armor', cost: 250, bonus: 10 }
        ];
    }

    init(el) {
        this.el = el;
        this.el.innerHTML = `
            <div style="width:100%;height:100%;display:flex;flex-direction:row;background:#0d0221;color:white;padding:20px;box-sizing:border-box;">
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; border-right:2px solid var(--neon-blue); padding-right:20px;">
                    <img src="assets/cyber_merchant_1775236635886.png" style="width:200px; height:200px; border:2px solid var(--neon-blue); border-radius:10px; margin-bottom:20px; object-fit:cover;">
                    <div style="color:var(--neon-blue); font-size:20px; text-transform:uppercase; margin-bottom:10px;">Merchant</div>
                    <p id="shop-dialogue" data-testid="shop-dialogue" style="text-align:center; font-style:italic;">"Welcome to my node! We've got gear and supplies. Take a look!"</p>
                </div>
                <div style="flex:1.5; padding-left:20px; display:flex; flex-direction:column; justify-content:flex-start;">
                    <div style="font-size:24px; color:var(--neon-blue); margin-bottom:20px; display:flex; justify-content:space-between;">
                        <span>Shop Inventory</span>
                        <span>Cr: <span id="shop-credits" data-testid="shop-credits">0</span></span>
                    </div>
                    <div id="shop-items" data-testid="shop-items" style="display:flex; flex-direction:column; gap:10px; overflow-y:auto; flex:1; padding-right:10px;">
                    </div>
                    <button class="cyber-btn" id="btn-leave-shop" data-testid="btn-leave-shop" style="margin-top:20px; font-size:18px;">Leave Shop</button>
                </div>
            </div>
        `;
    }

    start(params) {
        this.params = params;
        this.updateUI();

        document.getElementById('btn-leave-shop').onclick = () => {
            sceneManager.changeScene('town', { pos: this.params.returnPos, returningFromInterior: true });
        };
    }

    stop() {
        if (this.el) this.el.innerHTML = '';
        this.init(this.el);
    }

    buyItem(item) {
        if (gameState.credits >= item.cost) {
            gameState.credits -= item.cost;
            
            if (item.type === 'consumable') {
                let existing = gameState.inventory.consumables.find(i => i.id === item.id);
                if (existing) {
                    existing.amount++;
                } else {
                    gameState.inventory.consumables.push({...item, amount: 1});
                }
            } else if (item.type === 'weapon' || item.type === 'armor') {
                gameState.inventory.gear.push({...item});
            }
            
            audio.playSelectSound();
            document.getElementById('shop-dialogue').innerText = '"A solid choice! Trust me, you\'ll need it."';
            this.updateUI();
        } else {
            audio.playBumpSound();
            document.getElementById('shop-dialogue').innerText = '"You do not have enough credits for that, pal."';
        }
    }

    updateUI() {
        document.getElementById('shop-credits').innerText = gameState.credits;
        const container = document.getElementById('shop-items');
        container.innerHTML = '';
        
        this.inventory.forEach(item => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.border = '1px solid #333';
            div.style.padding = '10px';
            div.style.backgroundColor = 'rgba(0,0,0,0.5)';
            
            const info = document.createElement('div');
            info.innerHTML = `
                <div style="font-size:16px;"><strong>${item.name}</strong></div>
                <div style="font-size:12px; color:#aaa;">${item.type.toUpperCase()}${item.bonus ? ` (+${item.bonus})` : ''}</div>
            `;
            
            const btn = document.createElement('button');
            btn.className = 'cyber-btn';
            btn.innerText = `Buy (${item.cost}C)`;
            btn.onclick = () => this.buyItem(item);
            
            div.appendChild(info);
            div.appendChild(btn);
            container.appendChild(div);
        });
    }
}
