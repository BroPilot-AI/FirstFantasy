export const enemyTypes = {
    'thug': {
        name: 'Neon Thug',
        sprite: 'assets/neon_thug_1775220130733.png',
        maxHp: 50,
        hp: 50,
        attack: 12,
        defense: 5,
        speed: 10,
        xp: 25,
        credits: 10,
        spriteClass: 'enemy-sprite',
        abilities: [
            { name: 'Laser Bat', damage: 15 },
            { name: 'Gutter Trash Talk', damage: 5 }
        ]
    },
    'drone': {
        name: 'Security Drone',
        sprite: 'assets/security_drone_1775220150120.png',
        maxHp: 40,
        hp: 40,
        attack: 18,
        defense: 15,
        speed: 22,
        xp: 35,
        credits: 15,
        spriteClass: 'enemy-sprite',
        abilities: [
            { name: 'Taser Dart', damage: 20 }
        ]
    },
    'forest_wolf': {
        name: 'Cyber Wolf',
        sprite: 'assets/neon_thug_1775220130733.png',
        maxHp: 35,
        hp: 35,
        attack: 10,
        defense: 4,
        speed: 20,
        xp: 18,
        credits: 8,
        spriteClass: 'enemy-sprite',
        abilities: [
            { name: 'Bite', damage: 12 },
            { name: 'Howl', defBuff: 5, turns: 2 }
        ]
    },
    'forest_spirit': {
        name: 'Data Wraith',
        sprite: 'assets/security_drone_1775220150120.png',
        maxHp: 30,
        hp: 30,
        attack: 14,
        defense: 3,
        speed: 16,
        xp: 22,
        credits: 12,
        spriteClass: 'enemy-sprite',
        abilities: [
            { name: 'Data Drain', damage: 16 },
            { name: 'Phase Shift', defBuff: 8, turns: 2 }
        ]
    },
    'boss': {
        name: 'Giant Orange Taco',
        sprite: 'assets/boss_taco_1775220168032.png',
        maxHp: 200,
        hp: 200,
        attack: 18,
        defense: 10,
        speed: 18,
        xp: 500,
        credits: 500,
        spriteClass: 'boss-taco',
        abilities: [
            { name: 'Salsa Splash', damage: 20 },
            { name: 'Guacamole Slam', damage: 30 },
            { name: 'Crunchy Shell Defense', defBuff: 10, turns: 3 }
        ]
    }
};

export function createEnemyGroup(type, avgLevel = 1) {
    const cappedLevel = Math.min(avgLevel, 7);
    const levelMult = Math.pow(1.2, cappedLevel - 1);
    const scale = (e) => {
        let cloned = JSON.parse(JSON.stringify(e));
        cloned.maxHp = Math.floor(cloned.maxHp * levelMult);
        cloned.hp = cloned.maxHp;
        cloned.attack = Math.floor(cloned.attack * levelMult);
        cloned.defense = Math.floor(cloned.defense * levelMult);
        cloned.speed = Math.floor(cloned.speed * levelMult);
        if(cloned.abilities) cloned.abilities.forEach(a => { if(a.damage) a.damage = Math.floor(a.damage * levelMult); });
        cloned.xp = Math.floor(cloned.xp * levelMult);
        return cloned;
    };

    if (type === 'boss') {
        return [scale(enemyTypes['boss'])];
    } else if (type === 'forest') {
        const count = Math.floor(Math.random() * 2) + 1;
        const group = [];
        const types = ['forest_wolf', 'forest_spirit'];
        for (let i = 0; i < count; i++) {
            const randType = types[Math.floor(Math.random() * types.length)];
            const def = scale(enemyTypes[randType]);
            def.name = `${def.name} ${String.fromCharCode(65 + i)}`;
            group.push(def);
        }
        return group;
    } else {
        const count = Math.floor(Math.random() * 3) + 1;
        const group = [];
        const types = ['thug', 'drone'];
        for (let i = 0; i < count; i++) {
            const randType = types[Math.floor(Math.random() * types.length)];
            const def = scale(enemyTypes[randType]);
            def.name = `${def.name} ${String.fromCharCode(65 + i)}`;
            group.push(def);
        }
        return group;
    }
}
