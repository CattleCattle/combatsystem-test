
import * as SwordFight from 'swordfight-engine';

/**
 * Service d'intégration de SwordFight Engine pour le combat de sangliers
 * Adapte les données du jeu aux mécaniques de combat de la librairie
 */
export class SwordFightCombatService {
  constructor(gameDispatch, gameActions) {
    this.dispatch = gameDispatch;
    this.actions = gameActions;
    this.game = null;
    this.currentGameId = null;
    this.characterManager = null;
    this.isActive = false;
    this.playerTeam = null;
    this.enemyBoar = null;
    this.currentTurn = 'player';
    this.gameState = {
      playerHp: {},
      enemyHp: 0,
      logs: [],
      isPlayerTurn: true
    };
    this.initiativeQueue = [];
    this.initiativeIndex = 0;
    this.currentEntity = null;
    
    this.setupEventListeners();
  }

  /**
   * Initialise un nouveau combat
   */
  async initializeCombat(playerTeam, enemyBoar) {
    try {
      console.log('🎮 Initializing SwordFight combat...');
      console.log('SwordFight Engine export:', SwordFight);
      
      // Stocker les références
      this.playerTeam = [...playerTeam];
      this.enemyBoar = { ...enemyBoar };
      
      // Initialiser l'état du jeu
      this.gameState.playerHp = {};
      playerTeam.forEach(boar => {
        this.gameState.playerHp[boar.id] = boar.hp;
      });
      this.gameState.enemyHp = enemyBoar.hp;
      this.gameState.logs = ['Combat SwordFight initialisé !'];
      this.gameState.isPlayerTurn = true;
      this.initiativeQueue = [];
      this.initiativeIndex = 0;
      
      // Générer un ID unique pour ce combat
      this.currentGameId = `sanglier-combat-${Date.now()}`;
      
      // Initialiser la file d'initiative pour le premier tour
      this.buildInitiativeQueue();
      this.game = {
        id: this.currentGameId,
        isActive: true
      };

      // Configurer l'ennemi
      this.setupEnemyBoar(enemyBoar);
      this.isActive = true;
      console.log('✅ SwordFight combat initialized successfully');
      // Démarrer le premier tour automatiquement
      setTimeout(() => {
        this.processNextInInitiative();
      }, 500);
      // Fin de initializeCombat
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize SwordFight combat:', error);
      // Fallback vers l'ancien système si nécessaire
      this.handleInitializationError(error);
    }
  }
  /**
   * Construit la file d'initiative pour le tour courant (tous les vivants, triés par vitesse)
   */
  buildInitiativeQueue() {
    const allEntities = [];
    // Ajouter tous les sangliers vivants
    this.playerTeam.forEach(boar => {
      if (this.gameState.playerHp[boar.id] > 0) {
        allEntities.push({ ...boar, type: 'player' });
      }
    });
    // Ajouter l'ennemi s'il est vivant
    if (this.gameState.enemyHp > 0) {
      allEntities.push({ ...this.enemyBoar, type: 'enemy' });
    }
    // Tri par vitesse décroissante
    allEntities.sort((a, b) => (b.speed || 0) - (a.speed || 0));
    this.initiativeQueue = allEntities;
    this.initiativeIndex = 0;
    console.log('🌀 Nouvelle file d’initiative:', this.initiativeQueue.map(e => e.name));
  }

  /**
   * Traite l'action du prochain combattant dans la file d'initiative
   */
  processNextInInitiative() {
    if (!this.isActive || this.initiativeQueue.length === 0) return;
    if (this.initiativeIndex >= this.initiativeQueue.length) {
      // Fin du tour, recommencer un nouveau tour
      this.buildInitiativeQueue();
      setTimeout(() => this.processNextInInitiative(), 500);
      return;
    }
    const entity = this.initiativeQueue[this.initiativeIndex];
    this.currentEntity = entity;
    if (entity.type === 'player') {
      // Attendre le choix du joueur (UI doit appeler processPlayerTurnManual)
      // On ne fait rien ici, l'UI doit détecter que c'est à ce boar de jouer
      return;
    } else if (entity.type === 'enemy') {
      this.processEnemyTurnAuto(entity);
      this.initiativeIndex++;
    }
  }

