import React, { createContext, useContext, useReducer } from 'react';
import { INITIAL_PLAYER_TEAM, GAME_STATES } from '../constants/gameData.js';
import { generatePathOptions } from '../utilities/gameLogic.js';

const GameContext = createContext();

// Actions du reducer
export const ACTIONS = {
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_CURRENT_FLOOR: 'SET_CURRENT_FLOOR',
  SET_PLAYER_TEAM: 'SET_PLAYER_TEAM',
  UPDATE_BOAR: 'UPDATE_BOAR',
  SET_ENEMY_BOAR: 'SET_ENEMY_BOAR',
  ADD_BATTLE_LOG: 'ADD_BATTLE_LOG',
  SET_BATTLE_LOG: 'SET_BATTLE_LOG',
  SET_IS_PLAYER_TURN: 'SET_IS_PLAYER_TURN',
  SET_SELECTED_BOAR: 'SET_SELECTED_BOAR',
  SET_SELECTED_MOVE: 'SET_SELECTED_MOVE',
  SET_UPGRADE_OPTIONS: 'SET_UPGRADE_OPTIONS',
  SET_UPGRADE_TARGET: 'SET_UPGRADE_TARGET',
  SET_PATH_OPTIONS: 'SET_PATH_OPTIONS',
  SET_CURRENT_BOAR_INDEX: 'SET_CURRENT_BOAR_INDEX',
  RESET_GAME: 'RESET_GAME',
  START_GAME: 'START_GAME',
  ADD_CUSTOM_BOAR: 'ADD_CUSTOM_BOAR',
  ADD_GOLD: 'ADD_GOLD',
  SPEND_GOLD: 'SPEND_GOLD',
  UPDATE_TEAM: 'UPDATE_TEAM',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_EVENT_MODAL: 'SET_EVENT_MODAL',
  // Actions SwordFight
  UPDATE_TEAM_HP: 'UPDATE_TEAM_HP',
  UPDATE_ENEMY_HP: 'UPDATE_ENEMY_HP',
};

// État initial
const initialState = {
  gameState: GAME_STATES.MENU,
  currentFloor: 1,
  playerTeam: [], // Sera initialisé dans le provider
  gold: 1000,
  inventory: null, // Sera initialisé dans le composant
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
  eventModal: {
    isVisible: false,
    title: '',
    message: '',
    type: ''
  },
};

