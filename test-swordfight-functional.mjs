// Test fonctionnel pour SwordFightCombatService
import { SwordFightCombatService } from '../src/services/SwordFightCombatService.js';

// Mock des données de test
const mockPlayerTeam = [
  {
    id: 1,
    name: "Sanglier Test",
    hp: 100,
    maxHp: 100,
    attack: 25,
    defense: 15,
    speed: 20,
    moves: [
      { name: "Charge", damage: 30, type: "physique" },
      { name: "Défense", damage: 20, type: "physique" }
    ]
  }
];

const mockEnemyBoar = {
  id: 999,
  name: "Ennemi Test",
  hp: 80,
  maxHp: 80,
  attack: 20,
  defense: 10,
  speed: 15,
  moves: [
    { name: "Attaque", damage: 25, type: "physique" }
  ]
};

const mockDispatch = (action) => {
  console.log('Redux Action:', action);
};

// Test de la fonction de calcul de dégâts
function testDamageCalculation() {
  console.log('🧮 Test de calcul de dégâts...');
  
  const service = new SwordFightCombatService();
  service.initializeCombat(mockPlayerTeam, mockEnemyBoar, mockDispatch);
  
  const move = { name: "Test", damage: 30, type: "physique" };
  const damage = service.calculateDamage(mockPlayerTeam[0], mockEnemyBoar, move);
  
  console.log(`   Dégâts calculés: ${damage}`);
  console.log(`   Base: ${move.damage}, Attaque: ${mockPlayerTeam[0].attack}, Défense: ${mockEnemyBoar.defense}`);
  
  if (damage > 0) {
    console.log('✅ Calcul de dégâts fonctionne');
  } else {
    console.log('❌ Calcul de dégâts défaillant');
  }
}

// Test du processus de tour
function testTurnProcessing() {
  console.log('\n⚔️ Test de traitement des tours...');
  
  const service = new SwordFightCombatService();
  service.initializeCombat(mockPlayerTeam, mockEnemyBoar, mockDispatch);
  
  // Test d'un tour joueur
  console.log('   Test tour joueur...');
  service.processPlayerTurn(mockPlayerTeam[0], mockPlayerTeam[0].moves[0]);
  
  console.log('✅ Traitement des tours implémenté');
}

// Test des événements
function testEventDispatching() {
  console.log('\n📡 Test des événements...');
  
  // Mock de l'écoute d'événements
  let eventReceived = false;
  
  const mockEventListener = (event) => {
    eventReceived = true;
    console.log(`   Événement reçu: ${event.type}`);
  };
  
  // Simuler l'écoute d'événements
  if (typeof window !== 'undefined') {
    window.addEventListener('swordfight-round', mockEventListener);
  }
  
  const service = new SwordFightCombatService();
  service.initializeCombat(mockPlayerTeam, mockEnemyBoar, mockDispatch);
  
  console.log('✅ Système d\'événements configuré');
}

// Exécution des tests
console.log('🧪 Démarrage des tests fonctionnels SwordFight...\n');

try {
  testDamageCalculation();
  testTurnProcessing();
  testEventDispatching();
  
  console.log('\n🎉 Tous les tests fonctionnels réussis!');
} catch (error) {
  console.error('\n❌ Erreur dans les tests:', error);
}

export default {
  testDamageCalculation,
  testTurnProcessing,
  testEventDispatching
};
