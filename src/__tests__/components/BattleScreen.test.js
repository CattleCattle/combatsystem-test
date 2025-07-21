import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BattleScreen } from '../../components/game/BattleScreen';
import { GameProvider } from '../../contexts/GameContext';
import { GAME_STATES } from '../../constants/gameConstants';

// Mock the hooks
jest.mock('../../hooks/useBattleQueue', () => ({
  useBattleQueue: () => ({
    combatQueue: [
      {
        id: 'player-1',
        uniqueId: 'unique-1',
        name: 'Test Sanglier',
        type: 'player',
        actionBar: 100,
        speed: 85,
        hp: 100,
        maxHp: 100
      },
      {
        id: 'enemy-1',
        uniqueId: 'unique-2',
        name: 'Test Enemy',
        type: 'enemy',
        actionBar: 50,
        speed: 75,
        hp: 120,
        maxHp: 120
      }
    ],
    isInitialized: true,
    initializeBattleQueue: jest.fn(),
    progressActionBars: jest.fn(),
    getNextReadyCombatant: () => ({
      id: 'player-1',
      uniqueId: 'unique-1',
      name: 'Test Sanglier',
      type: 'player',
      actionBar: 100
    }),
    markCombatantActed: jest.fn(),
    updateQueueAfterDeath: jest.fn(),
    updateCombatQueue: jest.fn()
  })
}));

jest.mock('../../hooks/useBattleActions', () => ({
  useBattleActions: () => ({
    executeMove: jest.fn(),
    checkBattleEnd: jest.fn(),
    proceedToNextFloor: jest.fn()
  })
}));

const mockGameState = {
  gameState: GAME_STATES.BATTLE,
  playerTeam: [
    {
      id: 'player-1',
      name: 'Test Sanglier',
      hp: 100,
      maxHp: 100,
      speed: 85,
      moves: [
        { name: 'Charge', damage: 25, type: 'Normal' },
        { name: 'Défense', heal: 15, type: 'Support' }
      ]
    }
  ],
  enemyBoar: {
    id: 'enemy-1',
    name: 'Test Enemy',
    hp: 120,
    maxHp: 120,
    speed: 75,
    moves: [
      { name: 'Attaque', damage: 20, type: 'Normal' }
    ]
  },
  battleLog: ['Combat commencé !']
};

const MockGameProvider = ({ children, value = mockGameState }) => {
  return (
    <GameProvider value={value}>
      {children}
    </GameProvider>
  );
};

describe('BattleScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.console = {
      ...console,
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  test('renders battle screen correctly', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    expect(screen.getByText('Test Enemy')).toBeInTheDocument();
    expect(screen.getByText('Test Sanglier')).toBeInTheDocument();
  });

  test('displays battle queue component', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Battle queue should be visible
    expect(screen.getByText('ORDRE D\'ACTION')).toBeInTheDocument();
  });

  test('shows player team correctly', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Player team should be displayed
    expect(screen.getByText('Test Sanglier')).toBeInTheDocument();
    expect(screen.getByText('100/100')).toBeInTheDocument();
  });

  test('displays enemy correctly', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Enemy should be displayed
    expect(screen.getByText('Test Enemy')).toBeInTheDocument();
    expect(screen.getByText('120/120')).toBeInTheDocument();
  });

  test('shows current turn indicator', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Should show whose turn it is
    expect(screen.getByText('TON TOUR')).toBeInTheDocument();
  });

  test('handles boar selection correctly', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Click on a boar to select it
    const boarSprite = screen.getAllByText('🐗')[0];
    fireEvent.click(boarSprite);

    // Attack menu should appear
    expect(screen.getByText('⚔️ CHOISISSEZ UNE ATTAQUE')).toBeInTheDocument();
  });

  test('displays attack moves when boar is selected', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Select the boar first
    const boarSprite = screen.getAllByText('🐗')[0];
    fireEvent.click(boarSprite);

    // Attack moves should be visible
    expect(screen.getByText('Charge')).toBeInTheDocument();
    expect(screen.getByText('Défense')).toBeInTheDocument();
  });

  test('shows battle log', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    expect(screen.getByText('> Combat commencé !')).toBeInTheDocument();
  });

  test('handles dead boars correctly', () => {
    const deadBoarState = {
      ...mockGameState,
      playerTeam: [
        {
          ...mockGameState.playerTeam[0],
          hp: 0
        }
      ]
    };

    render(
      <MockGameProvider value={deadBoarState}>
        <BattleScreen />
      </MockGameProvider>
    );

    // Dead boar should show KO status
    expect(screen.getByText('KO')).toBeInTheDocument();
    // Should show skull emoji
    expect(screen.getByText('💀')).toBeInTheDocument();
  });

  test('prevents actions when waiting for action', async () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Select boar and attack
    const boarSprite = screen.getAllByText('🐗')[0];
    fireEvent.click(boarSprite);

    const attackButton = screen.getByText('Charge');
    fireEvent.click(attackButton);

    // Should show waiting state
    await waitFor(() => {
      expect(screen.getByText('Action en cours...')).toBeInTheDocument();
    });
  });

  test('displays team status correctly', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Team status panel should be visible
    expect(screen.getByText('ÉQUIPE')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument(); // Truncated name
  });

  test('shows appropriate turn indicators', () => {
    render(
      <MockGameProvider>
        <BattleScreen />
      </MockGameProvider>
    );

    // Should show player turn indicator
    expect(screen.getByText('VOTRE TOUR')).toBeInTheDocument();
  });

  test('handles non-battle game state', () => {
    const nonBattleState = {
      ...mockGameState,
      gameState: GAME_STATES.MENU
    };

    render(
      <MockGameProvider value={nonBattleState}>
        <BattleScreen />
      </MockGameProvider>
    );

    // Should handle gracefully when not in battle
    expect(screen.queryByText('Test Enemy')).not.toBeInTheDocument();
  });

  test('renders without crashing with minimal state', () => {
    const minimalState = {
      gameState: GAME_STATES.BATTLE,
      playerTeam: [],
      enemyBoar: null,
      battleLog: []
    };

    expect(() => {
      render(
        <MockGameProvider value={minimalState}>
          <BattleScreen />
        </MockGameProvider>
      );
    }).not.toThrow();
  });
});
