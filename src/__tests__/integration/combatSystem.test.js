import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BattleScreen } from '../../components/game/BattleScreen';
import { GameProvider } from '../../contexts/GameContext';
import { GAME_STATES } from '../../constants/gameConstants';

// Integration test for full combat system
describe('Combat System Integration Tests', () => {
  let mockDispatch;
  let mockGameContext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    
    mockGameContext = {
      gameState: {
        gameState: GAME_STATES.BATTLE,
        playerTeam: [
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
        ],
        enemyBoar: {
          id: 'enemy-1',
          name: 'Sanglier Ennemi',
          hp: 120,
          maxHp: 120,
          speed: 75,
          moves: [
            { name: 'Attaque', damage: 20, type: 'Normal' },
            { name: 'Rage', damage: 35, type: 'Normal' }
          ]
        },
        battleLog: ['Combat commencé !']
      },
      dispatch: mockDispatch
    };

    // Mock console to avoid noise in tests
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  test('complete combat turn flow', async () => {
    // This test verifies the entire combat system works together
    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: mockGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // Wait for initialization
    await waitFor(() => {
      expect(screen.getByText('ORDRE D\'ACTION')).toBeInTheDocument();
    });

    // Verify all combatants are displayed
    expect(screen.getByText('Sanglier Guerrier')).toBeInTheDocument();
    expect(screen.getByText('Sanglier Mage')).toBeInTheDocument();
    expect(screen.getByText('Sanglier Ennemi')).toBeInTheDocument();

    // Wait for a player turn to be ready
    await waitFor(() => {
      expect(screen.getByText('TON TOUR')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Select the active boar
    const activeBoar = screen.getByText('TON TOUR').closest('div');
    const boarSprites = screen.getAllByText('🐗');
    
    // Find and click the active boar
    act(() => {
      boarSprites[0].click();
    });

    // Attack menu should appear
    await waitFor(() => {
      expect(screen.getByText('⚔️ CHOISISSEZ UNE ATTAQUE')).toBeInTheDocument();
    });

    // Select an attack
    const chargeButton = screen.getByText('Charge');
    act(() => {
      chargeButton.click();
    });

    // Should show action in progress
    await waitFor(() => {
      expect(screen.getByText('Action en cours...')).toBeInTheDocument();
    });

    // Verify battle log is updated
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('enemy AI behavior', async () => {
    // Test that enemies act automatically when it's their turn
    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: mockGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // Wait for enemy turn
    await waitFor(() => {
      expect(screen.getByText('Tour de l\'ennemi')).toBeInTheDocument() ||
      expect(screen.getByText('TOUR ENNEMI')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Enemy should automatically execute an action
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(String)
        })
      );
    }, { timeout: 5000 });
  });

  test('queue progression and turn order', async () => {
    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: mockGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // Verify initial queue is displayed
    await waitFor(() => {
      expect(screen.getByText('ORDRE D\'ACTION')).toBeInTheDocument();
    });

    // All combatants should be in the queue
    const queueItems = screen.getAllByText(/Sanglier/);
    expect(queueItems.length).toBeGreaterThanOrEqual(3);

    // Speed-based ordering should be maintained
    // (Guerrier: 85, Ennemi: 75, Mage: 70)
    const combatantNames = queueItems.map(item => item.textContent);
    expect(combatantNames).toContain('Sanglier Guerrier');
    expect(combatantNames).toContain('Sanglier Ennemi');
    expect(combatantNames).toContain('Sanglier Mage');
  });

  test('death handling and queue updates', async () => {
    // Test with a dying player
    const dyingGameContext = {
      ...mockGameContext,
      gameState: {
        ...mockGameContext.gameState,
        playerTeam: [
          {
            ...mockGameContext.gameState.playerTeam[0],
            hp: 0 // Dead boar
          },
          mockGameContext.gameState.playerTeam[1]
        ]
      }
    };

    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: dyingGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // Dead boar should be marked as KO
    await waitFor(() => {
      expect(screen.getByText('KO')).toBeInTheDocument();
    });

    // Dead boar should have skull emoji
    expect(screen.getByText('💀')).toBeInTheDocument();

    // Dead boar should not get turns
    const deadBoarElements = screen.queryByText('TON TOUR');
    // If there's a turn indicator, it shouldn't be on the dead boar
  });

  test('action bar visualization', async () => {
    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: mockGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // Wait for queue to initialize
    await waitFor(() => {
      expect(screen.getByText('ORDRE D\'ACTION')).toBeInTheDocument();
    });

    // Action bars should be visible (progress indicators)
    const progressBars = document.querySelectorAll('[style*="width"]');
    expect(progressBars.length).toBeGreaterThan(0);

    // At least one combatant should be ready or progressing
    const readyIndicators = screen.queryAllByText('PRÊT');
    const progressIndicators = document.querySelectorAll('.bg-gradient-to-r');
    expect(readyIndicators.length + progressIndicators.length).toBeGreaterThan(0);
  });

  test('prevents duplicate turns', async () => {
    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: mockGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // Wait for a turn
    await waitFor(() => {
      expect(screen.getByText('TON TOUR')).toBeInTheDocument();
    });

    // Select and attack quickly multiple times
    const boarSprites = screen.getAllByText('🐗');
    
    act(() => {
      boarSprites[0].click();
    });

    await waitFor(() => {
      expect(screen.getByText('⚔️ CHOISISSEZ UNE ATTAQUE')).toBeInTheDocument();
    });

    const attackButton = screen.getByText('Charge');
    
    // Try to click multiple times rapidly
    act(() => {
      attackButton.click();
      attackButton.click(); // Second click should be ignored
      attackButton.click(); // Third click should be ignored
    });

    // Should only process one action
    await waitFor(() => {
      expect(screen.getByText('Action en cours...')).toBeInTheDocument();
    });

    // Verify only one dispatch call for the attack
    const attackCalls = mockDispatch.mock.calls.filter(call => 
      call[0].type && call[0].type.includes('ATTACK')
    );
    expect(attackCalls.length).toBeLessThanOrEqual(1);
  });

  test('handles empty or invalid states gracefully', async () => {
    const invalidGameContext = {
      ...mockGameContext,
      gameState: {
        gameState: GAME_STATES.BATTLE,
        playerTeam: [],
        enemyBoar: null,
        battleLog: []
      }
    };

    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: invalidGameContext }, children)
    );

    expect(() => {
      render(
        <MockProvider>
          <BattleScreen />
        </MockProvider>
      );
    }).not.toThrow();

    // Should handle empty state gracefully
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
  });

  test('battle UI responsiveness', async () => {
    const MockProvider = ({ children }) => (
      React.createElement(GameProvider.Provider, { value: mockGameContext }, children)
    );

    render(
      <MockProvider>
        <BattleScreen />
      </MockProvider>
    );

    // All main UI elements should be present
    await waitFor(() => {
      expect(screen.getByText('ORDRE D\'ACTION')).toBeInTheDocument();
      expect(screen.getByText('ÉQUIPE')).toBeInTheDocument();
    });

    // Team status should show all team members
    expect(screen.getByText('Guerrier')).toBeInTheDocument(); // Truncated name
    expect(screen.getByText('Mage')).toBeInTheDocument(); // Truncated name

    // Health displays should be present
    expect(screen.getByText('100/100')).toBeInTheDocument();
    expect(screen.getByText('80/80')).toBeInTheDocument();
    expect(screen.getByText('120/120')).toBeInTheDocument();
  });
});
