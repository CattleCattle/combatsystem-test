/**
 * Tests pour les hooks useGameActions
 */
import { describe, test, expect, beforeEach } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useGameActions } from '../../hooks/useGameActions.js';
import { GameProvider } from '../../contexts/GameContext.js';

// Mock pour éviter les erreurs d'import de modules non-test
jest.mock('../../utils/gameLogic.js', () => ({
  generatePathOptions: jest.fn(() => [
    { name: "Combat", type: "combat", icon: "⚔️", difficulty: 1.0, reward: "upgrade", description: "Test path" }
  ]),
  generateEnemy: jest.fn(() => ({ name: "Test Enemy", hp: 100, attack: 20, defense: 10 })),
  generateUpgradeOptions: jest.fn(() => []),
  calculateDamage: jest.fn(() => 25),
  applyUpgradeToBoar: jest.fn((boar) => boar),
  applyMysteryEvent: jest.fn(() => ({ type: "heal", message: "Test event" })),
  applyTreasureReward: jest.fn(() => ({ gold: 100, message: "Test treasure" }))
}));

describe('useGameActions Hook Tests', () => {
  const wrapper = ({ children }) => <GameProvider>{children}</GameProvider>;

  test('Hook provides all required actions', () => {
    const { result } = renderHook(() => useGameActions(), { wrapper });
    
    expect(result.current).toHaveProperty('startGame');
    expect(result.current).toHaveProperty('resetGame');
    expect(result.current).toHaveProperty('choosePath');
    expect(result.current).toHaveProperty('proceedToNextFloor');
    
    expect(typeof result.current.startGame).toBe('function');
    expect(typeof result.current.resetGame).toBe('function');
    expect(typeof result.current.choosePath).toBe('function');
    expect(typeof result.current.proceedToNextFloor).toBe('function');
  });

  test('startGame function exists and is callable', () => {
    const { result } = renderHook(() => useGameActions(), { wrapper });
    
    expect(() => result.current.startGame()).not.toThrow();
  });

  test('resetGame function exists and is callable', () => {
    const { result } = renderHook(() => useGameActions(), { wrapper });
    
    expect(() => result.current.resetGame()).not.toThrow();
  });

  test('choosePath function handles different path types', () => {
    const { result } = renderHook(() => useGameActions(), { wrapper });
    
    const testPaths = [
      { type: "combat", difficulty: 1.0 },
      { type: "heal", difficulty: 0 },
      { type: "treasure", difficulty: 0 },
      { type: "mystery", difficulty: 0.5 }
    ];
    
    testPaths.forEach(path => {
      expect(() => result.current.choosePath(path)).not.toThrow();
    });
  });
});
