import React from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useGameActions } from '../../hooks/useGameActions.js';
import { GAME_STATES } from '../../constants/gameData.js';

export default function MainMenu() {
  const { gameState, dispatch } = useGameContext();
  const { startGame } = useGameActions();

  const navigateTo = (state) => {
    dispatch({ type: 'SET_GAME_STATE', payload: state });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          🐗 Donjon des Sangliers 🐗
        </h1>
        <p className="text-gray-600 mb-6">
          Un roguelite de combat au tour par tour
        </p>
        
        <div className="mb-6">
          <div className="text-lg font-semibold text-green-700 mb-2">
            Votre Équipe :
          </div>
          {gameState.playerTeam && gameState.playerTeam.length > 0 ? (
            gameState.playerTeam.map((boar) => (
              <div key={boar.id} className="mb-2">
                <div className="text-lg font-bold text-green-800">
                  {boar.name}
                </div>
                <div className="text-sm text-gray-600">
                  PV: {boar.maxHp} | ATT: {boar.attack} | DEF: {boar.defense}
                </div>
              </div>
            ))
          ) : (
            <div className="text-red-500 font-bold">
              ⚠️ Équipe non chargée - Redémarrez le jeu
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-center">
          <div className="text-yellow-600 font-bold text-lg">
            💰 {gameState.gold || 1000} Or
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <button
            onClick={startGame}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🎮 Commencer l'Aventure !
          </button>
          
          <button
            onClick={() => navigateTo(GAME_STATES.INVENTORY)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🎒 Inventaire & Boutique
          </button>
          
          <button
            onClick={() => navigateTo(GAME_STATES.BOAR_EDITOR)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🎨 Éditeur de Sangliers
          </button>
          
          <button
            onClick={() => navigateTo(GAME_STATES.TOURNAMENT)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🏆 Mode Tournoi
          </button>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>• Dirigez une équipe de 3 sangliers</p>
          <p>• Choisissez votre chemin entre les combats</p>
          <p>• Créez vos sangliers personnalisés</p>
          <p>• Participez aux tournois pour gagner de l'or !</p>
        </div>
      </div>
    </div>
  );
}
