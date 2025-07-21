import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useBattleActions } from '../../hooks/useGameActions.js';
import { useBattleQueue } from '../../hooks/useBattleQueue.js';
import { getHpPercentage } from '../../utils/gameLogic.js';
import { GAME_STATES } from '../../constants/gameData.js';
import BattleQueue from './BattleQueue.jsx';

export default function BattleScreen() {
  const {
    gameState,
    dispatch,
    actions,
  } = useGameContext();
  
  const {
    playerTeam,
    enemyBoar,
    battleLog,
    selectedBoar,
  } = gameState;
  
  const { executeMove } = useBattleActions();
  const [waitingForAction, setWaitingForAction] = useState(false);
  const [currentActiveCharacter, setCurrentActiveCharacter] = useState(null);

  // Système de file d'attaque
  const {
    battleQueue,
    actionBars,
    initializeBattleQueue,
    getNextReadyCombatant,
    markCombatantActed,
    updateQueueAfterDeath,
    getActionOrder
  } = useBattleQueue(playerTeam, enemyBoar, gameState.gameState === GAME_STATES.BATTLE);

  // Initialiser la file d'attaque au début du combat
  useEffect(() => {
    if (gameState.gameState === GAME_STATES.BATTLE && playerTeam && enemyBoar) {
      initializeBattleQueue();
    }
  }, [gameState.gameState, playerTeam, enemyBoar, initializeBattleQueue]);

  // Gérer les tours automatiquement
  useEffect(() => {
    if (gameState.gameState !== GAME_STATES.BATTLE || waitingForAction) return;

    const nextCombatant = getNextReadyCombatant();
    if (!nextCombatant) return;

    setCurrentActiveCharacter(nextCombatant);

    if (nextCombatant.type === 'enemy') {
      // Tour de l'ennemi - attaque automatique
      setWaitingForAction(true);
      setTimeout(() => {
        handleEnemyTurn(nextCombatant);
      }, 1000);
    } else if (nextCombatant.type === 'player') {
      // Tour du joueur - attendre la sélection
      if (selectedBoar && selectedBoar.id === nextCombatant.id) {
        // Le bon sanglier est déjà sélectionné
        return;
      } else {
        // Sélectionner automatiquement le sanglier dont c'est le tour
        dispatch({ type: actions.SET_SELECTED_BOAR, payload: nextCombatant });
      }
    }
  }, [gameState.gameState, waitingForAction, getNextReadyCombatant, selectedBoar, dispatch, actions]);

  // Gérer l'attaque de l'ennemi
  const handleEnemyTurn = (enemyCombatant) => {
    const aliveTeamMembers = playerTeam.filter((boar) => boar.hp > 0);
    if (aliveTeamMembers.length === 0) return;

    const randomTarget = aliveTeamMembers[Math.floor(Math.random() * aliveTeamMembers.length)];
    const randomMove = enemyCombatant.moves[Math.floor(Math.random() * enemyCombatant.moves.length)];
    
    executeMove(enemyCombatant, randomTarget, randomMove, false);
    markCombatantActed(enemyCombatant);
    setCurrentActiveCharacter(null);
    setWaitingForAction(false);
  };

  // Gérer l'attaque du joueur
  const handlePlayerAttack = (move) => {
    if (!currentActiveCharacter || currentActiveCharacter.type !== 'player' || waitingForAction) return;
    if (!selectedBoar || selectedBoar.id !== currentActiveCharacter.id) return;

    setWaitingForAction(true);
    executeMove(selectedBoar, enemyBoar, move, true);
    markCombatantActed(currentActiveCharacter);
    
    setTimeout(() => {
      setCurrentActiveCharacter(null);
      setWaitingForAction(false);
      dispatch({ type: actions.SET_SELECTED_BOAR, payload: null });
    }, 1500);
  };

  // Mettre à jour la file après une mort
  useEffect(() => {
    if (enemyBoar && enemyBoar.hp <= 0) {
      updateQueueAfterDeath(enemyBoar.id, 'enemy');
    }
    
    playerTeam.forEach(boar => {
      if (boar.hp <= 0) {
        updateQueueAfterDeath(boar.id, 'player');
      }
    });
  }, [playerTeam, enemyBoar, updateQueueAfterDeath]);

  const selectBoar = (boar) => {
    // On ne peut sélectionner un sanglier que si c'est son tour
    if (boar.hp > 0 && currentActiveCharacter && currentActiveCharacter.id === boar.id && currentActiveCharacter.type === 'player') {
      dispatch({ type: actions.SET_SELECTED_BOAR, payload: boar });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-600 to-orange-800 relative overflow-hidden">
      {/* Fond de combat style pixel art */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-yellow-300 to-orange-400 opacity-80"></div>
      <BattleBackground />

      {/* File d'attaque en haut à droite */}
      <BattleQueue 
        actionOrder={getActionOrder()} 
        actionBars={actionBars}
      />

      <div className="relative z-10 h-screen flex flex-col">
        {/* Zone de combat principale */}
        <div className="flex-1 flex items-center justify-between px-8 py-4">
          {/* Équipe du joueur (à droite) */}
          <PlayerTeam 
            playerTeam={playerTeam}
            selectedBoar={selectedBoar}
            currentActiveCharacter={currentActiveCharacter}
            waitingForAction={waitingForAction}
            onSelectBoar={selectBoar}
          />

          {/* Ennemi (à gauche) */}
          <EnemyDisplay 
            enemyBoar={enemyBoar} 
            isActive={currentActiveCharacter && currentActiveCharacter.type === 'enemy'}
          />
        </div>

        {/* Interface utilisateur style rétro */}
        <BattleUI 
          playerTeam={playerTeam}
          currentActiveCharacter={currentActiveCharacter}
          selectedBoar={selectedBoar}
          battleLog={battleLog}
          waitingForAction={waitingForAction}
          onPlayerAttack={handlePlayerAttack}
        />
      </div>
    </div>
  );
}

function BattleBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full opacity-20">
      <div className="text-8xl absolute top-4 left-8 text-green-800">🌲</div>
      <div className="text-6xl absolute top-12 right-12 text-green-700">🌳</div>
      <div className="text-7xl absolute bottom-20 left-16 text-green-800">🌿</div>
      <div className="text-5xl absolute bottom-32 right-20 text-brown-600">🗿</div>
      <div className="text-6xl absolute top-1/2 left-1/4 text-green-600">🍃</div>
    </div>
  );
}

