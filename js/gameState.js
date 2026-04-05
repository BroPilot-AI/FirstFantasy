import { characters } from './entities/characters.js';

class GameState {
    constructor() {
        this.party = [];
        this.credits = 150;
        this.inventory = {
            consumables: [
                { id: 'potion', name: 'Cyber-Potion', amount: 3, heal: 50, cost: 50 },
                { id: 'emp', name: 'Emp-Grenade', amount: 1, damage: 60, cost: 100 },
                { id: 'hi_potion', name: 'Hi-Cyber-Potion', amount: 0, heal: 120, cost: 120 },
                { id: 'ether', name: 'Data-Ether', amount: 0, mpHeal: 40, cost: 80 }
            ],
            gear: [],
            materials: []
        };
        this.playerMapPos = { x: 1, y: 1 };
        this.worldChestOpened = false;
        this.forestCampUsed = false;
        this.forestChestOpened = false;
        this.forestChest2Opened = false;
        this.forestShrineVisited = false;
        this.dungeonChestOpened = false;
        this.serverTerminalRead = false;
        this.tutorialSeen = false;
    }

    init() {
        this.party = characters.map(c => {
            let clone = JSON.parse(JSON.stringify(c));
            clone.level = 1;
            clone.xp = 0;
            clone.xpToNext = 100;
            clone.weapon = null;
            clone.armor = null;
            this.updateCharacterStats(clone);
            clone.hp = clone.maxHp;
            clone.mp = clone.maxMp;
            
            clone.abilities = [];
            if (clone.skillTree) {
                clone.skillTree.forEach(skill => {
                    if (clone.level >= skill.unlockLevel) {
                        clone.abilities.push(JSON.parse(JSON.stringify(skill)));
                    }
                });
            }
            
            return clone;
        });
        console.log("Game state initialized with party:", this.party);
    }

    updateCharacterStats(char) {
        const base = characters.find(c => c.id === char.id);
        const levelMult = 1 + ((char.level - 1) * 0.25); // +25% stats per level
        
        char.maxHp = Math.floor(base.maxHp * levelMult);
        char.maxMp = Math.floor(base.maxMp * levelMult);
        char.baseAttack = Math.floor(base.attack * levelMult);
        char.baseDefense = Math.floor(base.defense * levelMult);
        char.baseSpeed = Math.floor(base.speed * levelMult);
        char.speed = char.baseSpeed;
        
        const wpnBonus = char.weapon ? char.weapon.bonus : 0;
        const armBonus = char.armor ? char.armor.bonus : 0;
        const wpnSpeed = char.weapon && char.weapon.speedBonus ? char.weapon.speedBonus : 0;
        const armSpeed = char.armor && char.armor.speedBonus ? char.armor.speedBonus : 0;
        
        char.attack = char.baseAttack + wpnBonus;
        char.defense = char.baseDefense + armBonus;
        char.speed = char.baseSpeed + wpnSpeed + armSpeed;
    }

    addXp(amount) {
        let leveledUp = false;
        this.party.forEach(char => {
            if(char.hp <= 0) return; // Dead don't level
            char.xp += amount;
            while (char.xp >= char.xpToNext) {
                char.xp -= char.xpToNext;
                char.level++;
                char.xpToNext = Math.floor(char.xpToNext * 1.5);
                leveledUp = true;
                this.updateCharacterStats(char);
                char.hp = char.maxHp;
                char.mp = char.maxMp;
                
                if (char.skillTree) {
                    char.skillTree.forEach(skill => {
                        if (char.level === skill.unlockLevel) {
                            if(!char.abilities) char.abilities = [];
                            char.abilities.push(JSON.parse(JSON.stringify(skill)));
                            console.log(`Unlocked new skill: ${skill.name}`);
                        }
                    });
                }
            }
        });
        return leveledUp;
    }

    save(slot = 0) {
        const data = {
            party: this.party,
            credits: this.credits,
            inventory: this.inventory,
            playerMapPos: this.playerMapPos,
            worldChestOpened: this.worldChestOpened,
            forestCampUsed: this.forestCampUsed,
            forestChestOpened: this.forestChestOpened,
            forestChest2Opened: this.forestChest2Opened,
            forestShrineVisited: this.forestShrineVisited,
            dungeonChestOpened: this.dungeonChestOpened,
            serverTerminalRead: this.serverTerminalRead,
            tutorialSeen: this.tutorialSeen,
            savedAt: new Date().toISOString()
        };
        try {
            localStorage.setItem(`cybertaco_save_${slot}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    load(slot = 0) {
        try {
            const raw = localStorage.getItem(`cybertaco_save_${slot}`);
            if (!raw) return false;
            const data = JSON.parse(raw);
            this.party = data.party;
            this.credits = data.credits;
            this.inventory = data.inventory;
            this.playerMapPos = data.playerMapPos;
            this.worldChestOpened = data.worldChestOpened;
            this.forestCampUsed = data.forestCampUsed;
            this.forestChestOpened = data.forestChestOpened;
            this.forestChest2Opened = data.forestChest2Opened || false;
            this.forestShrineVisited = data.forestShrineVisited || false;
            this.dungeonChestOpened = data.dungeonChestOpened || false;
            this.serverTerminalRead = data.serverTerminalRead || false;
            this.tutorialSeen = data.tutorialSeen;
            if (!this.inventory.materials) this.inventory.materials = [];
            return true;
        } catch (e) {
            console.error('Load failed:', e);
            return false;
        }
    }

    getSaveInfo(slot = 0) {
        try {
            const raw = localStorage.getItem(`cybertaco_save_${slot}`);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return {
                exists: true,
                savedAt: data.savedAt || null,
                partyLevels: data.party ? data.party.map(p => ({ name: p.name, level: p.level })) : [],
                credits: data.credits || 0,
                location: this._getLocationName(data)
            };
        } catch (e) {
            return null;
        }
    }

    _getLocationName(data) {
        if (data.dungeonChestOpened) return 'Dungeon';
        if (data.forestChestOpened) return 'Forest';
        if (data.worldChestOpened) return 'World Map';
        return 'Town';
    }

    deleteSave(slot = 0) {
        try {
            localStorage.removeItem(`cybertaco_save_${slot}`);
            return true;
        } catch (e) {
            console.error('Delete failed:', e);
            return false;
        }
    }

    hasSave(slot = 0) {
        return localStorage.getItem(`cybertaco_save_${slot}`) !== null;
    }

    hasAnySave() {
        for (let i = 0; i < 3; i++) {
            if (this.hasSave(i)) return true;
        }
        return false;
    }
}

export const gameState = new GameState();
