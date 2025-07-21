// Données constantes du jeu

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
      {
        name: "Défenses de Fer",
        damage: 20,
        type: "physique",
        effect: "defense",
      },
      { name: "Grognement", damage: 15, type: "intimidation" },
      { name: "Ruée Sauvage", damage: 35, type: "physique", recoil: true },
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
      { name: "Coup de Boutoir", damage: 28, type: "physique" },
      { name: "Frappe Rapide", damage: 20, type: "physique" },
      { name: "Cri Perçant", damage: 18, type: "intimidation" },
      { name: "Attaque Combo", damage: 25, type: "physique" },
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
      { name: "Soin Naturel", damage: 0, type: "soin", heal: 25 },
      {
        name: "Bouclier Mystique",
        damage: 15,
        type: "magique",
        effect: "defense",
      },
      { name: "Morsure Légère", damage: 20, type: "physique" },
      {
        name: "Régénération d'Équipe",
        damage: 0,
        type: "soin",
        healTeam: 15,
      },
    ],
  },
];

export const ENEMY_TYPES = [
  {
    name: "Sanglier des Bois",
    baseHp: 80,
    baseAttack: 22,
    baseDefense: 18,
    baseSpeed: 15,
    moves: [
      { name: "Coup de Boutoir", damage: 25, type: "physique" },
      { name: "Piétinement", damage: 20, type: "physique" },
      { name: "Cri Perçant", damage: 18, type: "intimidation" },
      { name: "Morsure Féroce", damage: 28, type: "physique" },
    ],
  },
  {
    name: "Sanglier de Guerre",
    baseHp: 120,
    baseAttack: 30,
    baseDefense: 25,
    baseSpeed: 12,
    moves: [
      { name: "Charge Dévastatrice", damage: 40, type: "physique" },
      {
        name: "Armure de Fer",
        damage: 15,
        type: "physique",
        effect: "defense",
      },
      { name: "Rugissement", damage: 20, type: "intimidation" },
      { name: "Coup de Corne", damage: 35, type: "physique" },
    ],
  },
  {
    name: "Sanglier Mystique",
    baseHp: 90,
    baseAttack: 35,
    baseDefense: 20,
    baseSpeed: 25,
    moves: [
      { name: "Souffle Magique", damage: 32, type: "magique" },
      {
        name: "Bouclier Mystique",
        damage: 18,
        type: "magique",
        effect: "defense",
      },
      { name: "Hypnose", damage: 22, type: "mental" },
      {
        name: "Explosion d'Énergie",
        damage: 45,
        type: "magique",
        recoil: true,
      },
    ],
  },
];

export const PATH_TYPES = [
  {
    type: "combat",
    name: "Combat Standard",
    description: "Affrontez un ennemi normal",
    icon: "⚔️",
    difficulty: 1.0,
    reward: "upgrade",
  },
  {
    type: "elite",
    name: "Combat d'Élite",
    description: "Ennemi plus fort, meilleure récompense",
    icon: "💀",
    difficulty: 1.4,
    reward: "double_upgrade",
  },
  {
    type: "healing",
    name: "Source de Guérison",
    description: "Récupérez 50% des PV de toute l'équipe",
    icon: "💚",
    difficulty: 0,
    reward: "heal",
  },
  {
    type: "treasure",
    name: "Trésor Mystique",
    description: "Trouvez un objet magique",
    icon: "💎",
    difficulty: 0,
    reward: "treasure",
  },
  {
    type: "boss",
    name: "Boss de Zone",
    description: "Combat difficile, récompenses exceptionnelles",
    icon: "👑",
    difficulty: 1.8,
    reward: "boss_reward",
  },
  {
    type: "mystery",
    name: "Événement Mystère",
    description: "Effet aléatoire, risque et récompense",
    icon: "❓",
    difficulty: 0,
    reward: "mystery",
  },
];

export const UPGRADE_OPTIONS = [
  {
    type: "hp",
    name: "Vitalité Renforcée",
    description: "+20 PV maximum",
    value: 20,
  },
  {
    type: "attack",
    name: "Force Brutale",
    description: "+5 Attaque",
    value: 5,
  },
  {
    type: "defense",
    name: "Peau Épaisse",
    description: "+5 Défense",
    value: 5,
  },
  {
    type: "speed",
    name: "Agilité Sauvage",
    description: "+5 Vitesse",
    value: 5,
  },
  {
    type: "heal",
    name: "Régénération",
    description: "Récupère 50% des PV",
    value: 0.5,
  },
  {
    type: "move_upgrade",
    name: "Technique Améliorée",
    description: "+5 dégâts à toutes les attaques",
    value: 5,
  },
  {
    type: "new_move",
    name: "Nouvelle Technique",
    description: "Apprend une nouvelle attaque",
    value: null,
  },
  {
    type: "revive",
    name: "Résurrection",
    description: "Ressuscite un sanglier KO avec 50% PV",
    value: 0.5,
  },
];

export const NEW_MOVES = [
  { name: "Frappe Éclair", damage: 25, type: "physique", priority: true },
  { name: "Régénération", damage: 0, type: "soin", heal: 30 },
  { name: "Berserker", damage: 50, type: "physique", recoil: true },
  {
    name: "Bouclier Naturel",
    damage: 10,
    type: "physique",
    effect: "defense",
  },
  { name: "Cri de Guerre", damage: 40, type: "intimidation" },
  { name: "Soin d'Équipe", damage: 0, type: "soin", healTeam: 20 },
];

export const MYSTERY_EVENTS = [
  {
    type: "good",
    message: "Vous trouvez des baies magiques ! +15 PV pour tous !",
    effect: "heal_all_15",
  },
  {
    type: "bad",
    message: "Un piège ! Tous les sangliers perdent 10 PV...",
    effect: "damage_all_10",
  },
  {
    type: "neutral",
    message: "Vous trouvez un ancien parchemin, mais il est illisible...",
    effect: "none",
  },
  {
    type: "good",
    message: "Un esprit bienveillant vous bénit ! +3 Attaque pour tous !",
    effect: "buff_attack_3",
  },
];

export const GAME_STATES = {
  MENU: "menu",
  BATTLE: "battle",
  VICTORY: "victory",
  DEFEAT: "defeat",
  UPGRADE: "upgrade",
  GAME_OVER: "gameOver",
  PATH_CHOICE: "pathChoice",
  INVENTORY: "inventory",
  BOAR_EDITOR: "boarEditor",
  TOURNAMENT: "tournament",
};
