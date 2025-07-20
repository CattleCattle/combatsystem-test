"use client";
import React from "react";

function MainComponent() {
  const [gameState, setGameState] = React.useState("menu"); // 'menu', 'battle', 'victory', 'defeat', 'upgrade', 'gameOver', 'pathChoice'
  const [currentFloor, setCurrentFloor] = React.useState(1);
  const [playerTeam, setPlayerTeam] = React.useState([
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
  ]);

  const [enemyBoar, setEnemyBoar] = React.useState(null);
  const [battleLog, setBattleLog] = React.useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true);
  const [selectedBoar, setSelectedBoar] = React.useState(null);
  const [selectedMove, setSelectedMove] = React.useState(null);
  const [upgradeOptions, setUpgradeOptions] = React.useState([]);
  const [upgradeTarget, setUpgradeTarget] = React.useState(null);
  const [pathOptions, setPathOptions] = React.useState([]);
  const [currentBoarIndex, setCurrentBoarIndex] = React.useState(0);

  const enemyTypes = [
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

  const pathTypes = [
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

  const generateEnemy = (difficultyMultiplier = 1.0) => {
    const enemyTemplate =
      enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
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

  const generatePathOptions = () => {
    const availablePaths = [...pathTypes];

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

  const generateUpgradeOptions = () => {
    const allUpgrades = [
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

    const shuffled = [...allUpgrades].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const newMoves = [
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

  const startGame = () => {
    setCurrentFloor(1);
    setPlayerTeam((prev) => prev.map((boar) => ({ ...boar, hp: boar.maxHp })));
    setGameState("pathChoice");
    setPathOptions(generatePathOptions());
    setBattleLog([]);
    setIsPlayerTurn(true);
    setSelectedBoar(null);
  };

  const choosePath = (path) => {
    switch (path.type) {
      case "combat":
      case "elite":
      case "boss":
        setEnemyBoar(generateEnemy(path.difficulty));
        setGameState("battle");
        setBattleLog([`Étage ${currentFloor} - ${path.name} !`]);
        setIsPlayerTurn(true);
        setSelectedBoar(null);
        break;

      case "healing":
        setPlayerTeam((prev) =>
          prev.map((boar) => ({
            ...boar,
            hp: Math.min(boar.maxHp, Math.floor(boar.hp + boar.maxHp * 0.5)),
          }))
        );
        setBattleLog([
          `Vous trouvez une source de guérison ! Toute l'équipe récupère 50% de ses PV.`,
        ]);
        setTimeout(() => proceedToNextFloor(), 2000);
        break;

      case "treasure":
        // Amélioration aléatoire pour un membre aléatoire
        const aliveMember = playerTeam.find((boar) => boar.hp > 0);
        if (aliveMember) {
          const treasureUpgrades = [
            { type: "attack", value: 8 },
            { type: "defense", value: 8 },
            { type: "hp", value: 30 },
            { type: "speed", value: 8 },
          ];
          const randomUpgrade =
            treasureUpgrades[
              Math.floor(Math.random() * treasureUpgrades.length)
            ];

          setPlayerTeam((prev) =>
            prev.map((boar) => {
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
            })
          );

          setBattleLog([
            `${aliveMember.name} trouve un trésor et gagne +${
              randomUpgrade.value
            } ${
              randomUpgrade.type === "hp"
                ? "PV"
                : randomUpgrade.type === "attack"
                ? "Attaque"
                : randomUpgrade.type === "defense"
                ? "Défense"
                : "Vitesse"
            } !`,
          ]);
        }
        setTimeout(() => proceedToNextFloor(), 2000);
        break;

      case "mystery":
        const mysteryEvents = [
          {
            type: "good",
            message: "Vous trouvez des baies magiques ! +15 PV pour tous !",
            effect: () => {
              setPlayerTeam((prev) =>
                prev.map((boar) => ({
                  ...boar,
                  hp: Math.min(boar.maxHp, boar.hp + 15),
                }))
              );
            },
          },
          {
            type: "bad",
            message: "Un piège ! Tous les sangliers perdent 10 PV...",
            effect: () => {
              setPlayerTeam((prev) =>
                prev.map((boar) => ({
                  ...boar,
                  hp: Math.max(1, boar.hp - 10),
                }))
              );
            },
          },
          {
            type: "neutral",
            message:
              "Vous trouvez un ancien parchemin, mais il est illisible...",
            effect: () => {},
          },
          {
            type: "good",
            message:
              "Un esprit bienveillant vous bénit ! +3 Attaque pour tous !",
            effect: () => {
              setPlayerTeam((prev) =>
                prev.map((boar) => ({
                  ...boar,
                  attack: boar.attack + 3,
                }))
              );
            },
          },
        ];

        const randomEvent =
          mysteryEvents[Math.floor(Math.random() * mysteryEvents.length)];
        randomEvent.effect();
        setBattleLog([randomEvent.message]);
        setTimeout(() => proceedToNextFloor(), 2000);
        break;
    }
  };

  const proceedToNextFloor = () => {
    setCurrentFloor((prev) => prev + 1);
    setGameState("pathChoice");
    setPathOptions(generatePathOptions());
  };

  const startBattle = () => {
    const enemy = generateEnemy();
    setEnemyBoar(enemy);
    setGameState("battle");
    setBattleLog([`Étage ${currentFloor} - Le combat commence !`]);
    setIsPlayerTurn(true);
    setSelectedBoar(null);
  };

  const calculateDamage = (attacker, defender, move) => {
    const baseDamage = move.damage;
    const attackStat = attacker.attack;
    const defenseStat = defender.defense;

    const damage = Math.floor(
      ((baseDamage * attackStat) / defenseStat) * (0.8 + Math.random() * 0.4)
    );
    return Math.max(1, damage);
  };

  const executeMove = (attacker, defender, move, isPlayer) => {
    if (move.heal) {
      const healAmount = move.heal;
      if (isPlayer) {
        setPlayerTeam((prev) =>
          prev.map((boar) =>
            boar.id === attacker.id
              ? { ...boar, hp: Math.min(boar.maxHp, boar.hp + healAmount) }
              : boar
          )
        );
        setBattleLog((prev) => [
          ...prev,
          `${attacker.name} récupère ${healAmount} PV !`,
        ]);
      }
      setTimeout(() => {
        setIsPlayerTurn(!isPlayer);
        setSelectedBoar(null);
      }, 1000);
      return;
    }

    if (move.healTeam) {
      const healAmount = move.healTeam;
      if (isPlayer) {
        setPlayerTeam((prev) =>
          prev.map((boar) => ({
            ...boar,
            hp: Math.min(boar.maxHp, boar.hp + healAmount),
          }))
        );
        setBattleLog((prev) => [
          ...prev,
          `${attacker.name} soigne toute l'équipe de ${healAmount} PV !`,
        ]);
      }
      setTimeout(() => {
        setIsPlayerTurn(!isPlayer);
        setSelectedBoar(null);
      }, 1000);
      return;
    }

    const damage = calculateDamage(attacker, defender, move);
    const newDefenderHp = Math.max(0, defender.hp - damage);

    let logMessage = `${attacker.name} utilise ${move.name} !`;
    setBattleLog((prev) => [...prev, logMessage]);

    setTimeout(() => {
      setBattleLog((prev) => [...prev, `${defender.name} perd ${damage} PV !`]);

      if (isPlayer) {
        setEnemyBoar((prev) => ({ ...prev, hp: newDefenderHp }));
      } else {
        setPlayerTeam((prev) =>
          prev.map((boar) =>
            boar.id === defender.id ? { ...boar, hp: newDefenderHp } : boar
          )
        );
      }

      if (move.recoil && isPlayer) {
        const recoilDamage = Math.floor(damage * 0.25);
        setPlayerTeam((prev) =>
          prev.map((boar) =>
            boar.id === attacker.id
              ? { ...boar, hp: Math.max(0, boar.hp - recoilDamage) }
              : boar
          )
        );
        setBattleLog((prev) => [
          ...prev,
          `${attacker.name} subit ${recoilDamage} PV de recul !`,
        ]);
      }

      if (newDefenderHp <= 0) {
        setTimeout(() => {
          if (isPlayer) {
            // Victoire du joueur
            setGameState("victory");
          } else {
            setPlayerTeam((prev) => {
              const updatedTeam = prev.map((boar) =>
                boar.id === defender.id ? { ...boar, hp: 0 } : boar
              );
              const aliveMembers = updatedTeam.filter((boar) => boar.hp > 0);
              if (aliveMembers.length === 0) {
                setTimeout(() => setGameState("gameOver"), 500);
              }
              return updatedTeam;
            });
          }
        }, 1000);
      } else {
        setTimeout(() => {
          setIsPlayerTurn(!isPlayer);
          setSelectedBoar(null);
        }, 1000);
      }
    }, 1000);
  };

  const playerAttack = (move) => {
    if (!isPlayerTurn || !selectedBoar) return;
    executeMove(selectedBoar, enemyBoar, move, true);

    // Passer au sanglier suivant pour le prochain tour
    setCurrentBoarIndex((prev) => prev + 1);
    setIsPlayerTurn(false);
  };

  const enemyAttack = () => {
    const aliveTeamMembers = playerTeam.filter((boar) => boar.hp > 0);
    if (aliveTeamMembers.length === 0) return;

    const randomTarget =
      aliveTeamMembers[Math.floor(Math.random() * aliveTeamMembers.length)];
    const randomMove =
      enemyBoar.moves[Math.floor(Math.random() * enemyBoar.moves.length)];
    executeMove(enemyBoar, randomTarget, randomMove, false);
  };

  React.useEffect(() => {
    if (
      !isPlayerTurn &&
      gameState === "battle" &&
      enemyBoar &&
      enemyBoar.hp > 0
    ) {
      const aliveMembers = playerTeam.filter((boar) => boar.hp > 0);
      if (aliveMembers.length > 0) {
        const timer = setTimeout(() => {
          enemyAttack();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isPlayerTurn, gameState, enemyBoar, playerTeam]);

  const proceedToUpgrade = () => {
    setUpgradeOptions(generateUpgradeOptions());
    setUpgradeTarget(null);
    setGameState("upgrade");
  };

  const applyUpgrade = (upgrade) => {
    if (upgrade.type === "revive") {
      const koMember = playerTeam.find((boar) => boar.hp === 0);
      if (koMember) {
        setPlayerTeam((prev) =>
          prev.map((boar) =>
            boar.id === koMember.id
              ? { ...boar, hp: Math.floor(boar.maxHp * upgrade.value) }
              : boar
          )
        );
      }
    } else if (upgradeTarget) {
      setPlayerTeam((prev) =>
        prev.map((boar) => {
          if (boar.id !== upgradeTarget.id) return boar;

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
              const availableMoves = newMoves.filter(
                (move) =>
                  !newBoar.moves.some((existing) => existing.name === move.name)
              );
              if (availableMoves.length > 0) {
                const randomNewMove =
                  availableMoves[
                    Math.floor(Math.random() * availableMoves.length)
                  ];
                if (newBoar.moves.length < 6) {
                  newBoar.moves.push(randomNewMove);
                } else {
                  newBoar.moves[
                    Math.floor(Math.random() * newBoar.moves.length)
                  ] = randomNewMove;
                }
              }
              break;
          }

          return newBoar;
        })
      );
    }

    proceedToNextFloor();
  };

  const resetGame = () => {
    setPlayerTeam([
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
    ]);
    setCurrentFloor(1);
    setGameState("menu");
    setBattleLog([]);
    setIsPlayerTurn(true);
    setSelectedBoar(null);
    setSelectedMove(null);
    setEnemyBoar(null);
  };

  const getHpPercentage = (hp, maxHp) => (hp / maxHp) * 100;

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            🐗 Donjon des Sangliers 🐗
          </h1>
          <p className="text-gray-600 mb-6">
            Un roguelite de combat au tour par tour
          </p>
          <div className="mb-6">
            <div className="text-lg font-semibold text-green-700 mb-2">
              Votre Équipe :
            </div>
            {playerTeam.map((boar) => (
              <div key={boar.id} className="mb-2">
                <div className="text-lg font-bold text-green-800">
                  {boar.name}
                </div>
                <div className="text-sm text-gray-600">
                  PV: {boar.maxHp} | ATT: {boar.attack} | DEF: {boar.defense}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-6 text-sm text-gray-600">
            <p>• Dirigez une équipe de 3 sangliers</p>
            <p>• Choisissez votre chemin entre les combats</p>
            <p>• Battez des boss ennemis pour progresser</p>
            <p>• Survivez le plus longtemps possible !</p>
          </div>
          <button
            onClick={startGame}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
          >
            Commencer l'Aventure !
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "pathChoice") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-6xl w-full">
          <h1 className="text-3xl font-bold text-indigo-800 mb-4">
            🗺️ Carte du Donjon
          </h1>
          <p className="text-gray-600 mb-6">
            Étage {currentFloor} - Choisissez votre chemin vers l'étage{" "}
            {currentFloor + 1}
          </p>

          {/* État de l'équipe */}
          <div className="mb-6 bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              État de votre équipe :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {playerTeam.map((boar) => (
                <div key={boar.id} className="bg-white rounded p-2">
                  <div className="font-bold text-sm">{boar.name}</div>
                  <div className="text-xs text-gray-600">
                    {boar.hp}/{boar.maxHp} PV | ATT: {boar.attack} | DEF:{" "}
                    {boar.defense}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full ${
                        boar.hp === 0 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{
                        width: `${getHpPercentage(boar.hp, boar.maxHp)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte des chemins */}
          <div className="bg-gradient-to-b from-green-100 to-brown-100 rounded-lg p-6 mb-4 relative overflow-hidden">
            {/* Décor de fond */}
            <div className="absolute inset-0 opacity-10">
              <div className="text-6xl absolute top-2 left-4">🌲</div>
              <div className="text-4xl absolute top-8 right-8">🏔️</div>
              <div className="text-5xl absolute bottom-4 left-8">🌿</div>
              <div className="text-3xl absolute bottom-8 right-4">🗿</div>
            </div>

            {/* Position actuelle */}
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  📍 Étage {currentFloor} - Vous êtes ici
                </div>
              </div>

              {/* Chemins divergents */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {pathOptions.map((path, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Nœud du chemin */}
                    <button
                      onClick={() => choosePath(path)}
                      className="relative bg-white hover:bg-gray-50 border-4 border-indigo-300 hover:border-indigo-500 rounded-full w-32 h-32 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    >
                      <div className="text-4xl mb-1">{path.icon}</div>
                      <div className="text-xs font-bold text-indigo-800 text-center px-2">
                        {path.name.split(" ")[0]}
                      </div>
                      {path.difficulty > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {Math.round(path.difficulty * 100)}%
                        </div>
                      )}
                    </button>

                    {/* Description détaillée */}
                    <div className="mt-4 bg-white rounded-lg p-3 shadow-md border-2 border-indigo-200 max-w-xs">
                      <div className="font-bold text-indigo-800 mb-1">
                        {path.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {path.description}
                      </div>

                      {/* Indicateurs de récompense */}
                      <div className="flex justify-center space-x-1">
                        {path.reward === "upgrade" && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            ⬆️ Amélioration
                          </span>
                        )}
                        {path.reward === "double_upgrade" && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            ⬆️⬆️ Double
                          </span>
                        )}
                        {path.reward === "boss_reward" && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            👑 Boss
                          </span>
                        )}
                        {path.reward === "heal" && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            💚 Soin
                          </span>
                        )}
                        {path.reward === "treasure" && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            💎 Trésor
                          </span>
                        )}
                        {path.reward === "mystery" && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            ❓ Mystère
                          </span>
                        )}
                      </div>

                      {/* Niveau de risque */}
                      <div className="mt-2 flex justify-center">
                        {path.difficulty === 0 && (
                          <span className="text-xs text-green-600">🟢 Sûr</span>
                        )}
                        {path.difficulty === 1.0 && (
                          <span className="text-xs text-yellow-600">
                            🟡 Normal
                          </span>
                        )}
                        {path.difficulty === 1.4 && (
                          <span className="text-xs text-orange-600">
                            🟠 Difficile
                          </span>
                        )}
                        {path.difficulty === 1.8 && (
                          <span className="text-xs text-red-600">
                            🔴 Très Difficile
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination */}
              <div className="flex justify-center mt-12">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                  🎯 Étage {currentFloor + 1}
                </div>
              </div>
            </div>
          </div>

          {/* Légende */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <h4 className="font-bold text-gray-800 mb-2">
              💡 Conseils stratégiques :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
              <div>• Équipe blessée ? Choisissez la guérison 💚</div>
              <div>• Besoin de puissance ? Tentez l'élite 💀</div>
              <div>• Envie de surprise ? Mystère ❓</div>
              <div>• Amélioration garantie ? Trésor 💎</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "upgrade") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">
            🎯 Choisissez une Amélioration
          </h1>
          <p className="text-gray-600 mb-6">
            Étage {currentFloor - 1} terminé ! Préparez-vous pour l'étage{" "}
            {currentFloor}
          </p>

          {!upgradeTarget ? (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-4">
                Sélectionnez un sanglier à améliorer :
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {playerTeam.map((boar) => (
                  <button
                    key={boar.id}
                    onClick={() => setUpgradeTarget(boar)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      boar.hp > 0
                        ? "bg-green-100 hover:bg-green-200 border-green-300"
                        : "bg-red-100 border-red-300 opacity-50"
                    }`}
                    disabled={boar.hp === 0}
                  >
                    <div className="text-lg font-bold text-gray-800">
                      {boar.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      PV: {boar.hp}/{boar.maxHp} | ATT: {boar.attack} | DEF:{" "}
                      {boar.defense}
                    </div>
                    {boar.hp === 0 && (
                      <div className="text-red-600 font-bold">KO</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-4">
                Amélioration pour {upgradeTarget.name} :
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {upgradeOptions.map((upgrade, index) => (
                  <button
                    key={index}
                    onClick={() => applyUpgrade(upgrade)}
                    className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg p-4 transition-colors"
                  >
                    <div className="text-lg font-bold text-purple-800 mb-2">
                      {upgrade.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {upgrade.description}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setUpgradeTarget(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Retour
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === "victory") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-yellow-600 mb-4">
            🏆 Victoire ! 🏆
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Votre équipe a gagné le combat !
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Étage {currentFloor} terminé
          </p>
          <button
            onClick={proceedToUpgrade}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
          >
            Continuer l'Aventure
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "gameOver") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            💀 Game Over 💀
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Votre équipe a été vaincue...
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Vous avez atteint l'étage {currentFloor}
          </p>
          <div className="mb-6 text-sm text-gray-600">
            <div className="font-semibold mb-2">Équipe finale :</div>
            {playerTeam.map((boar) => (
              <div key={boar.id} className="mb-1">
                {boar.name}: PV {boar.maxHp} | ATT {boar.attack} | DEF{" "}
                {boar.defense}
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
          >
            Nouvelle Partie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-600 to-orange-800 relative overflow-hidden">
      {/* Fond de combat style pixel art */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-yellow-300 to-orange-400 opacity-80"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)
        `,
        }}
      ></div>

      {/* Décor de fond style nature */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="text-8xl absolute top-4 left-8 text-green-800">🌲</div>
        <div className="text-6xl absolute top-12 right-12 text-green-700">
          🌳
        </div>
        <div className="text-7xl absolute bottom-20 left-16 text-green-800">
          🌿
        </div>
        <div className="text-5xl absolute bottom-32 right-20 text-brown-600">
          🗿
        </div>
        <div className="text-6xl absolute top-1/2 left-1/4 text-green-600">
          🍃
        </div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Zone de combat principale */}
        <div className="flex-1 flex items-center justify-between px-8 py-4">
          {/* Équipe du joueur (à droite) */}
          <div className="flex flex-col space-y-4">
            {playerTeam.map((boar, index) => (
              <div
                key={boar.id}
                className={`relative transition-all duration-300 ${
                  selectedBoar?.id === boar.id ? "scale-110 z-20" : "scale-100"
                } ${boar.hp === 0 ? "opacity-50 grayscale" : ""}`}
                onClick={() =>
                  boar.hp > 0 && isPlayerTurn && setSelectedBoar(boar)
                }
              >
                {/* Sprite du sanglier */}
                <div
                  className={`text-6xl cursor-pointer transition-all duration-200 ${
                    selectedBoar?.id === boar.id ? "animate-bounce" : ""
                  } ${boar.hp === 0 ? "filter grayscale" : ""}`}
                >
                  🐗
                </div>

                {/* Indicateur de sélection */}
                {selectedBoar?.id === boar.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-yellow-400 animate-pulse"></div>
                  </div>
                )}

                {/* Effets de statut */}
                {boar.hp === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">💀</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ennemi (à gauche) */}
          <div className="flex-1 flex justify-center items-center">
            {enemyBoar && (
              <div className="relative">
                {/* Sprite de l'ennemi */}
                <div className="text-9xl transform scale-x-[-1] animate-pulse">
                  🐗
                </div>

                {/* Nom de l'ennemi */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-900 text-yellow-200 px-4 py-1 rounded-lg border-2 border-yellow-400 font-bold text-lg shadow-lg">
                  {enemyBoar.name}
                </div>

                {/* Barre de vie de l'ennemi */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48">
                  <div className="bg-black border-2 border-yellow-400 rounded p-1">
                    <div className="bg-red-800 h-3 rounded relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-600 h-full transition-all duration-500 relative"
                        style={{
                          width: `${getHpPercentage(
                            enemyBoar.hp,
                            enemyBoar.maxHp
                          )}%`,
                        }}
                      >
                        <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-center text-yellow-200 text-sm font-bold mt-1">
                      {enemyBoar.hp}/{enemyBoar.maxHp}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interface utilisateur style rétro */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 border-t-4 border-yellow-400 p-4">
          <div className="grid grid-cols-12 gap-4 h-32">
            {/* Menu de gauche */}
            <div className="col-span-3 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-yellow-200 font-bold text-sm">
                  <span>⚔️</span>
                  <span>COMBAT</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 font-bold text-sm">
                  <span>🛠️</span>
                  <span>OUTILS</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 font-bold text-sm">
                  <span>🎒</span>
                  <span>OBJETS</span>
                </div>
              </div>
            </div>

            {/* Informations de l'équipe */}
            <div className="col-span-6 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-2 h-full">
                {playerTeam.map((boar) => (
                  <div key={boar.id} className="text-center">
                    <div className="text-yellow-200 font-bold text-xs mb-1 truncate">
                      {boar.name.toUpperCase()}
                    </div>
                    <div className="text-yellow-300 text-xs">
                      {boar.hp > 0 ? boar.hp : "KO"}
                    </div>
                    {/* Barre de vie */}
                    <div className="bg-black border border-yellow-600 rounded mt-1 h-2">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          boar.hp === 0
                            ? "bg-gray-600"
                            : "bg-gradient-to-r from-green-400 to-green-600"
                        }`}
                        style={{
                          width: `${getHpPercentage(boar.hp, boar.maxHp)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions de combat */}
            <div className="col-span-3 bg-gradient-to-b from-orange-800 to-red-900 border-2 border-yellow-400 rounded-lg p-3">
              <div className="text-yellow-200 font-bold text-xs mb-2 text-center">
                {isPlayerTurn ? "VOTRE TOUR" : "TOUR ENNEMI"}
              </div>
              {selectedBoar && isPlayerTurn ? (
                <div className="text-yellow-300 text-xs text-center">
                  {selectedBoar.name}
                  <br />
                  <span className="text-green-400">PRÊT</span>
                </div>
              ) : (
                <div className="text-gray-400 text-xs text-center">
                  {isPlayerTurn ? "Sélectionnez\nun sanglier" : "Attendez..."}
                </div>
              )}
            </div>
          </div>

          {/* Menu des attaques */}
          {selectedBoar && isPlayerTurn && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {selectedBoar.moves.map((move, index) => (
                <button
                  key={index}
                  onClick={() => playerAttack(move)}
                  className="bg-gradient-to-b from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 border-2 border-cyan-400 rounded-lg p-3 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <div className="text-cyan-200 font-bold text-sm mb-1">
                    {move.name.toUpperCase()}
                  </div>
                  <div className="text-cyan-300 text-xs">
                    {move.heal
                      ? `SOIN ${move.heal}`
                      : move.healTeam
                      ? `SOIN ÉQUIPE ${move.healTeam}`
                      : `DMG ${move.damage}`}
                  </div>
                  <div className="text-cyan-400 text-xs mt-1">
                    {move.type.toUpperCase()}
                    {move.recoil && " • RECUL"}
                    {move.priority && " • PRIORITÉ"}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Log de combat */}
          <div className="mt-4 bg-black border-2 border-yellow-400 rounded-lg p-3 h-20 overflow-y-auto">
            <div className="space-y-1">
              {battleLog.slice(-3).map((log, index) => (
                <div key={index} className="text-yellow-200 text-sm font-mono">
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;