  /**
   * Appelée par l'UI quand le joueur choisit un move pour son sanglier
   */
  processPlayerTurnManual(boar, move) {
    if (!this.isActive || !this.currentEntity || this.currentEntity.type !== 'player' || this.currentEntity.id !== boar.id) return;
    const damage = this.calculateDamage(move);
    this.gameState.enemyHp = Math.max(0, this.gameState.enemyHp - damage);
    this.gameState.logs.push(`${boar.name} utilise ${move.displayName || move.name} et inflige ${damage} dégâts !`);
    // Vérifier victoire
    if (this.gameState.enemyHp <= 0) {
      this.handleVictory();
      return;
    }
    // Déclencher l'event round
    this.dispatchRoundEvent({
      playerMove: move.displayName || move.name,
      damage: damage,
      enemyHp: this.gameState.enemyHp
    });
    this.initiativeIndex++;
    setTimeout(() => this.processNextInInitiative(), 1000);
  }

  /**
   * Tour automatique pour un sanglier joueur
   */
  processPlayerTurnAuto(boar, move) {
    if (!this.isActive || this.gameState.playerHp[boar.id] <= 0) return;
    const damage = this.calculateDamage(move);
    this.gameState.enemyHp = Math.max(0, this.gameState.enemyHp - damage);
    this.gameState.logs.push(`${boar.name} utilise ${move.displayName || move.name} et inflige ${damage} dégâts !`);
    // Vérifier victoire
    if (this.gameState.enemyHp <= 0) {
      this.handleVictory();
      return;
    }
    // Déclencher l'event round
    this.dispatchRoundEvent({
      playerMove: move.displayName || move.name,
      damage: damage,
      enemyHp: this.gameState.enemyHp
    });
    setTimeout(() => this.processNextInInitiative(), 1000);
  }

  /**
   * Tour automatique pour l'ennemi (ou IA)
   */
  processEnemyTurnAuto(enemy) {
    if (!this.isActive || this.gameState.enemyHp <= 0) return;
    const enemyMoves = enemy.moves;
    const randomMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    // Cible un sanglier vivant au hasard
    const aliveBoars = this.playerTeam.filter(boar => this.gameState.playerHp[boar.id] > 0);
    if (aliveBoars.length === 0) {
      this.handleDefeat();
      return;
    }
    const targetBoar = aliveBoars[Math.floor(Math.random() * aliveBoars.length)];
    const damage = this.calculateEnemyDamage(randomMove);
    this.gameState.playerHp[targetBoar.id] = Math.max(0, this.gameState.playerHp[targetBoar.id] - damage);
    this.gameState.logs.push(`${enemy.name} utilise ${randomMove.name} sur ${targetBoar.name} (${damage} dégâts) !`);
    // Vérifier défaite
    const stillAlive = this.playerTeam.filter(boar => this.gameState.playerHp[boar.id] > 0);
    if (stillAlive.length === 0) {
      this.handleDefeat();
      return;
    }
    // Déclencher l'event round
    this.dispatchRoundEvent({
      enemyMove: randomMove.name,
      target: targetBoar.name,
      damage: damage,
      playerHp: this.gameState.playerHp
    });
    setTimeout(() => this.processNextInInitiative(), 1000);
  }
      


  /**
   * Adapte un sanglier au format SwordFight Engine
   */
  adaptBoarToSwordFight(boar) {
    return {
      slug: `sanglier-${boar.id}`,
      name: boar.name,
      description: `Un sanglier ${boar.name} prêt au combat`,
      health: boar.hp,
      maxHealth: boar.maxHp,
      speed: boar.speed || 50,
      // Adapter les attaques avec un id unique
      moves: boar.moves.map((move, idx) => ({
        id: `${boar.id}-move-${idx}`,
        name: move.name.toLowerCase().replace(/\s+/g, '-'),
        displayName: move.name,
        damage: move.damage || 0,
        heal: move.heal || 0,
        type: move.type || 'Normal',
        accuracy: move.accuracy || 85,
        criticalChance: move.criticalChance || 5,
        description: `${move.name} - ${move.damage ? `${move.damage} dégâts` : `${move.heal} soins`}`
      }))
    };
  }

  /**
   * Configure l'ennemi dans le système SwordFight
   */
  setupEnemyBoar(enemyBoar) {
    const adaptedEnemy = this.adaptBoarToSwordFight(enemyBoar);
    
    // SwordFight Engine gère automatiquement l'IA de l'ennemi
    // On peut personnaliser le comportement ici si nécessaire
    console.log('🐗 Enemy boar configured:', adaptedEnemy.name);
  }

