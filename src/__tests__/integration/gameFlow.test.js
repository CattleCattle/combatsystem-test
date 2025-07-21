/**
 * Tests d'intégration pour le flux de jeu complet
 */
import { describe, test, expect, beforeEach } from '@jest/globals';
import { generatePathOptions, generateEnemy, calculateDamage } from '../../utils/gameLogic.js';
import { INITIAL_PLAYER_TEAM, GAME_STATES } from '../../constants/gameData.js';

describe('Game Flow Integration Tests', () => {
  test('Initial game state is properly configured', () => {
    expect(INITIAL_PLAYER_TEAM).toBeDefined();
    expect(INITIAL_PLAYER_TEAM.length).toBeGreaterThan(0);
    expect(GAME_STATES).toBeDefined();
    expect(GAME_STATES.MENU).toBeDefined();
    expect(GAME_STATES.PATH_CHOICE).toBeDefined();
    expect(GAME_STATES.BATTLE).toBeDefined();
  });

  test('Path generation works for all floors', () => {
    for (let floor = 1; floor <= 10; floor++) {
      const paths = generatePathOptions(floor);
      expect(paths).toBeDefined();
      expect(Array.isArray(paths)).toBe(true);
      expect(paths.length).toBeGreaterThan(0);
      
      paths.forEach(path => {
        expect(path).toHaveProperty('name');
        expect(path).toHaveProperty('description');
        expect(path).toHaveProperty('type');
        expect(path).toHaveProperty('icon');
        expect(path).toHaveProperty('difficulty');
        expect(path).toHaveProperty('reward');
      });
    }
  });

  test('Enemy generation scales with floor', () => {
    const enemy1 = generateEnemy(1, 1.0);
    const enemy5 = generateEnemy(5, 1.0);
    const enemy10 = generateEnemy(10, 1.0);

    expect(enemy1).toBeDefined();
    expect(enemy5).toBeDefined();
    expect(enemy10).toBeDefined();

    // Enemies should get stronger
    expect(enemy5.attack).toBeGreaterThan(enemy1.attack);
    expect(enemy10.attack).toBeGreaterThan(enemy5.attack);
  });

  test('Combat system calculates damage correctly', () => {
    const attacker = { attack: 30, name: "Test Attacker" };
    const defender = { defense: 15, name: "Test Defender" };
    const move = { damage: 25, name: "Test Move" };

    const damage = calculateDamage(attacker, defender, move);
    expect(damage).toBeGreaterThan(0);
    expect(typeof damage).toBe('number');
  });

  test('Player team has valid structure', () => {
    INITIAL_PLAYER_TEAM.forEach(boar => {
      expect(boar).toHaveProperty('id');
      expect(boar).toHaveProperty('name');
      expect(boar).toHaveProperty('hp');
      expect(boar).toHaveProperty('maxHp');
      expect(boar).toHaveProperty('attack');
      expect(boar).toHaveProperty('defense');
      expect(boar).toHaveProperty('moves');
      expect(Array.isArray(boar.moves)).toBe(true);
      expect(boar.moves.length).toBeGreaterThan(0);
    });
  });
});