// Reducer pour gérer l'état du jeu
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_GAME_STATE:
      return { ...state, gameState: action.payload };
    
    case ACTIONS.SET_CURRENT_FLOOR:
      return {
        ...state,
        currentFloor: action.payload,
        pathOptions: generatePathOptions(action.payload),
      };
    
    case ACTIONS.SET_PLAYER_TEAM:
      return { ...state, playerTeam: action.payload };
    
    case ACTIONS.UPDATE_BOAR:
      return {
        ...state,
        playerTeam: state.playerTeam.map(boar =>
          boar.id === action.payload.id ? { ...boar, ...action.payload.updates } : boar
        )
      };
    
    case ACTIONS.SET_ENEMY_BOAR:
      return { ...state, enemyBoar: action.payload };
    
    case ACTIONS.ADD_BATTLE_LOG:
      return { ...state, battleLog: [...state.battleLog, action.payload] };
    
    case ACTIONS.SET_BATTLE_LOG:
      return { ...state, battleLog: action.payload };

    case ACTIONS.ADD_CUSTOM_BOAR:
      return { 
        ...state, 
        customBoars: [...state.customBoars, action.payload] 
      };

    case ACTIONS.ADD_GOLD:
      return { 
        ...state, 
        gold: state.gold + action.payload 
      };

    case ACTIONS.SPEND_GOLD:
      return { 
        ...state, 
        gold: Math.max(0, state.gold - action.payload) 
      };

    case ACTIONS.UPDATE_TEAM:
      return { 
        ...state, 
        playerTeam: action.payload 
      };

    case ACTIONS.ADD_MESSAGE:
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      };
    
    case ACTIONS.SET_EVENT_MODAL:
      return { 
        ...state, 
        eventModal: action.payload 
      };
    
    case ACTIONS.SET_IS_PLAYER_TURN:
      return { ...state, isPlayerTurn: action.payload };
    
    case ACTIONS.SET_SELECTED_BOAR:
      return { ...state, selectedBoar: action.payload };
    
    case ACTIONS.SET_SELECTED_MOVE:
      return { ...state, selectedMove: action.payload };
    
    case ACTIONS.SET_UPGRADE_OPTIONS:
      return { ...state, upgradeOptions: action.payload };
    
    case ACTIONS.SET_UPGRADE_TARGET:
      return { ...state, upgradeTarget: action.payload };
    
    case ACTIONS.SET_PATH_OPTIONS:
      return { ...state, pathOptions: action.payload };
    
    case ACTIONS.SET_CURRENT_BOAR_INDEX:
      return { ...state, currentBoarIndex: action.payload };
    
    // Actions SwordFight
    case ACTIONS.UPDATE_TEAM_HP:
      return {
        ...state,
        playerTeam: state.playerTeam.map(boar => ({
          ...boar,
          hp: action.payload[boar.id] !== undefined ? action.payload[boar.id] : boar.hp
        }))
      };
    
    case ACTIONS.UPDATE_ENEMY_HP:
      return {
        ...state,
        enemyBoar: state.enemyBoar ? {
          ...state.enemyBoar,
          hp: action.payload
        } : null
      };
    
    case ACTIONS.RESET_GAME:
      return {
        ...initialState,
        playerTeam: INITIAL_PLAYER_TEAM.map(boar => ({ ...boar })),
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
        pathOptions: generatePathOptions(1),
      };
    
    default:
      return state;
  }
}

// Provider du contexte
export function GameProvider({ children }) {
  // Création de l'état initial avec l'équipe de sangliers
  const getInitialState = () => {
    // Équipe par défaut si INITIAL_PLAYER_TEAM n'est pas disponible
    const defaultTeam = [
      {
        id: 1,
        name: "Sanglier Alpha",
        hp: 100,
        maxHp: 100,
        attack: 25,
        defense: 15,
        speed: 20,
        moves: [
          { name: "Charge Brutale", damage: 30, type: "physique" },
          { name: "Défenses de Fer", damage: 20, type: "physique", effect: "defense" },
          { name: "Grognement", damage: 15, type: "intimidation" },
        ],
      },
      {
        id: 2,
        name: "Sanglier Guerrier",
        hp: 80,
        maxHp: 80,
        attack: 30,
        defense: 12,
        speed: 25,
        moves: [
          { name: "Attaque Sauvage", damage: 35, type: "physique" },
          { name: "Rage", damage: 25, type: "physique", effect: "berserker" },
          { name: "Coup Puissant", damage: 40, type: "physique", recoil: true },
        ],
      },
      {
        id: 3,
        name: "Sanglier Soigneur",
        hp: 70,
        maxHp: 70,
        attack: 18,
        defense: 20,
        speed: 15,
        moves: [
          { name: "Soin Naturel", damage: 0, type: "heal", heal: 25 },
          { name: "Charge Défensive", damage: 20, type: "physique", effect: "defense" },
          { name: "Guérison de Groupe", damage: 0, type: "heal", heal: 15, target: "all" },
        ],
      }
    ];
    
    const playerTeam = (INITIAL_PLAYER_TEAM && INITIAL_PLAYER_TEAM.length > 0) 
      ? INITIAL_PLAYER_TEAM.map(boar => ({ ...boar }))
      : defaultTeam;
    
    const initialPaths = [];
    try {
      const paths = generatePathOptions(1);
      initialPaths.push(...paths);
    } catch (error) {
      console.error('Error generating initial paths:', error);
    }
    
    return {
      ...initialState,
      playerTeam,
      pathOptions: initialPaths,
    };
  };

  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  const value = {
    gameState: state,
    dispatch,
    actions: ACTIONS,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook pour utiliser le contexte
export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