  /**
   * Configure les écouteurs d'événements de SwordFight Engine
   */
  setupEventListeners() {
    // Événement de fin de round
    document.addEventListener('round', (event) => {
      if (!this.isActive) return;
      
      const { myRoundData, opponentsRoundData } = event.detail;
      console.log('⚔️ Round completed:', { myRoundData, opponentsRoundData });
      
      // Dispatcher les résultats vers React/Redux
      this.dispatch({
        type: 'SWORDFIGHT_ROUND_COMPLETE',
        payload: {
          playerAction: myRoundData,
          enemyAction: opponentsRoundData,
          gameId: this.currentGameId
        }
      });
    });

    // Événement de victoire
    document.addEventListener('victory', () => {
      if (!this.isActive) return;
      
      console.log('🎉 Combat victory!');
      this.isActive = false;
      
      this.dispatch({
        type: 'SWORDFIGHT_COMBAT_VICTORY',
        payload: {
          gameId: this.currentGameId
        }
      });
    });

    // Événement de défaite
    document.addEventListener('defeat', () => {
      if (!this.isActive) return;
      
      console.log('💀 Combat defeat!');
      this.isActive = false;
      
      this.dispatch({
        type: 'SWORDFIGHT_COMBAT_DEFEAT',
        payload: {
          gameId: this.currentGameId
        }
      });
    });

    // Événement de configuration
    document.addEventListener('setup', (event) => {
      if (!this.isActive) return;
      
      console.log('🔧 Combat setup completed:', event.detail);
    });

    // Événements de mouvements
    document.addEventListener('move', (event) => {
      if (!this.isActive) return;
      
      console.log('🎯 Player move executed:', event.detail);
    });

    document.addEventListener('opponentsMove', (event) => {
      if (!this.isActive) return;
      
      console.log('🤖 Enemy move executed:', event.detail);
    });
  }


  /**
   * Calcule les dégâts d'une attaque du joueur
   */
  calculateDamage(move) {
    const baseDamage = move.damage || 20;
    const variance = 0.8 + Math.random() * 0.4; // ±20% de variance
    return Math.floor(baseDamage * variance);
  }

  /**
   * Calcule les dégâts d'une attaque ennemie
   */
  calculateEnemyDamage(move) {
    const baseDamage = move.damage || 15;
    const variance = 0.8 + Math.random() * 0.4;
    return Math.floor(baseDamage * variance);
  }

  /**
   * Gère la victoire
   */
  handleVictory() {
    this.isActive = false;
    this.gameState.logs.push('🏆 Victoire ! Vous avez vaincu l\'ennemi !');
    
    // Déclencher l'event victoire
    const victoryEvent = new CustomEvent('victory', {
      detail: { gameId: this.currentGameId }
    });
    document.dispatchEvent(victoryEvent);
  }

  /**
   * Gère la défaite
   */
  handleDefeat() {
    this.isActive = false;
    this.gameState.logs.push('💀 Défaite ! Votre équipe a été vaincue...');
    
    // Déclencher l'event défaite
    const defeatEvent = new CustomEvent('defeat', {
      detail: { gameId: this.currentGameId }
    });
    document.dispatchEvent(defeatEvent);
  }

  /**
   * Déclenche un event de round
   */
  dispatchRoundEvent(data) {
    const roundEvent = new CustomEvent('round', {
      detail: {
        myRoundData: data.playerMove ? { move: data.playerMove, damage: data.damage } : null,
        opponentsRoundData: data.enemyMove ? { move: data.enemyMove, target: data.target, damage: data.damage } : null,
        gameState: this.gameState,
        gameId: this.currentGameId
      }
    });
    document.dispatchEvent(roundEvent);
  }

  /**
   * Obtient l'état actuel du jeu
   */
  getGameState() {
    return {
      ...this.gameState,
      isActive: this.isActive,
      currentTurn: this.gameState.isPlayerTurn ? 'player' : 'enemy',
      initiativeQueue: this.initiativeQueue,
      initiativeIndex: this.initiativeIndex,
    };
  }

  /**
   * Gère les erreurs d'initialisation
   */
  handleInitializationError(error) {
    console.error('SwordFight initialization failed, falling back to original system');
    
    this.dispatch({
      type: 'SWORDFIGHT_INIT_FAILED',
      payload: {
        error: error.message,
        fallbackToOriginal: true
      }
    });
  }

  /**
   * Nettoie et termine le combat
   */
  cleanup() {
    console.log('🧹 Cleaning up SwordFight combat...');
    
    this.isActive = false;
    this.game = null;
    this.currentGameId = null;
    
    // Optionnel: supprimer les écouteurs d'événements spécifiques si nécessaire
  }

  /**
   * Vérifie si le combat SwordFight est actif
   */
  isActiveCombat() {
    return this.isActive && this.game !== null;
  }
}
