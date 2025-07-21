import React, { useState, useEffect, useCallback } from 'react';

import { useGameContext } from '../../contexts/GameContext';
import { SwordFightCombatService } from '../../services/SwordFightCombatService';
import { BattleQueue } from './BattleQueue';

// Composant pour afficher dynamiquement la file d’initiative
function InitiativeBanner({ initiativeQueue, initiativeIndex }) {
  if (!initiativeQueue || initiativeQueue.length === 0) return null;
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {initiativeQueue.map((entity, idx) => {
        const isActive = idx === initiativeIndex;
        return (
          <div
            key={entity.id || entity.name || idx}
            className={`flex flex-col items-center px-2 py-1 rounded-lg border-2 ${isActive ? 'border-yellow-400 bg-yellow-900/80' : 'border-gray-600 bg-gray-800/60'} transition-all duration-200`}
            style={{ minWidth: 60 }}
          >
            <span className="text-2xl">
              {entity.type === 'player' ? '🐗' : '👹'}
            </span>
            <span className={`text-xs font-bold ${isActive ? 'text-yellow-200' : 'text-gray-300'}`}>{entity.name}</span>
            <span className="text-[10px] text-gray-400">VIT: {entity.speed}</span>
            {isActive && <span className="text-yellow-300 text-[10px] font-bold mt-1 animate-pulse">À JOUER</span>}
          </div>
        );
      })}
    </div>
  );
}
export function SwordFightBattleScreen() {
  const { gameState, dispatch, actions } = useGameContext();
  const [combatService, setCombatService] = useState(null);
  const [combatState, setCombatState] = useState({
    isInitialized: false,
    currentTurn: null,
    battleLog: [],
    waitingForAction: false,
    currentEntity: null,
    initiativeQueue: [],
    initiativeIndex: 0
  });
  // Synchroniser l'entité courante depuis le service
  useEffect(() => {
    if (!combatService) return;
    const interval = setInterval(() => {
      if (combatService.currentEntity) {
        const swordFightState = combatService.getGameState();
        setCombatState(prev => ({
          ...prev,
          currentEntity: combatService.currentEntity,
          initiativeQueue: swordFightState.initiativeQueue || [],
          initiativeIndex: swordFightState.initiativeIndex || 0
        }));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [combatService]);
  // Handler pour le choix du move du joueur
  const handlePlayerMove = useCallback((move) => {
    if (!combatService || !combatState.currentEntity || combatState.currentEntity.type !== 'player') return;
    setCombatState(prev => ({ ...prev, waitingForAction: true }));
    combatService.processPlayerTurnManual(combatState.currentEntity, move);
  }, [combatService, combatState.currentEntity]);

  const { playerTeam, enemyBoar } = gameState;

  // Initialiser le service de combat SwordFight
  useEffect(() => {
    if (!combatService) {
      const service = new SwordFightCombatService(dispatch, actions);
      setCombatService(service);
    }

    return () => {
      if (combatService) {
        combatService.cleanup();
      }
    };
  }, [dispatch, actions, combatService]);

  // Initialiser le combat quand les données sont prêtes
  useEffect(() => {
    if (combatService && playerTeam && !combatState.isInitialized) {
      // Créer un ennemi de test si aucun ennemi n'est défini
      let testEnemyBoar = enemyBoar;
      if (!enemyBoar) {
        testEnemyBoar = {
          id: 999,
          name: "Sanglier Sauvage",
          hp: 120,
          maxHp: 120,
          attack: 28,
          defense: 18,
          speed: 22,
          moves: [
            { name: "Charge Féroce", damage: 32, type: "physique" },
            { name: "Coup de Défense", damage: 25, type: "physique" },
            { name: "Rugissement", damage: 20, type: "intimidation" },
            { name: "Attaque Sauvage", damage: 38, type: "physique" }
          ]
        };
        // Dispatcher l'ennemi de test
        dispatch({ type: 'SET_ENEMY_BOAR', payload: testEnemyBoar });
      }
      
      initializeCombat();
    }
  }, [combatService, playerTeam, enemyBoar, combatState.isInitialized, dispatch]);

  // Écouter les événements Redux pour SwordFight
  useEffect(() => {
    const handleSwordFightEvents = () => {
      // Ces événements sont maintenant gérés automatiquement par SwordFight Engine
      // via les event listeners dans le service
    };

    handleSwordFightEvents();
  }, [gameState]);

  const initializeCombat = useCallback(async () => {
    if (!combatService || combatState.isInitialized) return;

    try {
      // Utiliser l'ennemi du gameState ou l'ennemi de test créé
      const currentEnemy = gameState.enemyBoar || enemyBoar;
      
      await combatService.initializeCombat(playerTeam, currentEnemy);
      
      setCombatState(prev => ({
        ...prev,
        isInitialized: true,
        battleLog: [...prev.battleLog, `Combat SwordFight initialisé ! ${currentEnemy?.name} apparaît !`]
      }));

    } catch (error) {
      console.error('Failed to initialize SwordFight combat:', error);
      setCombatState(prev => ({
        ...prev,
        battleLog: [...prev.battleLog, `Erreur d'initialisation: ${error.message}`]
      }));
    }
  }, [combatService, playerTeam, enemyBoar, gameState.enemyBoar, combatState.isInitialized]);



  // Synchroniser les PV/logs avec les events SwordFight
  useEffect(() => {
    function onRound(e) {
      const { myRoundData, opponentsRoundData, gameState: swordFightState } = e.detail || {};
      
      // Mettre à jour l'état local avec les données de SwordFight
      if (swordFightState) {
        // Synchroniser les PV des sangliers
        dispatch({
          type: 'UPDATE_TEAM_HP',
          payload: swordFightState.playerHp
        });
        
        // Synchroniser les PV de l'ennemi
        dispatch({
          type: 'UPDATE_ENEMY_HP', 
          payload: swordFightState.enemyHp
        });
      }
      
      setCombatState(prev => ({
        ...prev,
        waitingForAction: false,
        battleLog: [
          ...prev.battleLog,
          myRoundData ? `✅ ${myRoundData.move} (${myRoundData.damage} dégâts)` : '',
          opponentsRoundData ? `🔴 ${opponentsRoundData.move} sur ${opponentsRoundData.target} (${opponentsRoundData.damage} dégâts)` : ''
        ].filter(Boolean)
      }));
    }
    
    function onVictory() {
      setCombatState(prev => ({
        ...prev,
        waitingForAction: false,
        battleLog: [...prev.battleLog, '🏆 VICTOIRE ! Combat terminé !']
      }));
      
      // Rediriger vers l'écran de victoire après 2 secondes
      setTimeout(() => {
        dispatch({ type: 'SET_GAME_STATE', payload: 'victory' });
      }, 2000);
    }
    
    function onDefeat() {
      setCombatState(prev => ({
        ...prev,
        waitingForAction: false,
        battleLog: [...prev.battleLog, '💀 DÉFAITE ! Votre équipe a été vaincue...']
      }));
      
      // Rediriger vers l'écran de défaite après 2 secondes
      setTimeout(() => {
        dispatch({ type: 'SET_GAME_STATE', payload: 'gameOver' });
      }, 2000);
    }
    
    document.addEventListener('round', onRound);
    document.addEventListener('victory', onVictory);
    document.addEventListener('defeat', onDefeat);
    
    return () => {
      document.removeEventListener('round', onRound);
      document.removeEventListener('victory', onVictory);
      document.removeEventListener('defeat', onDefeat);
    };
  }, [dispatch]);

  if (!combatState.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-400 text-2xl font-bold mb-4 animate-pulse">
            ⚔️ Initialisation du Combat SwordFight...
          </div>
          <div className="text-yellow-200">
            Préparation des sangliers guerriers
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-4">
      {/* Bandeau d'initiative dynamique */}
      <InitiativeBanner initiativeQueue={combatState.initiativeQueue} initiativeIndex={combatState.initiativeIndex} />
      {/* Header avec logo SwordFight */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">
          ⚔️ COMBAT SWORDFIGHT ⚔️
        </h1>
        <div className="text-yellow-200 text-sm">
          Powered by SwordFight Engine - Combat au tour par tour optimisé
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
        {/* Zone des sangliers joueur */}
        <div className="col-span-3">
          <SwordFightPlayerTeam 
            playerTeam={playerTeam}
            currentEntity={combatState.currentEntity}
          />
        </div>

        {/* Zone de combat centrale */}
        <div className="col-span-6">
          <SwordFightArena 
            enemyBoar={gameState.enemyBoar || enemyBoar}
          />
        </div>

        {/* Zone d'informations et d'actions */}
        <div className="col-span-3">
          <SwordFightActionPanel 
            battleLog={combatState.battleLog}
            currentEntity={combatState.currentEntity}
            onPlayerMove={handlePlayerMove}
          />
        </div>
      </div>

      {/* Notification SwordFight */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <div className="bg-green-800 border-2 border-green-400 rounded-lg p-3 max-w-sm">
          <div className="text-green-200 text-xs font-bold mb-1">
            🚀 SwordFight Engine Active
          </div>
          <div className="text-green-300 text-xs">
            IA automatique • Gestion des tours optimisée • Événements temps réel
          </div>
        </div>
        
        {/* Boutons de debug */}
        <div className="bg-gray-800 border-2 border-gray-400 rounded-lg p-3 max-w-sm">
          <div className="text-gray-200 text-xs font-bold mb-2">🔧 Debug</div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (combatService) {
                  combatService.cleanup();
                  setCombatService(null);
                  setCombatState({
                    isInitialized: false,
                    currentTurn: null,
                    battleLog: [],
                    selectedBoar: null,
                    waitingForAction: false
                  });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
            >
              Reset
            </button>
            <button
              onClick={() => {
                console.log('Combat State:', combatState);
                console.log('Game State:', gameState);
                if (combatService) {
                  console.log('SwordFight State:', combatService.getGameState());
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
            >
              Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour l'équipe de sangliers
function SwordFightPlayerTeam({ playerTeam, currentEntity }) {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-700 border-2 border-blue-400 rounded-lg p-4">
      <h3 className="text-blue-200 font-bold text-lg mb-4 text-center">
        🐗 ÉQUIPE SANGLIERS
      </h3>
      <div className="space-y-3">
        {playerTeam?.map((boar) => {
          const isCurrent = currentEntity && currentEntity.type === 'player' && currentEntity.id === boar.id;
          return (
            <div
              key={boar.id}
              className={`relative transition-all duration-300 ${boar.hp === 0 ? 'opacity-50' : ''} ${isCurrent ? 'ring-4 ring-yellow-400 scale-105 z-10' : ''}`}
            >
              <div className={`bg-gradient-to-r from-orange-800 to-red-900 border-2 rounded-lg p-3 border-orange-400`}>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">
                    {boar.hp === 0 ? '💀' : '🐗'}
                  </div>
                  <div className="flex-1">
                    <div className="text-yellow-200 font-bold text-sm">
                      {boar.name}
                    </div>
                    <div className="mt-2">
                      <div className="bg-black border border-yellow-600 rounded h-2">
                        <div
                          className={`h-full rounded transition-all duration-500 ${
                            boar.hp === 0 ? 'bg-gray-600' : 'bg-gradient-to-r from-green-400 to-green-600'
                          }`}
                          style={{ width: `${(boar.hp / boar.maxHp) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-yellow-300 mt-1">
                        {boar.hp}/{boar.maxHp} PV
                      </div>
                    </div>
                  </div>
                </div>
                {isCurrent && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    À TOI DE JOUER !
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Composant pour l'arène de combat
function SwordFightArena({ enemyBoar }) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-gray-600 rounded-lg p-6 h-96 relative overflow-hidden">
      {/* Background d'arène */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-radial from-yellow-400/30 to-transparent"></div>
      </div>
      {/* Ennemi */}
      <div className="absolute top-8 right-8">
        <div className="text-center">
          <div className="text-8xl transform scale-x-[-1] animate-pulse">
            🐗
          </div>
          <div className="bg-red-900 text-yellow-200 px-4 py-2 rounded-lg border-2 border-red-400 font-bold shadow-lg">
            {enemyBoar?.name}
          </div>
          {/* Barre de vie ennemi */}
          <div className="mt-2 w-32 mx-auto">
            <div className="bg-black border-2 border-red-400 rounded p-1">
              <div className="bg-red-800 h-3 rounded relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-red-600 h-full transition-all duration-500"
                  style={{ width: `${(enemyBoar?.hp / enemyBoar?.maxHp) * 100}%` }}
                />
              </div>
              <div className="text-center text-red-200 text-xs mt-1">
                {enemyBoar?.hp}/{enemyBoar?.maxHp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour le panel d'actions
function SwordFightActionPanel({ battleLog, currentEntity, onPlayerMove }) {
  // Afficher les boutons d'action si c'est à un sanglier joueur de jouer
  const isPlayerTurn = currentEntity && currentEntity.type === 'player';
  const [locked, setLocked] = useState(false);

  // Reset le lock à chaque nouveau tour joueur
  React.useEffect(() => {
    setLocked(false);
  }, [currentEntity && currentEntity.id]);

  return (
    <div className="space-y-4">
      {isPlayerTurn && (
        <div className="bg-gradient-to-b from-green-900 to-green-700 border-2 border-green-400 rounded-lg p-4">
          <h4 className="text-green-200 font-bold text-center mb-3">
            ⚔️ CHOISIS UNE ACTION POUR {currentEntity.name}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {currentEntity.moves.map((move) => (
              <button
                key={move.id || move.name}
                onClick={() => {
                  if (!locked) {
                    setLocked(true);
                    onPlayerMove(move);
                  }
                }}
                disabled={locked}
                className={`bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 border border-blue-400 rounded p-3 transition-all duration-200 transform hover:scale-105 active:scale-95 ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-blue-200 font-bold text-sm">
                  {move.displayName || move.name}
                </div>
                <div className="text-blue-300 text-xs mt-1">
                  {move.heal ? `SOIN ${move.heal}` : `DMG ${move.damage}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Log de combat */}
      <div className="bg-black border-2 border-gray-600 rounded-lg p-3 h-40 overflow-y-auto">
        <h4 className="text-gray-400 font-bold text-sm mb-2">📜 LOG SWORDFIGHT</h4>
        <div className="space-y-1">
          {battleLog.slice(-10).map((log, index) => (
            <div key={index} className="text-gray-300 text-xs font-mono">
              &gt; {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


