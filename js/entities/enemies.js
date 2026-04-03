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
    'boss': {
        name: 'Giant Orange Taco',
        sprite: 'assets/boss_taco_1775220168032.png',
        maxHp: 500,
        hp: 500,
        attack: 30,
        defense: 20,
        speed: 18,
        xp: 500,
        credits: 500,
        spriteClass: 'boss-taco',
        abilities: [
            { name: 'Salsa Splash', damage: 35 },
            { name: 'Guacamole Slam', damage: 50 },
            { name: 'Crunchy Shell Defense', defBuff: 20 }
        ]
    }
};

export function createEnemyGroup(type, avgLevel = 1) {
    const levelMult = Math.pow(1.25, avgLevel - 1);
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
