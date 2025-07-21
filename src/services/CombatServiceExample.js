// src/services/CombatService.js
import Game from 'swordfight-engine';

export class CombatService {
  constructor(gameDispatch) {
    this.dispatch = gameDispatch;
    this.game = null;
    this.setupEventListeners();
  }

  initializeCombat(playerTeam, enemy) {
    // Adapter vos données au format SwordFight Engine
    const primaryCharacter = playerTeam[0];
    
    this.game = new Game(`combat-${Date.now()}`, {
      myCharacterSlug: this.adaptCharacterToEngine(primaryCharacter)
    });

    // Initialiser l'ennemi
    this.setupEnemy(enemy);
  }

  adaptCharacterToEngine(character) {
    // Convertir votre format de personnage vers SwordFight Engine
    return {
      name: character.name,
      health: character.hp,
      maxHealth: character.maxHp,
      speed: character.speed,
      moves: character.moves.map(move => ({
        name: move.name,
        damage: move.damage,
        type: move.type,
        heal: move.heal
      }))
    };
  }

  setupEventListeners() {
    document.addEventListener('round', (event) => {
      const { myRoundData, opponentsRoundData } = event.detail;
      
      // Dispatcher vers votre état React
      this.dispatch({
        type: 'COMBAT_ROUND_COMPLETE',
        payload: {
          playerAction: myRoundData,
          enemyAction: opponentsRoundData
        }
      });
    });

    document.addEventListener('victory', () => {
      this.dispatch({
        type: 'COMBAT_VICTORY'
      });
    });

    document.addEventListener('defeat', () => {
      this.dispatch({
        type: 'COMBAT_DEFEAT'
      });
    });
  }

  executePlayerMove(move) {
    const moveEvent = new CustomEvent('inputMove', {
      detail: { move: move.name }
    });
    document.dispatchEvent(moveEvent);
  }
}
