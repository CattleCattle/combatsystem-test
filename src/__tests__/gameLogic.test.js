import {
  generateEnemy,
  generatePathOptions,
  generateUpgradeOptions,
  calculateDamage,
  applyUpgradeToBoar,
  getHpPercentage,
} from '../utils/gameLogic.js';

import { INITIAL_PLAYER_TEAM } from '../constants/gameData.js';

describe('Game Logic Tests', () => {
  describe('getHpPercentage', () => {
    test('should calculate correct HP percentage', () => {
      expect(getHpPercentage(50, 100)).toBe(50);
      expect(getHpPercentage(0, 100)).toBe(0);
      expect(getHpPercentage(100, 100)).toBe(100);
      expect(getHpPercentage(25, 50)).toBe(50);
    });
  });

  describe('generateEnemy', () => {
    test('should generate enemy with correct scaling', () => {
      const enemy1 = generateEnemy(1, 1.0);
      const enemy5 = generateEnemy(5, 1.0);
      
      expect(enemy1.hp).toBeGreaterThan(0);
      expect(enemy5.hp).toBeGreaterThan(enemy1.hp);
      expect(enemy1.name).toContain('Étage 1');
      expect(enemy5.name).toContain('Étage 5');
    });

    test('should apply difficulty multiplier', () => {
      // Tester plusieurs fois pour s'assurer de la consistance
      let normalEnemyTotal = 0;
      let eliteEnemyTotal = 0;
      const iterations = 10;
      
      for (let i = 0; i < iterations; i++) {
        const normalEnemy = generateEnemy(1, 1.0);
        const eliteEnemy = generateEnemy(1, 1.4);
        normalEnemyTotal += normalEnemy.hp + normalEnemy.attack;
        eliteEnemyTotal += eliteEnemy.hp + eliteEnemy.attack;
      }
      
      const normalAverage = normalEnemyTotal / iterations;
      const eliteAverage = eliteEnemyTotal / iterations;
      
      expect(eliteAverage).toBeGreaterThan(normalAverage);
    });
  });

  describe('generatePathOptions', () => {
    test('should return boss path on floor 5, 10, etc.', () => {
      const pathsFloor5 = generatePathOptions(5);
      const pathsFloor10 = generatePathOptions(10);
      
      expect(pathsFloor5).toHaveLength(1);
      expect(pathsFloor5[0].type).toBe('boss');
      expect(pathsFloor10).toHaveLength(1);
      expect(pathsFloor10[0].type).toBe('boss');
    });

    test('should return 3 non-boss paths on regular floors', () => {
      const pathsFloor1 = generatePathOptions(1);
      const pathsFloor3 = generatePathOptions(3);
      
      expect(pathsFloor1).toHaveLength(3);
      expect(pathsFloor3).toHaveLength(3);
      
      pathsFloor1.forEach(path => {
        expect(path.type).not.toBe('boss');
      });
    });
  });

  describe('generateUpgradeOptions', () => {
    test('should return 3 upgrade options', () => {
      const upgrades = generateUpgradeOptions();
      expect(upgrades).toHaveLength(3);
      
      upgrades.forEach(upgrade => {
        expect(upgrade).toHaveProperty('type');
        expect(upgrade).toHaveProperty('name');
        expect(upgrade).toHaveProperty('description');
      });
    });
  });

  describe('calculateDamage', () => {
    const mockAttacker = { attack: 30 };
    const mockDefender = { defense: 15 };
    const mockMove = { damage: 25 };

    test('should calculate damage based on stats', () => {
      const damage = calculateDamage(mockAttacker, mockDefender, mockMove);
      
      expect(damage).toBeGreaterThan(0);
      expect(typeof damage).toBe('number');
    });

    test('should have some randomness in damage calculation', () => {
      const damages = [];
      for (let i = 0; i < 10; i++) {
        damages.push(calculateDamage(mockAttacker, mockDefender, mockMove));
      }
      
      // Les dégâts ne devraient pas tous être identiques (randomness)
      const uniqueDamages = [...new Set(damages)];
      expect(uniqueDamages.length).toBeGreaterThan(1);
    });

    test('should return at least 1 damage', () => {
      const weakMove = { damage: 1 };
      const strongDefender = { defense: 1000 };
      const weakAttacker = { attack: 1 };
      
      const damage = calculateDamage(weakAttacker, strongDefender, weakMove);
      expect(damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe('applyUpgradeToBoar', () => {
    let testBoar;

    beforeEach(() => {
      testBoar = {
        id: 1,
        name: 'Test Boar',
        hp: 50,
        maxHp: 100,
        attack: 25,
        defense: 15,
        speed: 20,
        moves: [
          { name: 'Attack', damage: 20, type: 'physical' }
        ]
      };
    });

    test('should apply HP upgrade correctly', () => {
      const upgrade = { type: 'hp', value: 20 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(upgradedBoar.maxHp).toBe(120);
      expect(upgradedBoar.hp).toBe(70);
    });

    test('should apply attack upgrade correctly', () => {
      const upgrade = { type: 'attack', value: 5 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(upgradedBoar.attack).toBe(30);
    });

    test('should apply defense upgrade correctly', () => {
      const upgrade = { type: 'defense', value: 5 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(upgradedBoar.defense).toBe(20);
    });

    test('should apply speed upgrade correctly', () => {
      const upgrade = { type: 'speed', value: 5 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(upgradedBoar.speed).toBe(25);
    });

    test('should apply heal upgrade correctly', () => {
      const upgrade = { type: 'heal', value: 0.5 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(upgradedBoar.hp).toBe(100); // 50 + (100 * 0.5) = 100 (capped at maxHp)
    });

    test('should apply move upgrade correctly', () => {
      const upgrade = { type: 'move_upgrade', value: 5 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(upgradedBoar.moves[0].damage).toBe(25);
    });

    test('should not modify original boar object', () => {
      const upgrade = { type: 'attack', value: 5 };
      const upgradedBoar = applyUpgradeToBoar(testBoar, upgrade);
      
      expect(testBoar.attack).toBe(25);
      expect(upgradedBoar.attack).toBe(30);
      expect(upgradedBoar).not.toBe(testBoar);
    });
  });
});
