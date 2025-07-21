// Types TypeScript pour le jeu

export interface Move {
  name: string;
  damage: number;
  type: string;
  heal?: number;
  healTeam?: number;
  recoil?: boolean;
  priority?: boolean;
  effect?: string;
}

export interface Boar {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
}

export interface EnemyTemplate {
  name: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  moves: Move[];
}

export interface PathOption {
  type: string;
  name: string;
  description: string;
  icon: string;
  difficulty: number;
  reward: string;
}

export interface UpgradeOption {
  type: string;
  name: string;
  description: string;
  value: number | null;
}

export interface MysteryEvent {
  type: string;
  message: string;
  effect: string;
}

export interface GameState {
  gameState: string;
  currentFloor: number;
  playerTeam: Boar[];
  enemyBoar: Boar | null;
  battleLog: string[];
  isPlayerTurn: boolean;
  selectedBoar: Boar | null;
  selectedMove: Move | null;
  upgradeOptions: UpgradeOption[];
  upgradeTarget: Boar | null;
  pathOptions: PathOption[];
  currentBoarIndex: number;
}

export type GameAction = 
  | { type: 'SET_GAME_STATE'; payload: string }
  | { type: 'SET_CURRENT_FLOOR'; payload: number }
  | { type: 'SET_PLAYER_TEAM'; payload: Boar[] }
  | { type: 'UPDATE_BOAR'; payload: { id: number; updates: Partial<Boar> } }
  | { type: 'SET_ENEMY_BOAR'; payload: Boar | null }
  | { type: 'ADD_BATTLE_LOG'; payload: string }
  | { type: 'SET_BATTLE_LOG'; payload: string[] }
  | { type: 'SET_IS_PLAYER_TURN'; payload: boolean }
  | { type: 'SET_SELECTED_BOAR'; payload: Boar | null }
  | { type: 'SET_SELECTED_MOVE'; payload: Move | null }
  | { type: 'SET_UPGRADE_OPTIONS'; payload: UpgradeOption[] }
  | { type: 'SET_UPGRADE_TARGET'; payload: Boar | null }
  | { type: 'SET_PATH_OPTIONS'; payload: PathOption[] }
  | { type: 'SET_CURRENT_BOAR_INDEX'; payload: number }
  | { type: 'RESET_GAME' }
  | { type: 'START_GAME' };

export interface GameContextType extends GameState {
  dispatch: React.Dispatch<GameAction>;
  actions: typeof ACTIONS;
}

// Actions constantes
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
} as const;
