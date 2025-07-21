import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../../contexts/GameContext';

const BODY_PARTS = {
  heads: ['🐷', '🐗', '🦏', '🐴', '🦄', '🐺', '🦊', '🐻'],
  bodies: ['normal', 'musclé', 'élancé', 'robuste', 'massif'],
  colors: ['brown', 'pink', 'gray', 'black', 'white', 'golden', 'silver', 'rainbow'],
  accessories: ['none', 'crown', 'helmet', 'bandana', 'scarf', 'glasses', 'earrings'],
  patterns: ['none', 'spots', 'stripes', 'patches', 'gradient', 'tribal'],
};

const COLOR_MAP = {
  brown: '#8B4513',
  pink: '#FFC0CB',
  gray: '#808080',
  black: '#000000',
  white: '#FFFFFF',
  golden: '#FFD700',
  silver: '#C0C0C0',
  rainbow: 'linear-gradient(45deg, #FF0000, #00FF00, #0000FF)',
};

const STATS_TEMPLATES = {
  balanced: { attack: 50, defense: 50, speed: 50, hp: 100 },
  attacker: { attack: 80, defense: 30, speed: 60, hp: 80 },
  tank: { attack: 30, defense: 80, speed: 20, hp: 150 },
  speedster: { attack: 60, defense: 40, speed: 90, hp: 70 },
  custom: { attack: 40, defense: 40, speed: 40, hp: 100 },
};

