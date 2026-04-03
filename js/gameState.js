import { characters } from './entities/characters.js';

class GameState {
    constructor() {
        this.party = [];
        this.credits = 150;
        this.inventory = {
            consumables: [
                { id: 'potion', name: 'Cyber-Potion', amount: 3, heal: 50, cost: 50 },
                { id: 'emp', name: 'Emp-Grenade', amount: 1, damage: 60, cost: 100 }
            ],
            gear: []
        };
        this.playerMapPos = { x: 1, y: 1 }; 
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
        char.speed = Math.floor(base.speed * levelMult);
        
        const wpnBonus = char.weapon ? char.weapon.bonus : 0;
        const armBonus = char.armor ? char.armor.bonus : 0;
        
        char.attack = char.baseAttack + wpnBonus;
        char.defense = char.baseDefense + armBonus;
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
}

export const gameState = new GameState();