function PlayerTeam({ playerTeam, selectedBoar, currentActiveCharacter, waitingForAction, onSelectBoar }) {
  return (
    <div className="flex flex-col space-y-4">
      {playerTeam && playerTeam.map((boar, index) => {
        const isCurrentTurn = currentActiveCharacter && currentActiveCharacter.id === boar.id && currentActiveCharacter.type === 'player';
        const isSelected = selectedBoar?.id === boar.id;
        const canSelect = isCurrentTurn && !waitingForAction;

        return (
          <div
            key={boar.id}
            className={`relative transition-all duration-300 ${
              isSelected ? "scale-110 z-20" : "scale-100"
            } ${boar.hp === 0 ? "opacity-50 grayscale" : ""} ${
              isCurrentTurn ? "ring-4 ring-yellow-400 ring-opacity-60" : ""
            }`}
            onClick={() => onSelectBoar(boar)}
          >
            {/* Sprite du sanglier */}
            <div
              className={`text-6xl transition-all duration-200 ${
                canSelect ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"
              } ${isSelected ? "animate-bounce" : ""} ${
                isCurrentTurn && !isSelected ? "animate-pulse" : ""
              } ${boar.hp === 0 ? "filter grayscale" : ""}`}
            >
              🐗
            </div>

            {/* Indicateur de tour actif */}
            {isCurrentTurn && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  TON TOUR
                </div>
              </div>
            )}

            {/* Indicateur de sélection */}
            {isSelected && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-yellow-400 animate-pulse"></div>
              </div>
            )}

            {/* Effets de statut */}
            {boar.hp === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">💀</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EnemyDisplay({ enemyBoar }) {
  if (!enemyBoar) return null;

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="relative">
        {/* Sprite de l'ennemi */}
        <div className="text-9xl transform scale-x-[-1] animate-pulse">
          🐗
        </div>

        {/* Nom de l'ennemi */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-900 text-yellow-200 px-4 py-1 rounded-lg border-2 border-yellow-400 font-bold text-lg shadow-lg">
          {enemyBoar.name}
        </div>

        {/* Barre de vie de l'ennemi */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48">
          <div className="bg-black border-2 border-yellow-400 rounded p-1">
            <div className="bg-red-800 h-3 rounded relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-400 to-red-600 h-full transition-all duration-500 relative"
                style={{
                  width: `${getHpPercentage(enemyBoar.hp, enemyBoar.maxHp)}%`,
                }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="text-center text-yellow-200 text-sm font-bold mt-1">
              {enemyBoar.hp}/{enemyBoar.maxHp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BattleUI({ playerTeam, currentActiveCharacter, selectedBoar, battleLog, waitingForAction, onPlayerAttack }) {
  const canAttack = currentActiveCharacter && 
                   currentActiveCharacter.type === 'player' && 
                   selectedBoar && 
                   selectedBoar.id === currentActiveCharacter.id && 
                   !waitingForAction;

  return (
    <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border-t-4 border-yellow-400 p-4">
      <div className="grid grid-cols-12 gap-4 h-32">
        {/* Menu de gauche */}
        <div className="col-span-8">
          {canAttack ? (
            <AttackMenu 
              selectedBoar={selectedBoar} 
              onPlayerAttack={onPlayerAttack}
            />
          ) : (
            <TurnIndicator 
              currentActiveCharacter={currentActiveCharacter}
              waitingForAction={waitingForAction}
            />
          )}
        </div>

        {/* Informations de l'équipe */}
        <TeamStatus playerTeam={playerTeam} />

        {/* Actions de combat */}
        <div className="col-span-3 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
          <div className="text-yellow-200 font-bold text-xs mb-2 text-center">
            {currentActiveCharacter?.type === 'player' ? "VOTRE TOUR" : 
             currentActiveCharacter?.type === 'enemy' ? "TOUR ENNEMI" : 
             "EN ATTENTE"}
          </div>
          {selectedBoar && currentActiveCharacter?.type === 'player' ? (
            <div className="text-yellow-300 text-xs text-center">
              {selectedBoar.name}
              <br />
              <span className="text-green-400">
                {waitingForAction ? "ATTAQUE..." : "PRÊT"}
              </span>
            </div>
          ) : currentActiveCharacter?.type === 'enemy' ? (
            <div className="text-red-400 text-xs text-center">
              {currentActiveCharacter.name}
              <br />
              <span className="text-red-300">ATTAQUE !</span>
            </div>
          ) : (
            <div className="text-gray-400 text-xs text-center">
              Préparation...
            </div>
          )}
        </div>
      </div>

      {/* Menu des attaques */}
      <MoveSelection 
        selectedBoar={selectedBoar}
        currentActiveCharacter={currentActiveCharacter}
        waitingForAction={waitingForAction}
        onPlayerAttack={onPlayerAttack}
      />

      {/* Log de combat */}
      <BattleLog battleLog={battleLog} />
    </div>
  );
}

function TeamStatus({ playerTeam }) {
  return (
    <div className="col-span-1 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-2">
      <div className="text-yellow-200 font-bold text-xs mb-2 text-center">
        ÉQUIPE
      </div>
      <div className="space-y-1">
        {playerTeam && playerTeam.map((boar) => (
          <div key={boar.id} className="text-center">
            <div className="text-yellow-300 text-xs font-bold truncate">
              {boar.name.split(' ')[0]}
            </div>
            <div className="text-yellow-200 text-xs">
              {boar.hp > 0 ? `${boar.hp}/${boar.maxHp}` : "KO"}
            </div>
            {/* Barre de vie mini */}
            <div className="bg-black border border-yellow-600 rounded mt-1 h-1">
              <div
                className={`h-full rounded transition-all duration-300 ${
                  boar.hp === 0
                    ? "bg-gray-600"
                    : "bg-gradient-to-r from-green-400 to-green-600"
                }`}
                style={{
                  width: `${getHpPercentage(boar.hp, boar.maxHp)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoveSelection({ selectedBoar, currentActiveCharacter, waitingForAction, onPlayerAttack }) {
  const canAttack = selectedBoar && 
                   currentActiveCharacter && 
                   currentActiveCharacter.type === 'player' && 
                   selectedBoar.id === currentActiveCharacter.id && 
                   !waitingForAction;

  if (!canAttack) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
      {selectedBoar.moves.map((move, index) => (
        <button
          key={index}
          onClick={() => onPlayerAttack(move)}
          className="bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 border-2 border-cyan-400 rounded-lg p-3 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <div className="text-cyan-200 font-bold text-sm mb-1">
            {move.name.toUpperCase()}
          </div>
          <div className="text-cyan-300 text-xs">
            {move.heal
              ? `SOIN ${move.heal}`
              : move.healTeam
              ? `SOIN ÉQUIPE ${move.healTeam}`
              : `DMG ${move.damage}`}
          </div>
          <div className="text-cyan-400 text-xs mt-1">
            {move.type.toUpperCase()}
            {move.recoil && " • RECUL"}
            {move.priority && " • PRIORITÉ"}
          </div>
        </button>
      ))}
    </div>
  );
}

function BattleLog({ battleLog }) {
  return (
    <div className="mt-4 bg-black border-2 border-yellow-400 rounded-lg p-3 h-20 overflow-y-auto">
      <div className="space-y-1">
        {battleLog.slice(-3).map((log, index) => (
          <div key={index} className="text-yellow-200 text-sm font-mono">
            &gt; {log}
          </div>
        ))}
      </div>
    </div>
  );
}

function TurnIndicator({ currentActiveCharacter, waitingForAction }) {
  if (waitingForAction) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-yellow-400 text-lg font-bold animate-pulse">
            Action en cours...
          </div>
          <div className="text-yellow-200 text-sm mt-2">
            Veuillez patienter
          </div>
        </div>
      </div>
    );
  }

  if (!currentActiveCharacter) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-yellow-400 text-lg font-bold">
            Préparation du combat
          </div>
          <div className="text-yellow-200 text-sm mt-2">
            Initialisation de la file d'attaque
          </div>
        </div>
      </div>
    );
  }

  if (currentActiveCharacter.type === 'enemy') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-400 text-lg font-bold animate-pulse">
            Tour de l'ennemi
          </div>
          <div className="text-red-200 text-sm mt-2">
            {currentActiveCharacter.name} prépare son attaque
          </div>
        </div>
      </div>
    );
  }

  if (currentActiveCharacter.type === 'player') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-green-400 text-lg font-bold">
            Sélectionnez votre sanglier
          </div>
          <div className="text-green-200 text-sm mt-2">
            C'est le tour de {currentActiveCharacter.name}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function AttackMenu({ selectedBoar, onPlayerAttack }) {
  return (
    <div className="bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3 h-full">
      <div className="text-yellow-200 font-bold text-sm mb-3 text-center">
        ⚔️ CHOISISSEZ UNE ATTAQUE
      </div>
      <div className="grid grid-cols-2 gap-2">
        {selectedBoar.moves.slice(0, 4).map((move, index) => (
          <button
            key={index}
            onClick={() => onPlayerAttack(move)}
            className="bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 border border-cyan-400 rounded p-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <div className="text-cyan-200 font-bold text-xs">
              {move.name}
            </div>
            <div className="text-cyan-300 text-xs mt-1">
              {move.heal
                ? `SOIN ${move.heal}`
                : move.healTeam
                ? `SOIN ÉQUIPE ${move.healTeam}`
                : `DMG ${move.damage}`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
