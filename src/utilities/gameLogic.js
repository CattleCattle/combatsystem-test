import MINI_BOSSES from '../constants/miniBosses';
import BOSSES from '../constants/bosses';
// Équipe initiale du joueur
export const INITIAL_PLAYER_TEAM = [
  {
    id: 1,
    name: "Sanglier Alpha",
    hp: 100,
    maxHp: 100,
    attack: 25,
    defense: 15,
    speed: 20,
    moves: [
      { name: "Charge Brutale", damage: 30, type: "physique" },
      { name: "Défenses de Fer", damage: 20, type: "physique", effect: "defense" },
      { name: "Grognement", damage: 15, type: "intimidation" },
    ],
  },
  {
    id: 2,
    name: "Sanglier Guerrier",
    hp: 80,
    maxHp: 80,
    attack: 30,
    defense: 12,
    speed: 25,
    moves: [
      { name: "Attaque Sauvage", damage: 35, type: "physique" },
      { name: "Rage", damage: 25, type: "physique", effect: "berserker" },
      { name: "Coup Puissant", damage: 40, type: "physique", recoil: true },
    ],
  },
  {
    id: 3,
    name: "Sanglier Soigneur",
    hp: 70,
    maxHp: 70,
    attack: 18,
    defense: 20,
    speed: 15,
    moves: [
      { name: "Soin Naturel", damage: 0, type: "heal", heal: 25 },
      { name: "Charge Défensive", damage: 20, type: "physique", effect: "defense" },
      { name: "Guérison de Groupe", damage: 0, type: "heal", heal: 15, target: "all" },
    ],
  }
];

// États du jeu
export const GAME_STATES = {
  MENU: 'MENU',
  PATH_CHOICE: 'PATH_CHOICE',
  BATTLE: 'BATTLE',
  UPGRADE: 'UPGRADE',
  VICTORY: 'VICTORY',
  GAME_OVER: 'GAME_OVER',
  INVENTORY: 'INVENTORY',
  BOAR_EDITOR: 'BOAR_EDITOR',
  TOURNAMENT: 'TOURNAMENT',
};

// Génération de chemins aléatoires
export function generatePathOptions(floor) {
  // Si étage boss/mini-boss, ne proposer qu'un chemin boss
  if (floor % 5 === 0) {
    return [
      {
        id: 1,
        name: floor % 10 === 0 ? 'BOSS FINAL' : 'Mini-Boss',
        type: 'boss',
        difficulty: floor % 10 === 0 ? 2 : 1.5,
        description: floor % 10 === 0 ? 'Affrontez un boss légendaire !' : 'Un mini-boss redoutable vous attend.'
      }
    ];
  }

  // Sinon, génération normale
  const pathTypes = ['battle', 'boss', 'healing', 'treasure', 'mystery'];
  const paths = [
    {
      id: 1,
      name: 'Combat Classique',
      type: 'battle',
      difficulty: Math.max(1, floor),
      description: 'Un combat contre des ennemis standards.'
    }
  ];
  const additionalPaths = Math.floor(Math.random() * 2) + 2;
  for (let i = 2; i <= additionalPaths; i++) {
    const randomType = pathTypes[Math.floor(Math.random() * pathTypes.length)];
    const path = {
      id: i,
      type: randomType,
      difficulty: Math.max(1, floor + Math.floor(Math.random() * 2) - 1),
    };
    switch (randomType) {
      case 'battle':
        path.name = 'Combat Dangereux';
        path.description = 'Un combat plus difficile mais avec plus de récompenses.';
        break;
      case 'boss':
        path.name = 'Boss Redoutable';
        path.description = 'Un boss puissant qui vous défiera !';
        break;
      case 'healing':
        path.name = 'Source de Guérison';
        path.description = 'Récupérez vos points de vie.';
        break;
      case 'treasure':
        path.name = 'Coffre au Trésor';
        path.description = 'Trouvez des objets précieux ou améliorez vos sangliers.';
        break;
      case 'mystery':
        path.name = 'Événement Mystérieux';
        path.description = 'Quelque chose d\'imprévisible vous attend...';
        break;
    }
    paths.push(path);
  }
  return paths;
}

