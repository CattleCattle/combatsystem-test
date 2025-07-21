import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../../contexts/GameContext';
import { ENEMY_TEAMS } from '../../constants/gameData';

const TOURNAMENT_BRACKETS = {
  8: [
    { round: 1, matches: [[0, 1], [2, 3], [4, 5], [6, 7]] },
    { round: 2, matches: [[0, 1], [2, 3]] },
    { round: 3, matches: [[0, 1]] },
  ],
  16: [
    { round: 1, matches: [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15]] },
    { round: 2, matches: [[0, 1], [2, 3], [4, 5], [6, 7]] },
    { round: 3, matches: [[0, 1], [2, 3]] },
    { round: 4, matches: [[0, 1]] },
  ],
};

export default function TournamentMode() {
  const { gameState, dispatch } = useGameContext();
  const [tournament, setTournament] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [tournamentPhase, setTournamentPhase] = useState('setup'); // setup, active, battle, completed

  const createTournament = (size) => {
    // Générer des équipes pour le tournoi
    const participants = [];
    
    // Ajouter l'équipe du joueur
    participants.push({
      id: 'player',
      name: 'Votre Équipe',
      team: gameState.playerTeam,
      isPlayer: true,
      wins: 0,
    });

    // Ajouter des équipes IA
    const availableEnemies = [...ENEMY_TEAMS];
    for (let i = 1; i < size; i++) {
      const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
      participants.push({
        id: `ai_${i}`,
        name: `${randomEnemy.name} ${i}`,
        team: randomEnemy.team.map(boar => ({
          ...boar,
          id: `${boar.id}_${i}`,
          hp: boar.maxHp,
        })),
        isPlayer: false,
        wins: 0,
      });
    }

    // Mélanger les participants (sauf le joueur qui reste en position 0)
    const playerTeam = participants[0];
    const otherTeams = participants.slice(1);
    for (let i = otherTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherTeams[i], otherTeams[j]] = [otherTeams[j], otherTeams[i]];
    }

    const newTournament = {
      id: Date.now().toString(),
      size,
      participants: [playerTeam, ...otherTeams],
      brackets: TOURNAMENT_BRACKETS[size],
      currentRound: 1,
      results: [],
      prizes: calculatePrizes(size),
    };

    setTournament(newTournament);
    setTournamentPhase('active');
  };

  const calculatePrizes = (size) => {
    const basePrize = size * 100;
    return {
      winner: basePrize * 4,
      finalist: basePrize * 2,
      semifinalist: basePrize,
      participant: Math.floor(basePrize * 0.5),
    };
  };

  const simulateAIBattle = (team1, team2) => {
    // Simulation simple basée sur les stats totales
    const calculateTeamPower = (team) => {
      return team.reduce((total, boar) => {
        if (boar.hp === 0) return total;
        return total + boar.attack + boar.defense + boar.speed + boar.hp;
      }, 0);
    };

    const power1 = calculateTeamPower(team1.team);
    const power2 = calculateTeamPower(team2.team);
    
    // Ajouter un facteur aléatoire
    const randomFactor1 = 0.8 + Math.random() * 0.4; // 0.8 à 1.2
    const randomFactor2 = 0.8 + Math.random() * 0.4;
    
    const finalPower1 = power1 * randomFactor1;
    const finalPower2 = power2 * randomFactor2;

    return finalPower1 > finalPower2 ? team1 : team2;
  };

  const processCurrentRound = () => {
    const currentBracket = tournament.brackets.find(b => b.round === tournament.currentRound);
    if (!currentBracket) return;

    const roundResults = [];
    const activeParticipants = tournament.participants.filter(p => 
      tournament.results.length === 0 || // Premier round
      tournament.results[tournament.results.length - 1].winners.includes(p.id)
    );

    currentBracket.matches.forEach((match, matchIndex) => {
      const [team1Index, team2Index] = match;
      const team1 = activeParticipants[team1Index];
      const team2 = activeParticipants[team2Index];

      if (team1?.isPlayer || team2?.isPlayer) {
        // Match impliquant le joueur - doit être joué
        setCurrentMatch({
          team1,
          team2,
          matchIndex,
          onComplete: (winner) => completeMatch(winner, team1, team2, matchIndex),
        });
        return;
      } else {
        // Match IA vs IA - simulation automatique
        const winner = simulateAIBattle(team1, team2);
        roundResults.push({
          match: matchIndex,
          team1: team1.id,
          team2: team2.id,
          winner: winner.id,
        });
      }
    });

    // Si tous les matchs sont des IA vs IA, traiter immédiatement
    if (roundResults.length === currentBracket.matches.length) {
      completeRound(roundResults);
    }
  };

  const completeMatch = (winner, team1, team2, matchIndex) => {
    const roundResults = [...(tournament.pendingResults || [])];
    roundResults.push({
      match: matchIndex,
      team1: team1.id,
      team2: team2.id,
      winner: winner.id,
    });

    const currentBracket = tournament.brackets.find(b => b.round === tournament.currentRound);
    
    if (roundResults.length === currentBracket.matches.length) {
      completeRound(roundResults);
    } else {
      setTournament(prev => ({ ...prev, pendingResults: roundResults }));
    }

    setCurrentMatch(null);
  };

  const completeRound = (roundResults) => {
    const winners = roundResults.map(result => result.winner);
    
    const newTournament = {
      ...tournament,
      results: [...tournament.results, { round: tournament.currentRound, matches: roundResults, winners }],
      currentRound: tournament.currentRound + 1,
      pendingResults: [],
    };

    // Distribuer les récompenses si le tournoi est terminé
    if (newTournament.currentRound > newTournament.brackets.length) {
      const finalResults = distributePrizes(newTournament);
      setTournament(finalResults);
      setTournamentPhase('completed');
    } else {
      setTournament(newTournament);
      // Programmer le prochain round
      setTimeout(() => processCurrentRound(), 1000);
    }
  };

  const distributePrizes = (completedTournament) => {
    const finalRound = completedTournament.results[completedTournament.results.length - 1];
    const winner = finalRound.winners[0];
    
    if (winner === 'player') {
      dispatch({ type: 'ADD_GOLD', payload: completedTournament.prizes.winner });
      dispatch({ type: 'ADD_MESSAGE', payload: `🏆 Victoire ! +${completedTournament.prizes.winner} or !` });
    }

    return completedTournament;
  };

  const renderTournamentBracket = () => {
    if (!tournament) return null;

    const activeParticipants = tournament.participants.filter(p => 
      tournament.results.length === 0 || 
      tournament.results[tournament.results.length - 1].winners.includes(p.id)
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold">
            Tournoi {tournament.size} équipes - Round {tournament.currentRound}
          </h3>
          <div className="text-gray-600 mt-2">
            🏆 Gagnant: {tournament.prizes.winner} or | 🥈 Finaliste: {tournament.prizes.finalist} or
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          {tournament.brackets.map((bracket, bracketIndex) => (
            <div key={bracket.round} className="mb-6">
              <h4 className="text-lg font-bold mb-3">
                {bracket.round === tournament.brackets.length ? 'Finale' :
                 bracket.round === tournament.brackets.length - 1 ? 'Demi-finale' :
                 `Round ${bracket.round}`}
              </h4>
              
              <div className="grid gap-3">
                {bracket.matches.map((match, matchIndex) => {
                  const [team1Index, team2Index] = match;
                  const team1 = activeParticipants[team1Index];
                  const team2 = activeParticipants[team2Index];
                  
                  const matchResult = tournament.results
                    .find(r => r.round === bracket.round)
                    ?.matches.find(m => m.match === matchIndex);

                  return (
                    <motion.div
                      key={matchIndex}
                      className={`
                        p-4 rounded-lg border-2 flex justify-between items-center
                        ${matchResult ? 'bg-green-50 border-green-300' : 
                          bracket.round === tournament.currentRound ? 'bg-blue-50 border-blue-300' :
                          'bg-gray-50 border-gray-200'}
                      `}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex-1">
                        <div className={`font-medium ${
                          matchResult?.winner === team1?.id ? 'text-green-600 font-bold' : ''
                        }`}>
                          {team1?.name} {team1?.isPlayer && '👤'}
                        </div>
                      </div>
                      
                      <div className="mx-4 text-gray-500">VS</div>
                      
                      <div className="flex-1 text-right">
                        <div className={`font-medium ${
                          matchResult?.winner === team2?.id ? 'text-green-600 font-bold' : ''
                        }`}>
                          {team2?.isPlayer && '👤'} {team2?.name}
                        </div>
                      </div>

                      {bracket.round === tournament.currentRound && 
                       (team1?.isPlayer || team2?.isPlayer) && !matchResult && (
                        <motion.button
                          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentMatch({
                            team1, team2, matchIndex,
                            onComplete: (winner) => completeMatch(winner, team1, team2, matchIndex)
                          })}
                        >
                          Jouer
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSetupScreen = () => (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">🏆 Mode Tournoi</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
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
            • Finaliste: 1600 or<br/>
            • Participation: 400 or
          </div>
          <motion.button
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => createTournament(8)}
          >
            Rejoindre (8 équipes)
          </motion.button>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-6 border-2 border-purple-200"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-bold mb-3">Tournoi 16 équipes</h3>
          <div className="text-gray-600 mb-4">
            • 4 rounds de combat<br/>
            • Gagnant: 6400 or<br/>
            • Finaliste: 3200 or<br/>
            • Participation: 800 or
          </div>
          <motion.button
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => createTournament(16)}
          >
            Rejoindre (16 équipes)
          </motion.button>
        </motion.div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
        <h4 className="font-bold text-yellow-800 mb-2">💡 Conseils</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Assurez-vous que votre équipe est en pleine forme</li>
          <li>• Les matchs sont éliminatoires - une défaite et c'est fini !</li>
          <li>• Vous gagnez de l'or même si vous perdez au premier tour</li>
          <li>• Les équipes adverses sont générées aléatoirement</li>
        </ul>
      </div>
    </div>
  );

  const renderCompletedScreen = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-6xl"
      >
        🏆
      </motion.div>
      
      <h2 className="text-3xl font-bold">Tournoi Terminé !</h2>
      
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-4">Résultats Finaux</h3>
        {/* Afficher les résultats du tournoi */}
      </div>

      <motion.button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setTournament(null);
          setTournamentPhase('setup');
        }}
      >
        Nouveau Tournoi
      </motion.button>
    </div>
  );

  // Démarrer le premier round quand le tournoi est créé
  useEffect(() => {
    if (tournament && tournamentPhase === 'active' && tournament.currentRound === 1) {
      setTimeout(() => processCurrentRound(), 1000);
    }
  }, [tournament, tournamentPhase]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {tournamentPhase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderSetupScreen()}
            </motion.div>
          )}

          {tournamentPhase === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderTournamentBracket()}
            </motion.div>
          )}

          {tournamentPhase === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderCompletedScreen()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialog de combat en cours */}
        <AnimatePresence>
          {currentMatch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-bold mb-4 text-center">
                  Match de Tournoi
                </h3>
                
                <div className="text-center space-y-4">
                  <div>
                    <div className="font-bold">{currentMatch.team1.name}</div>
                    <div className="text-gray-600">VS</div>
                    <div className="font-bold">{currentMatch.team2.name}</div>
                  </div>
                  
                  <motion.button
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTournamentPhase('battle')}
                  >
                    Commencer le Combat !
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
