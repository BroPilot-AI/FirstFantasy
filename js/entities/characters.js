export const characters = [
    {
        id: 'hacker',
        name: 'Hacker',
        sprite: 'assets/hacker_sprite_1775220089185.png',
        maxHp: 80,
        maxMp: 50,
        attack: 15,
        defense: 10,
        speed: 15,
        skillTree: [
            { unlockLevel: 1, name: 'Glitch', cost: 10, damage: 25, type: 'attack', flavor: 'Throws a nasty logical error!' },
            { unlockLevel: 3, name: 'System Overload', cost: 25, damage: 60, type: 'attack', flavor: 'Surges the grid!' },
            { unlockLevel: 5, name: 'Firewall', cost: 20, defBuff: 15, type: 'defend', flavor: 'Raises a protective barrier.' }
        ],
        abilities: []
    },
    {
        id: 'samurai_cat',
        name: 'Samurai Pizza Cat',
        sprite: 'assets/samurai_cat_1775220102412.png',
        maxHp: 100,
        maxMp: 30,
        attack: 25,
        defense: 12,
        speed: 20,
        skillTree: [
            { unlockLevel: 1, name: 'Claw Slash', cost: 5, damage: 30, type: 'attack', flavor: 'Slashes with fury!' },
            { unlockLevel: 3, name: 'Feline Speed', cost: 15, defBuff: 5, type: 'defend', flavor: 'Boosts evasive defense!' },
            { unlockLevel: 5, name: 'Noodle Strike', cost: 20, damage: 70, type: 'attack', flavor: 'Hot and deadly.' }
        ],
        abilities: []
    },
    {
        id: 'tech_medic',
        name: 'Tech-Medic',
        sprite: 'assets/tech_medic_1775220115223.png',
        maxHp: 70,
        maxMp: 80,
        attack: 8,
        defense: 8,
        speed: 12,
        skillTree: [
            { unlockLevel: 1, name: 'Nano-Heal', cost: 15, heal: 40, type: 'heal', flavor: 'Deploys healing nanites.' },
            { unlockLevel: 3, name: 'Defibrillate', cost: 35, heal: 100, type: 'heal', flavor: 'CLEAR!' },
            { unlockLevel: 5, name: 'Bio-Toxin', cost: 25, damage: 45, type: 'attack', flavor: 'Injects lethal poison.' }
        ],
        abilities: []
    }
];
