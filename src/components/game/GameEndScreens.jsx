import React from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useGameActions } from '../../hooks/useGameActions.js';

export function VictoryScreen() {
  const { gameState } = useGameContext();
  const { currentFloor } = gameState;
  const { proceedToUpgrade } = useGameActions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          🏆 Victoire ! 🏆
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          Votre équipe a gagné le combat !
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Étage {currentFloor} terminé
        </p>
        <button
          onClick={proceedToUpgrade}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
        >
          Continuer l'Aventure
        </button>
      </div>
    </div>
  );
}

export function GameOverScreen() {
  const { gameState } = useGameContext();
  const { currentFloor, playerTeam } = gameState;
  const { resetGame } = useGameActions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          💀 Game Over 💀
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          Votre équipe a été vaincue...
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Vous avez atteint l'étage {currentFloor}
        </p>
        
        <div className="mb-6 text-sm text-gray-600">
          <div className="font-semibold mb-2">Équipe finale :</div>
          {playerTeam && playerTeam.map((boar) => (
            <div key={boar.id} className="mb-1">
              {boar.name}: PV {boar.maxHp} | ATT {boar.attack} | DEF{" "}
              {boar.defense}
            </div>
          ))}
        </div>
        
        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
        >
          Nouvelle Partie
        </button>
      </div>
    </div>
  );
}
