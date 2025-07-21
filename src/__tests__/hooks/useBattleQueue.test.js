import { renderHook, act } from '@testing-library/react';
import { useBattleQueue } from '../../hooks/useBattleQueue';

// Mock initial state
const mockPlayerTeam = [
  {
    id: 'player-1',
    name: 'Sanglier Guerrier',
    hp: 100,
    maxHp: 100,
    speed: 85,
    moves: [
      { name: 'Charge', damage: 25, type: 'Normal' },
      { name: 'Défense', heal: 15, type: 'Support' }
    ]
  },
  {
    id: 'player-2', 
    name: 'Sanglier Mage',
    hp: 80,
    maxHp: 80,
    speed: 70,
    moves: [
      { name: 'Flamme', damage: 30, type: 'Feu' },
      { name: 'Soin', heal: 20, type: 'Support' }
    ]
  }
];

const mockEnemy = {
  id: 'enemy-1',
  name: 'Sanglier Ennemi',
  hp: 120,
  maxHp: 120,
  speed: 75,
  moves: [
    { name: 'Attaque', damage: 20, type: 'Normal' },
    { name: 'Rage', damage: 35, type: 'Normal' }
  ]
};

describe('useBattleQueue Hook', () => {
  beforeEach(() => {
    // Clear console logs for clean test output
    jest.clearAllMocks();
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  test('should initialize battle queue correctly', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    // Should initialize queue
    expect(result.current.isInitialized).toBe(false);
    
    act(() => {
      result.current.initializeBattleQueue();
    });

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.battleQueue).toHaveLength(3); // 2 players + 1 enemy
  });

  test('should assign unique IDs to all combatants', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    const uniqueIds = new Set();
    result.current.battleQueue.forEach(combatant => {
      expect(combatant.uniqueId).toBeDefined();
      expect(typeof combatant.uniqueId).toBe('string');
      expect(uniqueIds.has(combatant.uniqueId)).toBe(false);
      uniqueIds.add(combatant.uniqueId);
    });

    expect(uniqueIds.size).toBe(3);
  });

  test('should include action bars for all combatants', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    expect(Object.keys(result.current.actionBars)).toHaveLength(3);
    
    Object.values(result.current.actionBars).forEach(bar => {
      expect(bar.progress).toBeGreaterThanOrEqual(0);
      expect(bar.speed).toBeDefined();
      expect(typeof bar.ready).toBe('boolean');
    });
  });

  test('should get next ready combatant', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    // Initially no combatants should be ready (they start with low progress)
    expect(result.current.getNextReadyCombatant()).toBeNull();
  });

  test('should handle combatant death correctly', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    const initialLength = result.current.battleQueue.length;
    const deadCombatant = result.current.battleQueue[0];

    act(() => {
      result.current.updateQueueAfterDeath(deadCombatant.id, deadCombatant.type);
    });

    expect(result.current.battleQueue).toHaveLength(initialLength - 1);
    expect(result.current.battleQueue.find(c => c.uniqueId === deadCombatant.uniqueId)).toBeUndefined();
  });

  test('should mark combatants as acted', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    const combatantToAct = result.current.battleQueue[0];
    const initialProgress = result.current.actionBars[combatantToAct.uniqueId].progress;
    
    act(() => {
      result.current.markCombatantActed(combatantToAct);
    });

    const updatedProgress = result.current.actionBars[combatantToAct.uniqueId].progress;
    expect(updatedProgress).toBe(0);
    expect(result.current.actionBars[combatantToAct.uniqueId].ready).toBe(false);
  });

  test('should handle empty teams gracefully', () => {
    const { result } = renderHook(() => 
      useBattleQueue([], null, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    expect(result.current.battleQueue).toHaveLength(0);
    expect(result.current.getNextReadyCombatant()).toBeNull();
  });

  test('should get action order correctly', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    const actionOrder = result.current.getActionOrder();
    expect(Array.isArray(actionOrder)).toBe(true);
    expect(actionOrder.length).toBe(3);
    
    // Should be sorted by progress descending
    for (let i = 0; i < actionOrder.length - 1; i++) {
      expect(actionOrder[i].actionBar.progress).toBeGreaterThanOrEqual(
        actionOrder[i + 1].actionBar.progress
      );
    }
  });

  test('should maintain consistent state after multiple operations', () => {
    const { result } = renderHook(() => 
      useBattleQueue(mockPlayerTeam, mockEnemy, true)
    );

    act(() => {
      result.current.initializeBattleQueue();
    });

    // Perform multiple operations
    act(() => {
      const firstCombatant = result.current.battleQueue[0];
      result.current.markCombatantActed(firstCombatant);
      result.current.updateQueueAfterDeath('player-2', 'player');
    });

    // Queue should still be valid
    expect(result.current.battleQueue.length).toBeGreaterThan(0);
    result.current.battleQueue.forEach(combatant => {
      expect(combatant.uniqueId).toBeDefined();
    });
    
    Object.values(result.current.actionBars).forEach(bar => {
      expect(bar.progress).toBeGreaterThanOrEqual(0);
      expect(bar.progress).toBeLessThanOrEqual(100);
    });
  });
});
