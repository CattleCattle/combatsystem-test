import { ENEMY_TYPES, PATH_TYPES, UPGRADE_OPTIONS, NEW_MOVES, MYSTERY_EVENTS } from '../constants/gameData.js';

/**
 * Calcule le pourcentage de PV restants
 */
export const getHpPercentage = (hp, maxHp) => (hp / maxHp) * 100;

/**
 * Génère un ennemi basé sur l'étage et le multiplicateur de difficulté
 */
export const generateEnemy = (currentFloor, difficultyMultiplier = 1.0) => {
  const enemyTemplate = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
  const floorMultiplier = 1 + (currentFloor - 1) * 0.4;
  const totalMultiplier = floorMultiplier * difficultyMultiplier;

  return {
    name: `${enemyTemplate.name} (Étage ${currentFloor})`,
    hp: Math.floor(enemyTemplate.baseHp * totalMultiplier * 1.8),
    maxHp: Math.floor(enemyTemplate.baseHp * totalMultiplier * 1.8),
    attack: Math.floor(enemyTemplate.baseAttack * totalMultiplier),
    defense: Math.floor(enemyTemplate.baseDefense * totalMultiplier),
    speed: Math.floor(enemyTemplate.baseSpeed * totalMultiplier),
    moves: enemyTemplate.moves.map((move) => ({
      ...move,
      damage: Math.floor(move.damage * totalMultiplier),
    })),
  };
};

/**
 * Génère les options de chemin pour l'étage actuel
 */
export const generatePathOptions = (currentFloor) => {
  const availablePaths = [...PATH_TYPES];

  // Boss tous les 5 étages
  if (currentFloor % 5 === 0) {
    return [availablePaths.find((p) => p.type === "boss")];
  }

  // Mélanger et prendre 3 options aléatoires
  const shuffled = availablePaths
    .filter((p) => p.type !== "boss")
    .sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

/**
 * Génère 3 options d'amélioration aléatoires
 */
export const generateUpgradeOptions = () => {
  const shuffled = [...UPGRADE_OPTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

/**
 * Calcule les dégâts d'une attaque
 */
export const calculateDamage = (attacker, defender, move) => {
  const baseDamage = move.damage;
  const attackStat = attacker.attack;
  const defenseStat = defender.defense;

  const damage = Math.floor(
    ((baseDamage * attackStat) / defenseStat) * (0.8 + Math.random() * 0.4)
  );
  return Math.max(1, damage);
};

/**
 * Applique une amélioration à un sanglier
 */
export const applyUpgradeToBoar = (boar, upgrade) => {
  let newBoar = { ...boar };

  switch (upgrade.type) {
    case "hp":
      newBoar.maxHp += upgrade.value;
      newBoar.hp += upgrade.value;
      break;
    case "attack":
      newBoar.attack += upgrade.value;
      break;
    case "defense":
      newBoar.defense += upgrade.value;
      break;
    case "speed":
      newBoar.speed += upgrade.value;
      break;
    case "heal":
      newBoar.hp = Math.min(
        newBoar.maxHp,
        Math.floor(newBoar.hp + newBoar.maxHp * upgrade.value)
      );
      break;
    case "move_upgrade":
      newBoar.moves = newBoar.moves.map((move) => ({
        ...move,
        damage: move.damage + upgrade.value,
      }));
      break;
    case "new_move":
      const availableMoves = NEW_MOVES.filter(
        (move) =>
          !newBoar.moves.some((existing) => existing.name === move.name)
      );
      if (availableMoves.length > 0) {
        const randomNewMove =
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
        if (newBoar.moves.length < 6) {
          newBoar.moves.push(randomNewMove);
        } else {
          newBoar.moves[Math.floor(Math.random() * newBoar.moves.length)] =
            randomNewMove;
        }
      }
      break;
  }

  return newBoar;
};

/**
 * Applique un événement mystère à l'équipe
 */
export const applyMysteryEvent = (playerTeam) => {
  const randomEvent = MYSTERY_EVENTS[Math.floor(Math.random() * MYSTERY_EVENTS.length)];
  
  let newTeam = [...playerTeam];
  
  switch (randomEvent.effect) {
    case "heal_all_15":
      newTeam = newTeam.map((boar) => ({
        ...boar,
        hp: Math.min(boar.maxHp, boar.hp + 15),
      }));
      break;
    case "damage_all_10":
      newTeam = newTeam.map((boar) => ({
        ...boar,
        hp: Math.max(1, boar.hp - 10),
      }));
      break;
    case "buff_attack_3":
      newTeam = newTeam.map((boar) => ({
        ...boar,
        attack: boar.attack + 3,
      }));
      break;
    case "none":
    default:
      // Pas d'effet
      break;
  }

  return { newTeam, message: randomEvent.message };
};

/**
 * Applique un trésor aléatoire à un membre de l'équipe
 */
export const applyTreasureReward = (playerTeam) => {
  const aliveMember = playerTeam.find((boar) => boar.hp > 0);
  if (!aliveMember) return { newTeam: playerTeam, message: "Aucun survivant pour récupérer le trésor..." };

  const treasureUpgrades = [
    { type: "attack", value: 8, name: "Attaque" },
    { type: "defense", value: 8, name: "Défense" },
    { type: "hp", value: 30, name: "PV" },
    { type: "speed", value: 8, name: "Vitesse" },
  ];
  
  const randomUpgrade = treasureUpgrades[Math.floor(Math.random() * treasureUpgrades.length)];

  const newTeam = playerTeam.map((boar) => {
    if (boar.id !== aliveMember.id) return boar;
    
    let newBoar = { ...boar };
    switch (randomUpgrade.type) {
      case "hp":
        newBoar.maxHp += randomUpgrade.value;
        newBoar.hp += randomUpgrade.value;
        break;
      case "attack":
        newBoar.attack += randomUpgrade.value;
        break;
      case "defense":
        newBoar.defense += randomUpgrade.value;
        break;
      case "speed":
        newBoar.speed += randomUpgrade.value;
        break;
    }
    return newBoar;
  });

  const message = `${aliveMember.name} trouve un trésor et gagne +${randomUpgrade.value} ${randomUpgrade.name} !`;
  
  return { newTeam, message };
};
