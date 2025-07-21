#!/usr/bin/env node

// Test script pour vérifier l'intégration SwordFight
const path = require('path');

console.log('🧪 Test de l\'intégration SwordFight Engine...\n');

// Test 1: Vérifier que le package est installé
try {
  const packageJson = require('./package.json');
  const hasSwordFight = packageJson.dependencies && packageJson.dependencies['swordfight-engine'];
  
  if (hasSwordFight) {
    console.log('✅ Package swordfight-engine trouvé dans package.json');
    console.log(`   Version: ${packageJson.dependencies['swordfight-engine']}`);
  } else {
    console.log('❌ Package swordfight-engine non trouvé dans package.json');
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture de package.json:', error.message);
}

// Test 2: Vérifier que les fichiers de service existent
const fs = require('fs');

const filesToCheck = [
  './src/services/SwordFightCombatService.js',
  './src/components/game/SwordFightBattleScreen.jsx',
  './src/components/game/SimpleSwordFightTest.jsx'
];

console.log('\n📁 Vérification des fichiers...');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Test 3: Vérifier la structure du service
try {
  const serviceContent = fs.readFileSync('./src/services/SwordFightCombatService.js', 'utf8');
  
  const expectedMethods = [
    'initializeCombat',
    'processPlayerTurn',
    'processEnemyTurn',
    'calculateDamage',
    'handleVictory',
    'handleDefeat'
  ];
  
  console.log('\n🔍 Vérification des méthodes du service...');
  expectedMethods.forEach(method => {
    if (serviceContent.includes(method)) {
      console.log(`✅ Méthode ${method} trouvée`);
    } else {
      console.log(`❌ Méthode ${method} manquante`);
    }
  });
} catch (error) {
  console.log('❌ Erreur lors de l\'analyse du service:', error.message);
}

console.log('\n🎉 Test d\'intégration terminé!');
