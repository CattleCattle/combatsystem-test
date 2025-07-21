import React, { useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useBattleActions } from '../../hooks/useGameActions.js';
import { getHpPercentage } from '../../utils/gameLogic.js';
import { GAME_STATES } from '../../constants/gameData.js';

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
    isPlayerTurn,
    selectedBoar,
  } = gameState;
  
  const { playerAttack, enemyAttack } = useBattleActions();

  // Effet pour gérer l'attaque automatique de l'ennemi
  useEffect(() => {
    if (
      !isPlayerTurn &&
      gameState.gameState === GAME_STATES.BATTLE &&
      enemyBoar &&
      enemyBoar.hp > 0
    ) {
      const aliveMembers = playerTeam.filter((boar) => boar.hp > 0);
      if (aliveMembers.length > 0) {
        const timer = setTimeout(() => {
          enemyAttack();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isPlayerTurn, gameState, enemyBoar, playerTeam, enemyAttack]);

  const selectBoar = (boar) => {
    if (boar.hp > 0 && isPlayerTurn) {
      dispatch({ type: actions.SET_SELECTED_BOAR, payload: boar });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-600 to-orange-800 relative overflow-hidden">
      {/* Fond de combat style pixel art */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-yellow-300 to-orange-400 opacity-80"></div>
      <BattleBackground />

      <div className="relative z-10 h-screen flex flex-col">
        {/* Zone de combat principale */}
        <div className="flex-1 flex items-center justify-between px-8 py-4">
          {/* Équipe du joueur (à droite) */}
          <PlayerTeam 
            playerTeam={playerTeam}
            selectedBoar={selectedBoar}
            isPlayerTurn={isPlayerTurn}
            onSelectBoar={selectBoar}
          />

          {/* Ennemi (à gauche) */}
          <EnemyDisplay enemyBoar={enemyBoar} />
        </div>

        {/* Interface utilisateur style rétro */}
        <BattleUI 
          playerTeam={playerTeam}
          isPlayerTurn={isPlayerTurn}
          selectedBoar={selectedBoar}
          battleLog={battleLog}
          onPlayerAttack={playerAttack}
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

function PlayerTeam({ playerTeam, selectedBoar, isPlayerTurn, onSelectBoar }) {
  return (
    <div className="flex flex-col space-y-4">
      {playerTeam && playerTeam.map((boar, index) => (
        <div
          key={boar.id}
          className={`relative transition-all duration-300 ${
            selectedBoar?.id === boar.id ? "scale-110 z-20" : "scale-100"
          } ${boar.hp === 0 ? "opacity-50 grayscale" : ""}`}
          onClick={() => onSelectBoar(boar)}
        >
          {/* Sprite du sanglier */}
          <div
            className={`text-6xl cursor-pointer transition-all duration-200 ${
              selectedBoar?.id === boar.id ? "animate-bounce" : ""
            } ${boar.hp === 0 ? "filter grayscale" : ""}`}
          >
            🐗
          </div>

          {/* Indicateur de sélection */}
          {selectedBoar?.id === boar.id && (
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
      ))}
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

function BattleUI({ playerTeam, isPlayerTurn, selectedBoar, battleLog, onPlayerAttack }) {
  return (
    <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border-t-4 border-yellow-400 p-4">
      <div className="grid grid-cols-12 gap-4 h-32">
        {/* Menu de gauche */}
        <div className="col-span-3 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-yellow-200 font-bold text-sm">
              <span>⚔️</span>
              <span>COMBAT</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 font-bold text-sm">
              <span>🛠️</span>
              <span>OUTILS</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 font-bold text-sm">
              <span>🎒</span>
              <span>OBJETS</span>
            </div>
          </div>
        </div>

        {/* Informations de l'équipe */}
        <TeamStatus playerTeam={playerTeam} />

        {/* Actions de combat */}
        <div className="col-span-3 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
          <div className="text-yellow-200 font-bold text-xs mb-2 text-center">
            {isPlayerTurn ? "VOTRE TOUR" : "TOUR ENNEMI"}
          </div>
          {selectedBoar && isPlayerTurn ? (
            <div className="text-yellow-300 text-xs text-center">
              {selectedBoar.name}
              <br />
              <span className="text-green-400">PRÊT</span>
            </div>
          ) : (
            <div className="text-gray-400 text-xs text-center">
              {isPlayerTurn ? "Sélectionnez\nun sanglier" : "Attendez..."}
            </div>
          )}
        </div>
      </div>

      {/* Menu des attaques */}
      <MoveSelection 
        selectedBoar={selectedBoar}
        isPlayerTurn={isPlayerTurn}
        onPlayerAttack={onPlayerAttack}
      />

      {/* Log de combat */}
      <BattleLog battleLog={battleLog} />
    </div>
  );
}

function TeamStatus({ playerTeam }) {
  return (
    <div className="col-span-6 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
      <div className="grid grid-cols-3 gap-2 h-full">
        {playerTeam && playerTeam.map((boar) => (
          <div key={boar.id} className="text-center">
            <div className="text-yellow-200 font-bold text-xs mb-1 truncate">
              {boar.name.toUpperCase()}
            </div>
            <div className="text-yellow-300 text-xs">
              {boar.hp > 0 ? boar.hp : "KO"}
            </div>
            {/* Barre de vie */}
            <div className="bg-black border border-yellow-600 rounded mt-1 h-2">
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

function MoveSelection({ selectedBoar, isPlayerTurn, onPlayerAttack }) {
  if (!selectedBoar || !isPlayerTurn) return null;

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
