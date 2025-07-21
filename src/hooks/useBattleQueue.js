// Fichier supprimé : ancien hook de gestion de file de combat, remplacé par SwordFight
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer la file d'attente de combat basée sur la vitesse
 * Système simple et efficace avec logs pour debug
 */
export function useBattleQueue(playerTeam, enemyBoar, isActive) {
  const [battleQueue, setBattleQueue] = useState([]);
  const [actionBars, setActionBars] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser la file d'attaque
  const initializeBattleQueue = useCallback(() => {
    if (!playerTeam || !enemyBoar || playerTeam.length === 0) {
      console.log('Cannot initialize: missing data');
      return;
    }

    const alivePlayers = playerTeam.filter(boar => boar.hp > 0);
    const allCombatants = [
      ...alivePlayers.map(boar => ({
        ...boar,
        type: 'player',
        uniqueId: `player_${boar.id}`
      })),
      {
        ...enemyBoar,
        type: 'enemy',
        uniqueId: `enemy_${enemyBoar.id}`
      }
    ];

    setBattleQueue(allCombatants);

    // Initialiser les barres d'action avec des valeurs aléatoires pour éviter les conflicts
    const initialBars = {};
    allCombatants.forEach((combatant, index) => {
      initialBars[combatant.uniqueId] = {
        progress: Math.random() * 20, // Petit démarrage aléatoire
        ready: false,
        speed: combatant.speed,
        id: combatant.id,
        type: combatant.type
      };
    });
    setActionBars(initialBars);
    setIsInitialized(true);

    console.log('Battle queue initialized with:', allCombatants.map(c => `${c.type}_${c.id}`));
  }, [playerTeam, enemyBoar]);

  // Mettre à jour les barres d'action
  useEffect(() => {
    if (!isActive || !isInitialized) return;

    const interval = setInterval(() => {
      setActionBars(prev => {
        const newBars = { ...prev };
        let hasChanges = false;

        Object.keys(newBars).forEach(key => {
          const bar = newBars[key];
          if (!bar.ready) {
            // Vitesse influence le remplissage
            const increment = (bar.speed * 0.8) + 2;
            newBars[key] = {
              ...bar,
              progress: Math.min(100, bar.progress + increment)
            };
            
            if (newBars[key].progress >= 100) {
              newBars[key].ready = true;
              console.log(`${key} is ready to act!`);
            }
            hasChanges = true;
          }
        });

        return hasChanges ? newBars : prev;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isActive, isInitialized]);

  // Obtenir le prochain combattant prêt
  const getNextReadyCombatant = useCallback(() => {
    const readyKeys = Object.keys(actionBars).filter(key => actionBars[key].ready);
    
    if (readyKeys.length === 0) return null;

    // Prendre le premier prêt
    const readyKey = readyKeys[0];
    const bar = actionBars[readyKey];
    
    const combatant = battleQueue.find(c => 
      c.uniqueId === readyKey && c.hp > 0
    );

    if (combatant) {
      console.log('Next combatant:', combatant.name, combatant.type);
    }
    
    return combatant;
  }, [actionBars, battleQueue]);

  // Marquer un combattant comme ayant agi
  const markCombatantActed = useCallback((combatant) => {
    const key = combatant.uniqueId;
    console.log('Marking as acted:', key);
    
    setActionBars(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        progress: 0,
        ready: false
      }
    }));
  }, []);

  // Mettre à jour la file après une mort
  const updateQueueAfterDeath = useCallback((deadCombatantId, deadCombatantType) => {
    const deadKey = `${deadCombatantType}_${deadCombatantId}`;
    console.log('Removing dead combatant:', deadKey);
    
    setBattleQueue(prev => prev.filter(c => c.uniqueId !== deadKey));
    
    setActionBars(prev => {
      const newBars = { ...prev };
      delete newBars[deadKey];
      return newBars;
    });
  }, []);

  // Obtenir l'ordre d'action pour l'affichage
  const getActionOrder = useCallback(() => {
    return Object.entries(actionBars)
      .map(([key, bar]) => {
        const combatant = battleQueue.find(c => c.uniqueId === key && c.hp > 0);
        return combatant ? { ...combatant, actionBar: bar } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.actionBar.progress - a.actionBar.progress);
  }, [actionBars, battleQueue]);

  return {
    battleQueue,
    actionBars,
    isInitialized,
    initializeBattleQueue,
    getNextReadyCombatant,
    markCombatantActed,
    updateQueueAfterDeath,
    getActionOrder
  };
}
