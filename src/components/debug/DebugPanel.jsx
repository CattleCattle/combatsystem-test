/**
 * Composant de test pour diagnostiquer les problèmes de fonctionnalités
 */
import React from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useGameActions } from '../../hooks/useGameActions.js';
import { GAME_STATES } from '../../constants/gameData.js';
import { generatePathOptions } from '../../utils/gameLogic.js';

export default function DebugPanel() {
  const { gameState, dispatch } = useGameContext();
  const { startGame, resetGame } = useGameActions();

  const testPathGeneration = () => {
    try {
      const paths = generatePathOptions(1);
      console.log('Generated paths:', paths);
      dispatch({ type: 'SET_PATH_OPTIONS', payload: paths });
    } catch (error) {
      console.error('Path generation failed:', error);
    }
  };

  const navigateToState = (state) => {
    dispatch({ type: 'SET_GAME_STATE', payload: state });
  };

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold text-red-600 mb-2">🐛 Debug Panel</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>État:</strong> {gameState.gameState}
        </div>
        <div>
          <strong>Étage:</strong> {gameState.currentFloor}
        </div>
        <div>
          <strong>Équipe:</strong> {gameState.playerTeam ? gameState.playerTeam.length : 0} sangliers
        </div>
        <div>
          <strong>Chemins:</strong> {gameState.pathOptions ? gameState.pathOptions.length : 0} options
        </div>
        <div>
          <strong>Or:</strong> {gameState.gold}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <button 
          onClick={startGame}
          className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs"
        >
          🎮 Start Game
        </button>
        <button 
          onClick={resetGame}
          className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          🔄 Reset Game
        </button>
        <button 
          onClick={testPathGeneration}
          className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          🗺️ Test Paths
        </button>
        <button 
          onClick={() => navigateToState(GAME_STATES.PATH_CHOICE)}
          className="w-full bg-purple-500 text-white px-2 py-1 rounded text-xs"
        >
          ➡️ To Paths
        </button>
        <button 
          onClick={() => navigateToState(GAME_STATES.MENU)}
          className="w-full bg-yellow-500 text-white px-2 py-1 rounded text-xs"
        >
          🏠 To Menu
        </button>
      </div>
    </div>
  );
}
