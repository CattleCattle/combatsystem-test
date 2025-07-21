import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../contexts/GameContext';
import ClientOnly from '../ClientOnly';

export default function SimpleTournamentMode() {
  const { gameState, dispatch } = useGameContext();
  const [tournamentStarted, setTournamentStarted] = useState(false);

  const goBackToMenu = () => {
    dispatch({ type: 'SET_GAME_STATE', payload: 'menu' });
  };

  const startTournament = (size) => {
    // Simulation simple d'un tournoi
    const prizes = {
      8: { winner: 3200, participant: 400 },
      16: { winner: 6400, participant: 800 }
    };

    const prize = prizes[size];
    const won = Math.random() > 0.7; // 30% de chance de gagner

    if (won) {
      dispatch({ type: 'ADD_GOLD', payload: prize.winner });
      alert(`🏆 Félicitations ! Vous avez gagné le tournoi et remporté ${prize.winner} or !`);
    } else {
      dispatch({ type: 'ADD_GOLD', payload: prize.participant });
      alert(`Dommage ! Vous avez été éliminé mais gagnez ${prize.participant} or pour votre participation.`);
    }

    setTournamentStarted(true);
    setTimeout(() => {
      setTournamentStarted(false);
    }, 2000);
  };

  return (
    <ClientOnly fallback={<div className="p-8">Chargement du tournoi...</div>}>
      <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🏆 Mode Tournoi</h2>
          <button
            onClick={goBackToMenu}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Retour au Menu
          </button>
        </div>

        {!tournamentStarted ? (
          <div className="text-center space-y-8">
            <div>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Participez à des tournois épiques contre d'autres équipes ! 
                Gagnez des prix en or selon votre classement final.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.div
                className="bg-white rounded-lg shadow p-6 border-2 border-blue-200"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-bold mb-3">Tournoi 8 équipes</h3>
                <div className="text-gray-600 mb-4">
                  • 3 rounds de combat<br/>
                  • Gagnant: 3200 or<br/>
                  • Participation: 400 or<br/>
                  • Chance de victoire: 30%
                </div>
                <button
                  onClick={() => startTournament(8)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600"
                >
                  Rejoindre (8 équipes)
                </button>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg shadow p-6 border-2 border-purple-200"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-bold mb-3">Tournoi 16 équipes</h3>
                <div className="text-gray-600 mb-4">
                  • 4 rounds de combat<br/>
                  • Gagnant: 6400 or<br/>
                  • Participation: 800 or<br/>
                  • Chance de victoire: 30%
                </div>
                <button
                  onClick={() => startTournament(16)}
                  className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600"
                >
                  Rejoindre (16 équipes)
                </button>
              </motion.div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
              <h4 className="font-bold text-yellow-800 mb-2">💡 Conseils</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Assurez-vous que votre équipe est en pleine forme</li>
                <li>• Les matchs sont éliminatoires - une défaite et c'est fini !</li>
                <li>• Vous gagnez de l'or même si vous perdez</li>
                <li>• Plus le tournoi est grand, plus les récompenses sont importantes</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              ⚔️
            </motion.div>
            <h3 className="text-2xl font-bold">Tournoi en cours...</h3>
            <p className="text-gray-600">Simulation des combats...</p>
          </div>
        )}
      </motion.div>
    </div>
    </ClientOnly>
  );
}
