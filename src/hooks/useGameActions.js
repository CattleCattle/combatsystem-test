import { useCallback } from 'react';
import { useGameContext } from '../contexts/GameContext.js';
import { GAME_STATES, INITIAL_PLAYER_TEAM } from '../constants/gameData.js';
import {
  generateEnemy,
  generatePathOptions,
  generateUpgradeOptions,
  calculateDamage,
  applyUpgradeToBoar,
  applyMysteryEvent,
  applyTreasureReward,
} from '../utils/gameLogic.js';

export function useGameActions() {
  const { gameState, dispatch, actions } = useGameContext();
  const { currentFloor, playerTeam, enemyBoar } = gameState;

  const startGame = useCallback(() => {
    dispatch({ type: actions.START_GAME });
    dispatch({ type: actions.SET_PATH_OPTIONS, payload: generatePathOptions(1) });
    dispatch({ type: actions.SET_GAME_STATE, payload: GAME_STATES.PATH_CHOICE });
  }, [dispatch, actions]);

  const resetGame = useCallback(() => {
    dispatch({ type: actions.RESET_GAME });
  }, [dispatch, actions]);

  const proceedToNextFloor = useCallback(() => {
    const newFloor = currentFloor + 1;
    dispatch({ type: actions.SET_CURRENT_FLOOR, payload: newFloor });
    dispatch({ type: actions.SET_GAME_STATE, payload: GAME_STATES.PATH_CHOICE });
    dispatch({ type: actions.SET_PATH_OPTIONS, payload: generatePathOptions(newFloor) });
  }, [dispatch, actions, currentFloor]);

  const choosePath = useCallback((path) => {
    switch (path.type) {
      case "combat":
      case "elite":
      case "boss":
        const enemy = generateEnemy(currentFloor, path.difficulty);
        dispatch({ type: actions.SET_ENEMY_BOAR, payload: enemy });
        dispatch({ type: actions.SET_GAME_STATE, payload: GAME_STATES.SWORDFIGHT_BATTLE });
        dispatch({ type: actions.SET_BATTLE_LOG, payload: [`Étage ${currentFloor} - ${path.name} !`] });
        dispatch({ type: actions.SET_IS_PLAYER_TURN, payload: true });
        dispatch({ type: actions.SET_SELECTED_BOAR, payload: null });
        break;

      case "healing":
        const healedTeam = playerTeam.map((boar) => ({
          ...boar,
          hp: Math.min(boar.maxHp, Math.floor(boar.hp + boar.maxHp * 0.5)),
        }));
        dispatch({ type: actions.SET_PLAYER_TEAM, payload: healedTeam });
        dispatch({ 
          type: actions.SET_EVENT_MODAL, 
          payload: {
            isVisible: true,
            title: 'Source de Guérison Trouvée !',
            message: 'Votre équipe trouve une source magique ! Tous vos sangliers récupèrent 50% de leurs PV.',
            type: 'healing'
          }
        });
        break;

      case "treasure":
        const { newTeam: treasureTeam, message: treasureMessage } = applyTreasureReward(playerTeam);
        dispatch({ type: actions.SET_PLAYER_TEAM, payload: treasureTeam });
        dispatch({ 
          type: actions.SET_EVENT_MODAL, 
          payload: {
            isVisible: true,
            title: 'Trésor Découvert !',
            message: treasureMessage,
            type: 'treasure'
          }
        });
        break;

      case "mystery":
        const { newTeam: mysteryTeam, message: mysteryMessage } = applyMysteryEvent(playerTeam);
        dispatch({ type: actions.SET_PLAYER_TEAM, payload: mysteryTeam });
        dispatch({ 
          type: actions.SET_EVENT_MODAL, 
          payload: {
            isVisible: true,
            title: 'Événement Mystérieux !',
            message: mysteryMessage,
            type: 'mystery'
          }
        });
        break;
    }
  }, [dispatch, actions, currentFloor, playerTeam, proceedToNextFloor]);

  const proceedToUpgrade = useCallback(() => {
    dispatch({ type: actions.SET_UPGRADE_OPTIONS, payload: generateUpgradeOptions() });
    dispatch({ type: actions.SET_UPGRADE_TARGET, payload: null });
    dispatch({ type: actions.SET_GAME_STATE, payload: GAME_STATES.UPGRADE });
  }, [dispatch, actions]);

  const applyUpgrade = useCallback((upgrade, upgradeTarget) => {
    if (upgrade.type === "revive") {
      const koMember = playerTeam.find((boar) => boar.hp === 0);
      if (koMember) {
        const revivedTeam = playerTeam.map((boar) =>
          boar.id === koMember.id
            ? { ...boar, hp: Math.floor(boar.maxHp * upgrade.value) }
            : boar
        );
        dispatch({ type: actions.SET_PLAYER_TEAM, payload: revivedTeam });
      }
    } else if (upgradeTarget) {
      const upgradedBoar = applyUpgradeToBoar(upgradeTarget, upgrade);
      const upgradedTeam = playerTeam.map((boar) =>
        boar.id === upgradeTarget.id ? upgradedBoar : boar
      );
      dispatch({ type: actions.SET_PLAYER_TEAM, payload: upgradedTeam });
    }

    proceedToNextFloor();
  }, [dispatch, actions, playerTeam, proceedToNextFloor]);

  return {
    startGame,
    resetGame,
    proceedToNextFloor,
    choosePath,
    proceedToUpgrade,
    applyUpgrade,
  };
}

