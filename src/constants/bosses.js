// Pool de boss
const BOSSES = [
  {
    name: "Sanglier de Guerre Légendaire",
    baseHp: 200,
    baseAttack: 45,
    baseDefense: 30,
    baseSpeed: 18,
    moves: [
      { name: "Charge Colossale", damage: 60, type: "physique" },
      { name: "Hurlement de Guerre", damage: 0, type: "intimidation", effect: "buff_attack" },
      { name: "Ecrasement", damage: 40, type: "physique" },
      { name: "Rugissement", damage: 25, type: "intimidation" },
    ],
  },
  {
    name: "Sanglier Mystique Alpha",
    baseHp: 160,
    baseAttack: 38,
    baseDefense: 28,
    baseSpeed: 28,
    moves: [
      { name: "Explosion d'Énergie", damage: 55, type: "magique" },
      { name: "Hypnose Alpha", damage: 0, type: "mental", effect: "stun" },
      { name: "Bouclier Mystique", damage: 20, type: "magique", effect: "defense" },
      { name: "Frappe Astrale", damage: 35, type: "magique" },
    ],
  },
];

export default BOSSES;
