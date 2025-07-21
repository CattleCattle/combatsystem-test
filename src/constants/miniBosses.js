// Pool de mini-bosses
const MINI_BOSSES = [
  {
    name: "Sanglier de Guerre Alpha",
    baseHp: 140,
    baseAttack: 32,
    baseDefense: 22,
    baseSpeed: 20,
    moves: [
      { name: "Charge Puissante", damage: 38, type: "physique" },
      { name: "Hurlement", damage: 0, type: "intimidation", effect: "buff_attack" },
      { name: "Coup de Défense", damage: 25, type: "physique" },
      { name: "Rugissement", damage: 18, type: "intimidation" },
    ],
  },
  {
    name: "Sanglier Mystique Bêta",
    baseHp: 120,
    baseAttack: 28,
    baseDefense: 20,
    baseSpeed: 26,
    moves: [
      { name: "Explosion Magique", damage: 34, type: "magique" },
      { name: "Hypnose", damage: 0, type: "mental", effect: "stun" },
      { name: "Bouclier Mystique", damage: 15, type: "magique", effect: "defense" },
      { name: "Frappe Astrale", damage: 22, type: "magique" },
    ],
  },
];

export default MINI_BOSSES;
