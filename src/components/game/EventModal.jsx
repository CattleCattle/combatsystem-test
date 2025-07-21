import React from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useGameActions } from '../../hooks/useGameActions.js';

export default function EventModal() {
  const { gameState, dispatch, actions } = useGameContext();
  const { proceedToNextFloor } = useGameActions();
  
  const { eventModal } = gameState;
  
  if (!eventModal.isVisible) {
    return null;
  }

  const handleContinue = () => {
    // Fermer la modale
    dispatch({ 
      type: actions.SET_EVENT_MODAL, 
      payload: { isVisible: false, title: '', message: '', type: '' } 
    });
    
    // Continuer vers l'étage suivant
    proceedToNextFloor();
  };

  const getModalIcon = () => {
    switch (eventModal.type) {
      case 'healing': return '💚';
      case 'treasure': return '💎';
      case 'mystery': return '❓';
      default: return '✨';
    }
  };

  const getModalColor = () => {
    switch (eventModal.type) {
      case 'healing': return 'from-green-400 to-green-600';
      case 'treasure': return 'from-yellow-400 to-yellow-600';
      case 'mystery': return 'from-purple-400 to-purple-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className={`bg-gradient-to-r ${getModalColor()} text-white p-6 rounded-t-lg text-center`}>
          <div className="text-4xl mb-2">{getModalIcon()}</div>
          <h2 className="text-2xl font-bold">{eventModal.title}</h2>
        </div>
        
        <div className="p-6 text-center">
          <p className="text-lg text-gray-700 mb-6">
            {eventModal.message}
          </p>
          
          <button
            onClick={handleContinue}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
          >
            ➡️ Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
