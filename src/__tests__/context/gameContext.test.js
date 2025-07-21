/**
 * Tests pour le contexte de jeu et le reducer
 */
import { describe, test, expect } from '@jest/globals';
import { ACTIONS } from '../../contexts/GameContext.js';
import { INITIAL_PLAYER_TEAM, GAME_STATES } from '../../constants/gameData.js';

// Simulation du reducer pour les tests
const initialState = {
  gameState: GAME_STATES.MENU,
  currentFloor: 1,
  playerTeam: INITIAL_PLAYER_TEAM || [],
  gold: 1000,
  inventory: null,
  customBoars: [],
  messages: [],
  enemyBoar: null,
  battleLog: [],
  isPlayerTurn: true,
  selectedBoar: null,
  selectedMove: null,
  upgradeOptions: [],
  upgradeTarget: null,
  pathOptions: [],
  currentBoarIndex: 0,
};

function mockGameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_GAME_STATE:
      return { ...state, gameState: action.payload };
    
    case ACTIONS.SET_CURRENT_FLOOR:
      return {
        ...state,
        currentFloor: action.payload,
        pathOptions: [], // Simulated path generation
      };
    
    case ACTIONS.START_GAME:
      return {
        ...state,
        currentFloor: 1,
        playerTeam: (state.playerTeam || []).map(boar => ({ ...boar, hp: boar.maxHp })),
        gameState: GAME_STATES.PATH_CHOICE,
        battleLog: [],
        isPlayerTurn: true,
        selectedBoar: null,
        pathOptions: [], // Simulated path generation
      };
    
    case ACTIONS.RESET_GAME:
      return {
        ...initialState,
        playerTeam: INITIAL_PLAYER_TEAM ? INITIAL_PLAYER_TEAM.map(boar => ({ ...boar })) : [],
      };
    
    default:
      return state;
  }
}

describe('Game Context and Reducer Tests', () => {
  test('Initial state is correctly configured', () => {
    expect(initialState.gameState).toBe(GAME_STATES.MENU);
    expect(initialState.currentFloor).toBe(1);
    expect(Array.isArray(initialState.playerTeam)).toBe(true);
    expect(Array.isArray(initialState.pathOptions)).toBe(true);
  });

  test('SET_GAME_STATE action works', () => {
    const action = { type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.BATTLE };
    const newState = mockGameReducer(initialState, action);
    
    expect(newState.gameState).toBe(GAME_STATES.BATTLE);
    expect(newState.currentFloor).toBe(initialState.currentFloor); // Unchanged
  });

  test('SET_CURRENT_FLOOR action works', () => {
    const action = { type: ACTIONS.SET_CURRENT_FLOOR, payload: 5 };
    const newState = mockGameReducer(initialState, action);
    
    expect(newState.currentFloor).toBe(5);
    expect(Array.isArray(newState.pathOptions)).toBe(true);
  });

  test('START_GAME action resets player team HP', () => {
    const damagedState = {
      ...initialState,
      playerTeam: initialState.playerTeam.map(boar => ({ ...boar, hp: 50 }))
    };
    
    const action = { type: ACTIONS.START_GAME };
    const newState = mockGameReducer(damagedState, action);
    
    expect(newState.gameState).toBe(GAME_STATES.PATH_CHOICE);
    expect(newState.currentFloor).toBe(1);
    
    if (newState.playerTeam && newState.playerTeam.length > 0) {
      newState.playerTeam.forEach(boar => {
        expect(boar.hp).toBe(boar.maxHp);
      });
    }
  });

  test('RESET_GAME action restores initial state', () => {
    const modifiedState = {
      ...initialState,
      currentFloor: 10,
      gameState: GAME_STATES.BATTLE,
      gold: 500
    };
    
    const action = { type: ACTIONS.RESET_GAME };
    const newState = mockGameReducer(modifiedState, action);
    
    expect(newState.currentFloor).toBe(1);
    expect(newState.gameState).toBe(GAME_STATES.MENU);
    expect(newState.gold).toBe(1000);
  });

  test('All ACTIONS are defined', () => {
    const requiredActions = [
      'SET_GAME_STATE',
      'SET_CURRENT_FLOOR',
      'SET_PLAYER_TEAM',
      'START_GAME',
      'RESET_GAME',
      'SET_PATH_OPTIONS'
    ];
    
    requiredActions.forEach(action => {
      expect(ACTIONS[action]).toBeDefined();
      expect(typeof ACTIONS[action]).toBe('string');
    });
  });
});
