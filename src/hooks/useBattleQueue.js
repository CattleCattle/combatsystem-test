import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer la file d'attente de combat basée sur la vitesse
 * Inspiré du système de FF7 avec une barre d'action visible
 */
export function useBattleQueue(playerTeam, enemyBoar, isActive) {
  const [battleQueue, setBattleQueue] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [actionBars, setActionBars] = useState({});

  // Initialiser la file d'attente basée sur la vitesse
  const initializeBattleQueue = useCallback(() => {
    if (!playerTeam || !enemyBoar) return;

    const allCombatants = [
      ...playerTeam.filter(boar => boar.hp > 0).map(boar => ({
        ...boar,
        type: 'player',
        actionTime: 0
      })),
      {
        ...enemyBoar,
        type: 'enemy',
        actionTime: 0
      }
    ];

    // Trier par vitesse (plus rapide = moins de temps entre les actions)
    allCombatants.sort((a, b) => b.speed - a.speed);

    setBattleQueue(allCombatants);
    setCurrentTurn(0);

    // Initialiser les barres d'action
    const initialBars = {};
    allCombatants.forEach(combatant => {
      initialBars[`${combatant.type}_${combatant.id}`] = {
        progress: 0,
        ready: false,
        speed: combatant.speed
      };
    });
    setActionBars(initialBars);
  }, [playerTeam, enemyBoar]);

  // Mettre à jour les barres d'action
  useEffect(() => {
    if (!isActive || battleQueue.length === 0) return;

    const interval = setInterval(() => {
      setActionBars(prev => {
        const newBars = { ...prev };
        let hasChanges = false;

        battleQueue.forEach(combatant => {
          const key = `${combatant.type}_${combatant.id}`;
          if (newBars[key] && !newBars[key].ready && combatant.hp > 0) {
            // La vitesse détermine la rapidité de remplissage de la barre
            const increment = combatant.speed / 10;
            newBars[key].progress = Math.min(100, newBars[key].progress + increment);
            
            if (newBars[key].progress >= 100) {
              newBars[key].ready = true;
            }
            hasChanges = true;
          }
        });

        return hasChanges ? newBars : prev;
      });
    }, 100); // Mise à jour toutes les 100ms

    return () => clearInterval(interval);
  }, [isActive, battleQueue]);

  // Obtenir le prochain combattant prêt
  const getNextReadyCombatant = useCallback(() => {
    const readyKey = Object.keys(actionBars).find(key => 
      actionBars[key].ready && 
      battleQueue.find(c => `${c.type}_${c.id}` === key && c.hp > 0)
    );

    if (readyKey) {
      return battleQueue.find(c => `${c.type}_${c.id}` === readyKey);
    }
    return null;
  }, [actionBars, battleQueue]);

  // Marquer un combattant comme ayant agi
  const markCombatantActed = useCallback((combatant) => {
    const key = `${combatant.type}_${combatant.id}`;
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
    setBattleQueue(prev => prev.filter(c => 
      !(c.id === deadCombatantId && c.type === deadCombatantType)
    ));
    
    const key = `${deadCombatantType}_${deadCombatantId}`;
    setActionBars(prev => {
      const newBars = { ...prev };
      delete newBars[key];
      return newBars;
    });
  }, []);

  // Obtenir l'ordre d'action prévu (pour l'affichage)
  const getActionOrder = useCallback(() => {
    return Object.entries(actionBars)
      .filter(([key, bar]) => {
        const combatant = battleQueue.find(c => `${c.type}_${c.id}` === key);
        return combatant && combatant.hp > 0;
      })
      .sort(([, a], [, b]) => b.progress - a.progress)
      .map(([key]) => {
        const combatant = battleQueue.find(c => `${c.type}_${c.id}` === key);
        return combatant;
      })
      .filter(Boolean);
  }, [actionBars, battleQueue]);

  return {
    battleQueue,
    actionBars,
    currentTurn,
    initializeBattleQueue,
    getNextReadyCombatant,
    markCombatantActed,
    updateQueueAfterDeath,
    getActionOrder
  };
}
