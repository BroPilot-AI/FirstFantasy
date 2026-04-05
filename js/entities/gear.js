export const gearDefinitions = {
    weapons: [
        { id: 'wpn_laser', name: 'Laser Sword', cost: 300, bonus: 15, tier: 1, description: 'A humming blade of focused light.' },
        { id: 'wpn_plasma', name: 'Plasma Axe', cost: 500, bonus: 25, tier: 2, description: 'Molten edge cuts through firewalls.' },
        { id: 'wpn_neural', name: 'Neural Whip', cost: 750, bonus: 35, tier: 3, description: 'Directly attacks the target\'s code.' },
        { id: 'wpn_quantum', name: 'Quantum Blade', cost: 1200, bonus: 50, tier: 4, description: 'Exists in two states: hit and miss.' },
        { id: 'wpn_glitch', name: 'Glitch Dagger', cost: 200, bonus: 10, speedBonus: 5, tier: 1, description: 'Unpredictable but fast.' },
        { id: 'wpn_cannon', name: 'Data Cannon', cost: 900, bonus: 45, speedBonus: -3, tier: 3, description: 'Heavy hitting but slow.' }
    ],
    armors: [
        { id: 'arm_vest', name: 'Kevlar Vest', cost: 250, bonus: 10, tier: 1, description: 'Basic ballistic protection.' },
        { id: 'arm_mesh', name: 'Nano-Mesh Suit', cost: 450, bonus: 18, tier: 2, description: 'Self-repairing nanofiber weave.' },
        { id: 'arm_barrier', name: 'Firewall Shield', cost: 700, bonus: 28, tier: 3, description: 'Projects a hard-light barrier.' },
        { id: 'arm_quantum', name: 'Phase Armor', cost: 1100, bonus: 40, tier: 4, description: 'Shifts between dimensions to absorb hits.' },
        { id: 'arm_cloak', name: 'Stealth Cloak', cost: 350, bonus: 8, speedBonus: 5, tier: 2, description: 'Bends light for evasion.' },
        { id: 'arm_heavy', name: 'Titan Plating', cost: 800, bonus: 35, speedBonus: -4, tier: 3, description: 'Massive protection, massive weight.' }
    ],
    materials: [
        { id: 'wolf_core', name: 'Wolf Core', description: 'A cybernetic wolf\'s processing core.' },
        { id: 'wraith_essence', name: 'Wraith Essence', description: 'Condensed data from a corrupted spirit.' },
        { id: 'treant_bark', name: 'Treant Bark', description: 'Armor-plated wood from a corrupted tree.' },
        { id: 'guard_chip', name: 'Guard Chip', description: 'Security protocol processor.' },
        { id: 'virus_sample', name: 'Virus Sample', description: 'Contained logic virus. Handle with care.' },
        { id: 'trap_wire', name: 'Trap Wire', description: 'Conductive wire from a trap node.' }
    ]
};

export function getWeaponById(id) {
    return gearDefinitions.weapons.find(w => w.id === id);
}

export function getArmorById(id) {
    return gearDefinitions.armors.find(a => a.id === id);
}

export function getAllShopGear() {
    return [...gearDefinitions.weapons, ...gearDefinitions.armors];
}
