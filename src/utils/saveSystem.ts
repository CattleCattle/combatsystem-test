// Utilitaire pour la sauvegarde locale du jeu

const SAVE_KEY = 'boar_dungeon_save';

export interface SaveData {
  currentFloor: number;
  playerTeam: any[];
  gameState: string;
  battleLog: string[];
  timestamp: number;
}

export function saveGame(gameState: any): boolean {
  try {
    const saveData: SaveData = {
      currentFloor: gameState.currentFloor,
      playerTeam: gameState.playerTeam,
      gameState: gameState.gameState,
      battleLog: gameState.battleLog,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
}

export function loadGame(): SaveData | null {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;
    
    const saveData: SaveData = JSON.parse(savedData);
    
    // Vérifier que la sauvegarde n'est pas trop ancienne (7 jours)
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - saveData.timestamp > oneWeek) {
      deleteSave();
      return null;
    }
    
    return saveData;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return null;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
}

export function hasSave(): boolean {
  return loadGame() !== null;
}

// Sauvegarde automatique
export function autoSave(gameState: any): void {
  // Ne sauvegarder que si le jeu est en cours
  if (gameState.gameState !== 'menu' && gameState.currentFloor > 1) {
    saveGame(gameState);
  }
}
