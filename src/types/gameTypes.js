// Types TypeScript pour le jeu (pour future migration vers TS)

/**
 * @typedef {Object} Move
 * @property {string} name - Nom de l'attaque
 * @property {number} damage - Dégâts de base
 * @property {string} type - Type d'attaque (physique, magique, soin, etc.)
 * @property {number} [heal] - Montant de soins (optionnel)
 * @property {number} [healTeam] - Soins pour toute l'équipe (optionnel)
 * @property {boolean} [recoil] - Si l'attaque cause du recul (optionnel)
 * @property {boolean} [priority] - Si l'attaque a la priorité (optionnel)
 * @property {string} [effect] - Effet spécial (optionnel)
 */

/**
 * @typedef {Object} Boar
 * @property {number} id - Identifiant unique
 * @property {string} name - Nom du sanglier
 * @property {number} hp - Points de vie actuels
 * @property {number} maxHp - Points de vie maximum
 * @property {number} attack - Statistique d'attaque
 * @property {number} defense - Statistique de défense
 * @property {number} speed - Statistique de vitesse
 * @property {Move[]} moves - Liste des attaques disponibles
 */

/**
 * @typedef {Object} EnemyTemplate
 * @property {string} name - Nom du type d'ennemi
 * @property {number} baseHp - PV de base
 * @property {number} baseAttack - Attaque de base
 * @property {number} baseDefense - Défense de base
 * @property {number} baseSpeed - Vitesse de base
 * @property {Move[]} moves - Attaques disponibles
 */

/**
 * @typedef {Object} PathOption
 * @property {string} type - Type de chemin
 * @property {string} name - Nom du chemin
 * @property {string} description - Description du chemin
 * @property {string} icon - Icône représentative
 * @property {number} difficulty - Multiplicateur de difficulté
 * @property {string} reward - Type de récompense
 */

/**
 * @typedef {Object} UpgradeOption
 * @property {string} type - Type d'amélioration
 * @property {string} name - Nom de l'amélioration
 * @property {string} description - Description de l'amélioration
 * @property {number|null} value - Valeur de l'amélioration
 */

/**
 * @typedef {Object} MysteryEvent
 * @property {string} type - Type d'événement (good, bad, neutral)
 * @property {string} message - Message affiché
 * @property {string} effect - Effet à appliquer
 */

/**
 * @typedef {Object} GameState
 * @property {string} gameState - État actuel du jeu
 * @property {number} currentFloor - Étage actuel
 * @property {Boar[]} playerTeam - Équipe du joueur
 * @property {Boar|null} enemyBoar - Ennemi actuel
 * @property {string[]} battleLog - Journal de combat
 * @property {boolean} isPlayerTurn - Tour du joueur
 * @property {Boar|null} selectedBoar - Sanglier sélectionné
 * @property {Move|null} selectedMove - Attaque sélectionnée
 * @property {UpgradeOption[]} upgradeOptions - Options d'amélioration
 * @property {Boar|null} upgradeTarget - Cible de l'amélioration
 * @property {PathOption[]} pathOptions - Options de chemin
 * @property {number} currentBoarIndex - Index du sanglier actuel
 */

export {};
