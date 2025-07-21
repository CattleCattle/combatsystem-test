import React from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useGameActions } from '../../hooks/useGameActions.js';
import { getHpPercentage } from '../../utils/gameLogic.js';

export default function PathChoice() {
  const { gameState } = useGameContext();
  const { choosePath } = useGameActions();
  
  const { currentFloor, playerTeam, pathOptions } = gameState;
  
  // Debug pour voir l'état actuel
  console.log('PathChoice - currentFloor:', currentFloor);
  console.log('PathChoice - playerTeam:', playerTeam);
  console.log('PathChoice - pathOptions:', pathOptions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          🗺️ Carte du Donjon
        </h1>
        <p className="text-gray-600 mb-6">
          Étage {Number.isFinite(currentFloor) ? currentFloor : 1} - Choisissez votre chemin vers l'étage {Number.isFinite(currentFloor) ? currentFloor + 1 : 2}
        </p>

        {/* État de l'équipe */}
        <div className="mb-6 bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            État de votre équipe :
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {playerTeam && playerTeam.map((boar) => (
              <div key={boar.id} className="bg-white rounded p-2">
                <div className="font-bold text-sm">{boar.name}</div>
                <div className="text-xs text-gray-600">
                  {boar.hp}/{boar.maxHp} PV | ATT: {boar.attack} | DEF:{" "}
                  {boar.defense}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className={`h-1 rounded-full ${
                      boar.hp === 0 ? "bg-red-500" : "bg-green-500"
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

        {/* Carte des chemins */}
        <div className="bg-gradient-to-b from-green-100 to-brown-100 rounded-lg p-6 mb-4 relative overflow-hidden">
          {/* Décor de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="text-6xl absolute top-2 left-4">🌲</div>
            <div className="text-4xl absolute top-8 right-8">🏔️</div>
            <div className="text-5xl absolute bottom-4 left-8">🌿</div>
            <div className="text-3xl absolute bottom-8 right-4">🗿</div>
          </div>

          {/* Position actuelle */}
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                📍 Étage {Number.isFinite(currentFloor) ? currentFloor : 1} - Vous êtes ici
              </div>
            </div>

            {/* Chemins divergents */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {(pathOptions && pathOptions.length > 0) ? (
                pathOptions.map((path, index) => (
                  <PathOption key={index} path={path} onChoose={() => choosePath(path)} />
                ))
              ) : (
                <div className="col-span-3 text-gray-400 italic">Aucun chemin disponible</div>
              )}
            </div>

            {/* Destination */}
            <div className="flex justify-center mt-12">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                🎯 Étage {Number.isFinite(currentFloor) ? currentFloor + 1 : 2}
              </div>
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <h4 className="font-bold text-gray-800 mb-2">
            💡 Conseils stratégiques :
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
            <div>• Équipe blessée ? Choisissez la guérison 💚</div>
            <div>• Besoin de puissance ? Tentez l'élite 💀</div>
            <div>• Envie de surprise ? Mystère ❓</div>
            <div>• Amélioration garantie ? Trésor 💎</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PathOption({ path, onChoose }) {
  const getRiskLevel = () => {
    if (path.difficulty === 0) return <span className="text-xs text-green-600">🟢 Sûr</span>;
    if (path.difficulty === 1.0) return <span className="text-xs text-yellow-600">🟡 Normal</span>;
    if (path.difficulty === 1.4) return <span className="text-xs text-orange-600">🟠 Difficile</span>;
    if (path.difficulty === 1.8) return <span className="text-xs text-red-600">🔴 Très Difficile</span>;
    return null;
  };

  const getRewardBadge = () => {
    const badges = {
      upgrade: <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">⬆️ Amélioration</span>,
      double_upgrade: <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">⬆️⬆️ Double</span>,
      boss_reward: <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">👑 Boss</span>,
      heal: <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">💚 Soin</span>,
      treasure: <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">💎 Trésor</span>,
      mystery: <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">❓ Mystère</span>,
    };
    return badges[path.reward] || null;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Nœud du chemin */}
      <button
        onClick={onChoose}
        className="relative bg-white hover:bg-gray-50 border-4 border-indigo-300 hover:border-indigo-500 rounded-full w-32 h-32 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
      >
        <div className="text-4xl mb-1">{path.icon}</div>
        <div className="text-xs font-bold text-indigo-800 text-center px-2">
          {path.name.split(" ")[0]}
        </div>
        {path.difficulty > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {Math.round(path.difficulty * 100)}%
          </div>
        )}
      </button>

      {/* Description détaillée */}
      <div className="mt-4 bg-white rounded-lg p-3 shadow-md border-2 border-indigo-200 max-w-xs">
        <div className="font-bold text-indigo-800 mb-1">
          {path.name}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {path.description}
        </div>

        {/* Indicateurs de récompense */}
        <div className="flex justify-center space-x-1">
          {getRewardBadge()}
        </div>

        {/* Niveau de risque */}
        <div className="mt-2 flex justify-center">
          {getRiskLevel()}
        </div>
      </div>
    </div>
  );
}