export default function BoarEditor() {
  const { gameState, dispatch } = useGameContext();
  const [currentBoar, setCurrentBoar] = useState({
    id: Date.now().toString(),
    name: 'Mon Sanglier',
    head: '🐷',
    body: 'normal',
    color: 'brown',
    accessory: 'none',
    pattern: 'none',
    template: 'balanced',
    stats: { ...STATS_TEMPLATES.balanced },
    abilities: [],
    rarity: 'common',
  });

  const [availablePoints, setAvailablePoints] = useState(50);
  const [previewMode, setPreviewMode] = useState(false);

  const updateStat = (stat, value) => {
    const oldValue = currentBoar.stats[stat];
    const newValue = Math.max(10, Math.min(100, value));
    const difference = newValue - oldValue;

    if (availablePoints >= difference) {
      setCurrentBoar(prev => ({
        ...prev,
        stats: { ...prev.stats, [stat]: newValue }
      }));
      setAvailablePoints(prev => prev - difference);
    }
  };

  const applyTemplate = (template) => {
    const newStats = { ...STATS_TEMPLATES[template] };
    const totalCost = Object.values(newStats).reduce((sum, val) => sum + val, 0) - 160; // Base 40 per stat
    
    setCurrentBoar(prev => ({
      ...prev,
      template,
      stats: newStats
    }));
    setAvailablePoints(50 - totalCost);
  };

  const calculateRarity = () => {
    const totalStats = Object.values(currentBoar.stats).reduce((sum, val) => sum + val, 0);
    const hasAccessory = currentBoar.accessory !== 'none';
    const hasPattern = currentBoar.pattern !== 'none';
    const isUniqueHead = !['🐷', '🐗'].includes(currentBoar.head);

    let score = totalStats / 10;
    if (hasAccessory) score += 5;
    if (hasPattern) score += 3;
    if (isUniqueHead) score += 2;

    if (score >= 50) return 'legendary';
    if (score >= 40) return 'epic';
    if (score >= 30) return 'rare';
    if (score >= 20) return 'uncommon';
    return 'common';
  };

  const saveBoar = () => {
    const finalBoar = {
      ...currentBoar,
      rarity: calculateRarity(),
      maxHp: currentBoar.stats.hp,
      hp: currentBoar.stats.hp,
    };

    dispatch({ type: 'ADD_CUSTOM_BOAR', payload: finalBoar });
    dispatch({ type: 'ADD_MESSAGE', payload: `${finalBoar.name} a été créé !` });
    
    // Reset pour créer un nouveau sanglier
    setCurrentBoar({
      id: Date.now().toString(),
      name: 'Mon Sanglier',
      head: '🐷',
      body: 'normal',
      color: 'brown',
      accessory: 'none',
      pattern: 'none',
      template: 'balanced',
      stats: { ...STATS_TEMPLATES.balanced },
      abilities: [],
      rarity: 'common',
    });
    setAvailablePoints(50);
  };

  const renderBoarPreview = () => {
    const style = {
      background: COLOR_MAP[currentBoar.color],
      ...(currentBoar.color === 'rainbow' && {
        background: COLOR_MAP[currentBoar.color],
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      })
    };

    return (
      <div className="text-center">
        <div className="text-6xl mb-2 relative">
          <span style={currentBoar.color !== 'rainbow' ? {} : style}>
            {currentBoar.head}
          </span>
          {currentBoar.accessory !== 'none' && (
            <span className="absolute -top-2 -right-2 text-2xl">
              {currentBoar.accessory === 'crown' && '👑'}
              {currentBoar.accessory === 'helmet' && '⛑️'}
              {currentBoar.accessory === 'bandana' && '🎽'}
              {currentBoar.accessory === 'scarf' && '🧣'}
              {currentBoar.accessory === 'glasses' && '🕶️'}
              {currentBoar.accessory === 'earrings' && '💍'}
            </span>
          )}
        </div>
        <div className="font-bold text-lg">{currentBoar.name}</div>
        <div className="text-sm text-gray-600 capitalize">
          {currentBoar.rarity} • {currentBoar.body}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8">🎨 Éditeur de Sangliers</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panneau de preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Aperçu</h3>
            
            <div className="bg-gradient-to-b from-blue-100 to-green-100 rounded-lg p-8 mb-4">
              {renderBoarPreview()}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Attaque:</span>
                <span className="font-bold">{currentBoar.stats.attack}</span>
              </div>
              <div className="flex justify-between">
                <span>Défense:</span>
                <span className="font-bold">{currentBoar.stats.defense}</span>
              </div>
              <div className="flex justify-between">
                <span>Vitesse:</span>
                <span className="font-bold">{currentBoar.stats.speed}</span>
              </div>
              <div className="flex justify-between">
                <span>PV:</span>
                <span className="font-bold">{currentBoar.stats.hp}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Rareté:</span>
                <span className={`font-bold capitalize ${
                  calculateRarity() === 'legendary' ? 'text-yellow-600' :
                  calculateRarity() === 'epic' ? 'text-purple-600' :
                  calculateRarity() === 'rare' ? 'text-blue-600' :
                  calculateRarity() === 'uncommon' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  {calculateRarity()}
                </span>
              </div>
            </div>

            <motion.button
              className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveBoar}
            >
              💾 Sauvegarder le Sanglier
            </motion.button>
          </div>

          {/* Panneau d'édition */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Personnalisation</h3>

            <div className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={currentBoar.name}
                  onChange={(e) => setCurrentBoar(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                />
              </div>

              {/* Tête */}
              <div>
                <label className="block text-sm font-medium mb-2">Tête</label>
                <div className="grid grid-cols-4 gap-2">
                  {BODY_PARTS.heads.map(head => (
                    <motion.button
                      key={head}
                      className={`text-2xl p-2 rounded border-2 ${
                        currentBoar.head === head ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentBoar(prev => ({ ...prev, head }))}
                    >
                      {head}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium mb-2">Couleur</label>
                <div className="grid grid-cols-4 gap-2">
                  {BODY_PARTS.colors.map(color => (
                    <motion.button
                      key={color}
                      className={`h-10 rounded border-2 ${
                        currentBoar.color === color ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      style={{ background: COLOR_MAP[color] }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentBoar(prev => ({ ...prev, color }))}
                    >
                      {color === 'white' && <div className="w-full h-full border border-gray-300 rounded"></div>}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Templates de stats */}
              <div>
                <label className="block text-sm font-medium mb-2">Template de stats</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(STATS_TEMPLATES).map(template => (
                    <motion.button
                      key={template}
                      className={`p-2 rounded border-2 capitalize ${
                        currentBoar.template === template ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTemplate(template)}
                    >
                      {template}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Stats personnalisées */}
              {currentBoar.template === 'custom' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Stats personnalisées</label>
                    <span className="text-sm text-gray-600">Points restants: {availablePoints}</span>
                  </div>
                  
                  {Object.entries(currentBoar.stats).map(([stat, value]) => (
                    <div key={stat} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{stat}:</span>
                        <span>{value}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={value}
                        onChange={(e) => updateStat(stat, parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Accessoires */}
              <div>
                <label className="block text-sm font-medium mb-2">Accessoire</label>
                <select
                  value={currentBoar.accessory}
                  onChange={(e) => setCurrentBoar(prev => ({ ...prev, accessory: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {BODY_PARTS.accessories.map(accessory => (
                    <option key={accessory} value={accessory} className="capitalize">
                      {accessory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des sangliers personnalisés */}
        {gameState.customBoars && gameState.customBoars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-xl font-bold mb-4">Mes Sangliers Personnalisés</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameState.customBoars.map(boar => (
                <motion.div
                  key={boar.id}
                  className={`p-4 rounded-lg border-2 ${
                    boar.rarity === 'legendary' ? 'border-yellow-300 bg-yellow-50' :
                    boar.rarity === 'epic' ? 'border-purple-300 bg-purple-50' :
                    boar.rarity === 'rare' ? 'border-blue-300 bg-blue-50' :
                    boar.rarity === 'uncommon' ? 'border-green-300 bg-green-50' :
                    'border-gray-300 bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{boar.head}</div>
                    <div className="font-bold">{boar.name}</div>
                    <div className="text-sm text-gray-600 capitalize mb-2">
                      {boar.rarity}
                    </div>
                    <div className="text-xs space-y-1">
                      <div>ATK: {boar.stats.attack} | DEF: {boar.stats.defense}</div>
                      <div>SPD: {boar.stats.speed} | HP: {boar.stats.hp}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