export function useBattleActions() {
  const {
    gameState,
    dispatch,
    actions,
  } = useGameContext();
  
  const {
    isPlayerTurn,
    selectedBoar,
    enemyBoar,
    playerTeam,
    currentBoarIndex,
  } = gameState;

  const executeMove = useCallback((attacker, defender, move, isPlayer) => {
    if (move.heal) {
      const healAmount = move.heal;
      if (isPlayer) {
        dispatch({
          type: actions.UPDATE_BOAR,
          payload: {
            id: attacker.id,
            updates: { hp: Math.min(attacker.maxHp, attacker.hp + healAmount) }
          }
        });
        dispatch({ type: actions.ADD_BATTLE_LOG, payload: `${attacker.name} récupère ${healAmount} PV !` });
      }
      setTimeout(() => {
        dispatch({ type: actions.SET_IS_PLAYER_TURN, payload: !isPlayer });
        dispatch({ type: actions.SET_SELECTED_BOAR, payload: null });
      }, 1000);
      return;
    }

    if (move.healTeam) {
      const healAmount = move.healTeam;
      if (isPlayer) {
        const healedTeam = playerTeam.map((boar) => ({
          ...boar,
          hp: Math.min(boar.maxHp, boar.hp + healAmount),
        }));
        dispatch({ type: actions.SET_PLAYER_TEAM, payload: healedTeam });
        dispatch({ type: actions.ADD_BATTLE_LOG, payload: `${attacker.name} soigne toute l'équipe de ${healAmount} PV !` });
      }
      setTimeout(() => {
        dispatch({ type: actions.SET_IS_PLAYER_TURN, payload: !isPlayer });
        dispatch({ type: actions.SET_SELECTED_BOAR, payload: null });
      }, 1000);
      return;
    }

    const damage = calculateDamage(attacker, defender, move);
    const newDefenderHp = Math.max(0, defender.hp - damage);

    dispatch({ type: actions.ADD_BATTLE_LOG, payload: `${attacker.name} utilise ${move.name} !` });

    setTimeout(() => {
      dispatch({ type: actions.ADD_BATTLE_LOG, payload: `${defender.name} perd ${damage} PV !` });

      if (isPlayer) {
        dispatch({ type: actions.SET_ENEMY_BOAR, payload: { ...enemyBoar, hp: newDefenderHp } });
      } else {
        dispatch({
          type: actions.UPDATE_BOAR,
          payload: {
            id: defender.id,
            updates: { hp: newDefenderHp }
          }
        });
      }

      if (move.recoil && isPlayer) {
        const recoilDamage = Math.floor(damage * 0.25);
        dispatch({
          type: actions.UPDATE_BOAR,
          payload: {
            id: attacker.id,
            updates: { hp: Math.max(0, attacker.hp - recoilDamage) }
          }
        });
        dispatch({ type: actions.ADD_BATTLE_LOG, payload: `${attacker.name} subit ${recoilDamage} PV de recul !` });
      }

      if (newDefenderHp <= 0) {
        setTimeout(() => {
          if (isPlayer) {
            // Victoire du joueur
            dispatch({ type: actions.SET_GAME_STATE, payload: GAME_STATES.VICTORY });
          } else {
            const updatedTeam = playerTeam.map((boar) =>
              boar.id === defender.id ? { ...boar, hp: 0 } : boar
            );
            dispatch({ type: actions.SET_PLAYER_TEAM, payload: updatedTeam });
            
            const aliveMembers = updatedTeam.filter((boar) => boar.hp > 0);
            if (aliveMembers.length === 0) {
              setTimeout(() => dispatch({ type: actions.SET_GAME_STATE, payload: GAME_STATES.GAME_OVER }), 500);
            }
          }
        }, 1000);
      } else {
        setTimeout(() => {
          dispatch({ type: actions.SET_IS_PLAYER_TURN, payload: !isPlayer });
          dispatch({ type: actions.SET_SELECTED_BOAR, payload: null });
        }, 1000);
      }
    }, 1000);
  }, [dispatch, actions, enemyBoar, playerTeam]);

  const playerAttack = useCallback((move) => {
    if (!isPlayerTurn || !selectedBoar) return;
    executeMove(selectedBoar, enemyBoar, move, true);

    // Passer au sanglier suivant pour le prochain tour
    dispatch({ type: actions.SET_CURRENT_BOAR_INDEX, payload: currentBoarIndex + 1 });
    dispatch({ type: actions.SET_IS_PLAYER_TURN, payload: false });
  }, [dispatch, actions, isPlayerTurn, selectedBoar, enemyBoar, currentBoarIndex, executeMove]);

  const enemyAttack = useCallback(() => {
    const aliveTeamMembers = playerTeam.filter((boar) => boar.hp > 0);
    if (aliveTeamMembers.length === 0) return;

    const randomTarget = aliveTeamMembers[Math.floor(Math.random() * aliveTeamMembers.length)];
    const randomMove = enemyBoar.moves[Math.floor(Math.random() * enemyBoar.moves.length)];
    executeMove(enemyBoar, randomTarget, randomMove, false);
  }, [enemyBoar, playerTeam, executeMove]);

  return {
    executeMove,
  };
}
