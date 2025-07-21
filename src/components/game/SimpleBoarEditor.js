import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../contexts/GameContext';
import ClientOnly from '../ClientOnly';

const BODY_PARTS = {
  heads: ['🐷', '🐗', '🦏', '🐴', '🦄', '🐺', '🦊', '🐻'],
  colors: ['brown', 'pink', 'gray', 'black', 'white', 'golden'],
  accessories: ['none', 'crown', 'helmet', 'bandana', 'scarf', 'glasses'],
};

const COLOR_MAP = {
  brown: '#8B4513',
  pink: '#FFC0CB',
  gray: '#808080',
  black: '#000000',
  white: '#FFFFFF',
  golden: '#FFD700',
};

const STATS_TEMPLATES = {
  balanced: { attack: 50, defense: 50, speed: 50, hp: 100 },
  attacker: { attack: 80, defense: 30, speed: 60, hp: 80 },
  tank: { attack: 30, defense: 80, speed: 20, hp: 150 },
  speedster: { attack: 60, defense: 40, speed: 90, hp: 70 },
};

export default function SimpleBoarEditor() {
  const { gameState, dispatch } = useGameContext();
  const [currentBoar, setCurrentBoar] = useState({
    id: Date.now().toString(),
    name: 'Mon Sanglier',
    head: '🐷',
    color: 'brown',
    accessory: 'none',
    template: 'balanced',
    stats: { ...STATS_TEMPLATES.balanced },
    rarity: 'common',
  });

  const applyTemplate = (template) => {
    const newStats = { ...STATS_TEMPLATES[template] };
    setCurrentBoar(prev => ({
      ...prev,
      template,
      stats: newStats
    }));
  };

  const calculateRarity = () => {
    const totalStats = Object.values(currentBoar.stats).reduce((sum, val) => sum + val, 0);
    const hasAccessory = currentBoar.accessory !== 'none';
    const isUniqueHead = !['🐷', '🐗'].includes(currentBoar.head);

    let score = totalStats / 10;
    if (hasAccessory) score += 5;
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
    
    // Reset
    setCurrentBoar({
      id: Date.now().toString(),
      name: 'Mon Sanglier',
      head: '🐷',
      color: 'brown',
      accessory: 'none',
      template: 'balanced',
      stats: { ...STATS_TEMPLATES.balanced },
      rarity: 'common',
    });
  };

  const goBackToMenu = () => {
    dispatch({ type: 'SET_GAME_STATE', payload: 'menu' });
  };

  return (
    <ClientOnly fallback={<div className="p-8">Chargement de l'éditeur...</div>}>
      <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🎨 Éditeur de Sangliers</h2>
          <button
            onClick={goBackToMenu}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Retour au Menu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panneau de preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Aperçu</h3>
            
            <div className="bg-gradient-to-b from-blue-100 to-green-100 rounded-lg p-8 mb-4 text-center">
              <div className="text-6xl mb-2 relative">
                <span>{currentBoar.head}</span>
                {currentBoar.accessory !== 'none' && (
                  <span className="absolute -top-2 -right-2 text-2xl">
                    {currentBoar.accessory === 'crown' && '👑'}
                    {currentBoar.accessory === 'helmet' && '⛑️'}
                    {currentBoar.accessory === 'bandana' && '🎽'}
                    {currentBoar.accessory === 'scarf' && '🧣'}
                    {currentBoar.accessory === 'glasses' && '🕶️'}
                  </span>
                )}
              </div>
              <div className="font-bold text-lg">{currentBoar.name}</div>
              <div className="text-sm text-gray-600 capitalize">
                {calculateRarity()}
              </div>
            </div>

            <div className="space-y-2 mb-4">
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
            </div>

            <button
              onClick={saveBoar}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600"
            >
              💾 Sauvegarder le Sanglier
            </button>
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
                    <button
                      key={head}
                      className={`text-2xl p-2 rounded border-2 ${
                        currentBoar.head === head ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                      }`}
                      onClick={() => setCurrentBoar(prev => ({ ...prev, head }))}
                    >
                      {head}
                    </button>
                  ))}
                </div>
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium mb-2">Couleur</label>
                <div className="grid grid-cols-3 gap-2">
                  {BODY_PARTS.colors.map(color => (
                    <button
                      key={color}
                      className={`h-10 rounded border-2 capitalize ${
                        currentBoar.color === color ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      style={{ background: COLOR_MAP[color] }}
                      onClick={() => setCurrentBoar(prev => ({ ...prev, color }))}
                    >
                      {color === 'white' && <div className="w-full h-full border border-gray-300 rounded"></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates de stats */}
              <div>
                <label className="block text-sm font-medium mb-2">Template de stats</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(STATS_TEMPLATES).map(template => (
                    <button
                      key={template}
                      className={`p-2 rounded border-2 capitalize ${
                        currentBoar.template === template ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                      }`}
                      onClick={() => applyTemplate(template)}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

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
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Mes Sangliers Personnalisés</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameState.customBoars.map(boar => (
                <div
                  key={boar.id}
                  className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50"
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
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
    </ClientOnly>
  );
}
