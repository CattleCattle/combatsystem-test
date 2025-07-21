import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext.js';

export function SimpleSwordFightTest() {
  const { gameState, dispatch } = useGameContext();
  const [testState, setTestState] = useState({
    engineLoaded: false,
    error: null,
    logs: []
  });

  const addLog = (message) => {
    setTestState(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()}: ${message}`]
    }));
  };

  useEffect(() => {
    testSwordFightEngine();
  }, []);

  const testSwordFightEngine = async () => {
    try {
      addLog('🧪 Test de SwordFight Engine...');
      
      // Test d'import de base
      const SwordFight = await import('swordfight-engine');
      addLog('✅ Import de swordfight-engine réussi');
      
      // Vérifier les exports
      console.log('SwordFight exports:', SwordFight);
      addLog(`📦 Exports disponibles: ${Object.keys(SwordFight).join(', ')}`);
      
      setTestState(prev => ({
        ...prev,
        engineLoaded: true
      }));
      
    } catch (error) {
      console.error('❌ Erreur lors du test SwordFight:', error);
      addLog(`❌ Erreur: ${error.message}`);
      setTestState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  const createTestEnemy = () => {
    const testEnemy = {
      id: 999,
      name: "Sanglier de Test",
      hp: 100,
      maxHp: 100,
      attack: 25,
      defense: 15,
      speed: 20,
      moves: [
        { name: "Attaque Test", damage: 30, type: "physique" },
        { name: "Défense Test", damage: 20, type: "physique" }
      ]
    };
    
    dispatch({ type: 'SET_ENEMY_BOAR', payload: testEnemy });
    addLog(`🐗 Ennemi de test créé: ${testEnemy.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
          🧪 Test SwordFight Engine
        </h1>

        {/* État de l'équipe */}
        <div className="bg-blue-900 border-2 border-blue-400 rounded-lg p-6 mb-6">
          <h2 className="text-blue-200 font-bold text-xl mb-4">📊 État du Jeu</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-blue-300 font-bold mb-2">Équipe de Sangliers:</h3>
              {gameState.playerTeam && gameState.playerTeam.length > 0 ? (
                gameState.playerTeam.map(boar => (
                  <div key={boar.id} className="bg-blue-800 p-2 rounded mb-2">
                    <div className="text-yellow-200 font-bold">{boar.name}</div>
                    <div className="text-blue-200 text-sm">PV: {boar.hp}/{boar.maxHp}</div>
                  </div>
                ))
              ) : (
                <div className="text-red-400">❌ Aucune équipe chargée</div>
              )}
            </div>
            
            <div>
              <h3 className="text-blue-300 font-bold mb-2">Ennemi:</h3>
              {gameState.enemyBoar ? (
                <div className="bg-red-800 p-2 rounded">
                  <div className="text-yellow-200 font-bold">{gameState.enemyBoar.name}</div>
                  <div className="text-red-200 text-sm">PV: {gameState.enemyBoar.hp}/{gameState.enemyBoar.maxHp}</div>
                </div>
              ) : (
                <div className="text-yellow-400">⚠️ Aucun ennemi défini</div>
              )}
            </div>
          </div>
        </div>

        {/* Test Engine */}
        <div className="bg-green-900 border-2 border-green-400 rounded-lg p-6 mb-6">
          <h2 className="text-green-200 font-bold text-xl mb-4">⚔️ Test SwordFight Engine</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className={`px-4 py-2 rounded ${testState.engineLoaded ? 'bg-green-700' : 'bg-gray-700'}`}>
              {testState.engineLoaded ? '✅ Engine Chargé' : '⏳ Chargement...'}
            </div>
            
            {testState.error && (
              <div className="px-4 py-2 bg-red-700 rounded">
                ❌ Erreur: {testState.error}
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={testSwordFightEngine}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              🔄 Retester Engine
            </button>
            
            <button
              onClick={createTestEnemy}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
            >
              🐗 Créer Ennemi Test
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-6 mb-6">
          <h2 className="text-gray-200 font-bold text-xl mb-4">🧭 Navigation</h2>
          
          <div className="flex gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_GAME_STATE', payload: 'menu' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              🏠 Menu Principal
            </button>
            
            <button
              onClick={() => dispatch({ type: 'SET_GAME_STATE', payload: 'swordfightBattle' })}
              disabled={!testState.engineLoaded || !gameState.playerTeam}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              ⚔️ Combat SwordFight
            </button>
          </div>
        </div>

        {/* Log de test */}
        <div className="bg-black border-2 border-gray-600 rounded-lg p-6">
          <h2 className="text-gray-200 font-bold text-xl mb-4">📜 Log de Test</h2>
          
          <div className="bg-gray-900 p-4 rounded h-64 overflow-y-auto">
            {testState.logs.length > 0 ? (
              testState.logs.map((log, index) => (
                <div key={index} className="text-green-400 font-mono text-sm mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">Aucun log pour le moment</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