// Génération d'ennemis
export function generateEnemy(floor, difficulty = 1) {

  // Si étage boss/mini-boss, piocher dans le pool dédié
  if (floor % 10 === 0) {
    const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    const scaling = 2;
    return {
      id: Date.now(),
      name: boss.name,
      hp: Math.floor(boss.baseHp * scaling),
      maxHp: Math.floor(boss.baseHp * scaling),
      attack: Math.floor(boss.baseAttack * scaling),
      defense: Math.floor(boss.baseDefense * scaling),
      speed: boss.baseSpeed,
      moves: boss.moves,
      isBoss: true,
      bossTier: 'boss',
    };
  } else if (floor % 5 === 0) {
    const miniBoss = MINI_BOSSES[Math.floor(Math.random() * MINI_BOSSES.length)];
    const scaling = 1.5;
    return {
      id: Date.now(),
      name: miniBoss.name,
      hp: Math.floor(miniBoss.baseHp * scaling),
      maxHp: Math.floor(miniBoss.baseHp * scaling),
      attack: Math.floor(miniBoss.baseAttack * scaling),
      defense: Math.floor(miniBoss.baseDefense * scaling),
      speed: miniBoss.baseSpeed,
      moves: miniBoss.moves,
      isBoss: true,
      bossTier: 'mini-boss',
    };
  }

  // Sinon, génération normale
  const enemyTypes = [
    { name: "Gobelin Sauvage", baseHp: 40, baseAttack: 15, baseDefense: 8 },
    { name: "Orc Brutal", baseHp: 60, baseAttack: 20, baseDefense: 12 },
    { name: "Troll des Cavernes", baseHp: 80, baseAttack: 25, baseDefense: 15 },
    { name: "Dragon Mineur", baseHp: 120, baseAttack: 35, baseDefense: 20 },
  ];
  const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  const scaling = 1 + (floor - 1) * 0.2 + (difficulty - 1) * 0.1;
  return {
    id: Date.now(),
    name: randomType.name,
    hp: Math.floor(randomType.baseHp * scaling),
    maxHp: Math.floor(randomType.baseHp * scaling),
    attack: Math.floor(randomType.baseAttack * scaling),
    defense: Math.floor(randomType.baseDefense * scaling),
    speed: 10 + Math.floor(Math.random() * 15),
    moves: [
      { name: "Attaque Basique", damage: Math.floor(20 * scaling), type: "physique" },
      { name: "Attaque Puissante", damage: Math.floor(30 * scaling), type: "physique" },
    ],
  };
}

// Calculs de combat
export function calculateDamage(attacker, defender, move) {
  const baseDamage = move.damage || attacker.attack;
  const defense = defender.defense || 0;
  const randomFactor = 0.8 + Math.random() * 0.4; // 80% à 120%
  
  const damage = Math.max(1, Math.floor((baseDamage - defense * 0.5) * randomFactor));
  
  return damage;
}

// Récompenses de trésor
export function applyTreasureReward(playerTeam) {
  const rewardTypes = ['hp', 'attack', 'defense', 'gold'];
  const rewardType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
  
  const newTeam = playerTeam.map(boar => ({ ...boar }));
  let message = "";

  switch (rewardType) {
    case 'hp':
      newTeam.forEach(boar => {
        boar.hp = Math.min(boar.maxHp, boar.hp + 20);
        boar.maxHp += 5;
      });
      message = "🍃 Votre équipe a trouvé des herbes médicinales ! +20 HP et +5 HP max pour tous !";
      break;
    case 'attack':
      newTeam.forEach(boar => {
        boar.attack += 3;
      });
      message = "⚔️ Vous avez trouvé des armes enchantées ! +3 ATT pour tous !";
      break;
    case 'defense':
      newTeam.forEach(boar => {
        boar.defense += 2;
      });
      message = "🛡️ Vous avez trouvé des armures renforcées ! +2 DEF pour tous !";
      break;
    case 'gold':
      message = "💰 Vous avez trouvé un coffre rempli d'or ! +500 pièces !";
      break;
  }

  return { newTeam, message };
}

// Événements mystérieux
export function applyMysteryEvent(playerTeam) {
  const events = ['curse', 'blessing', 'transformation', 'nothing'];
  const event = events[Math.floor(Math.random() * events.length)];
  
  const newTeam = playerTeam.map(boar => ({ ...boar }));
  let message = "";

  switch (event) {
    case 'curse':
      newTeam.forEach(boar => {
        boar.attack = Math.max(1, boar.attack - 2);
      });
      message = "😈 Une malédiction frappe votre équipe ! -2 ATT pour tous...";
      break;
    case 'blessing':
      newTeam.forEach(boar => {
        boar.speed += 5;
      });
      message = "✨ Une bénédiction divine ! +5 VIT pour tous !";
      break;
    case 'transformation':
      if (newTeam.length > 0) {
        const randomBoar = newTeam[Math.floor(Math.random() * newTeam.length)];
        randomBoar.attack += 10;
        randomBoar.hp = Math.max(1, randomBoar.hp - 10);
        message = `🔮 ${randomBoar.name} a été transformé ! +10 ATT mais -10 HP !`;
      }
      break;
    case 'nothing':
      message = "🌫️ Rien ne se passe... Vous continuez votre chemin.";
      break;
  }

  return { newTeam, message };
}

// Application de soins
export function applyHealing(playerTeam) {
  const newTeam = playerTeam.map(boar => ({
    ...boar,
    hp: Math.min(boar.maxHp, boar.hp + Math.floor(boar.maxHp * 0.5))
  }));
  
  return {
    newTeam,
    message: "💚 Votre équipe se repose et récupère 50% de ses HP !"
  };
}
