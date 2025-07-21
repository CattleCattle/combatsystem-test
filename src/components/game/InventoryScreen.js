import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../../contexts/GameContext';
import { ITEMS, useItem } from '../../utils/simpleInventory';
import ClientOnly from '../ClientOnly';

const rarityColors = {
  common: 'bg-gray-100 border-gray-300',
  uncommon: 'bg-green-100 border-green-300',
  rare: 'bg-blue-100 border-blue-300',
  epic: 'bg-purple-100 border-purple-300',
  legendary: 'bg-yellow-100 border-yellow-300',
};

const rarityTextColors = {
  common: 'text-gray-700',
  uncommon: 'text-green-700',
  rare: 'text-blue-700',
  epic: 'text-purple-700',
  legendary: 'text-yellow-700',
};

export default function InventoryScreen() {
  const { gameState, dispatch } = useGameContext();
  const [selectedTab, setSelectedTab] = useState('inventory');

  const goBackToMenu = () => {
    dispatch({ type: 'SET_GAME_STATE', payload: 'menu' });
  };

  const handleBuyItem = (item) => {
    const cost = getItemCost(item);
    if (gameState.gold >= cost) {
      dispatch({ type: 'SPEND_GOLD', payload: cost });
      alert(`Acheté: ${item.name} pour ${cost} or !`);
    } else {
      alert('Pas assez d\'or!');
    }
  };

  const getItemCost = (item) => {
    const baseCosts = {
      common: 50,
      uncommon: 150,
      rare: 400,
    };
    return baseCosts[item.rarity] || 50;
  };

  const renderInventoryTab = () => (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🎒</div>
      <h3 className="text-xl font-bold mb-2">Inventaire vide</h3>
      <p className="text-gray-600">
        Achetez des objets dans la boutique pour les voir ici !
      </p>
    </div>
  );

  const renderShopTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Boutique</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ITEMS.map(item => (
          <motion.div
            key={item.id}
            className={`p-4 rounded-lg border-2 ${rarityColors[item.rarity]}`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <h4 className={`font-bold ${rarityTextColors[item.rarity]}`}>
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">
                    💰 {getItemCost(item)}
                  </span>
                  <motion.button
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBuyItem(item)}
                    disabled={gameState.gold < getItemCost(item)}
                  >
                    Acheter
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <ClientOnly fallback={<div className="p-8">Chargement de l'inventaire...</div>}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">🎒 Inventaire & Boutique</h2>
            <button
              onClick={goBackToMenu}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ← Retour au Menu
            </button>
          </div>

          {/* Affichage de l'or */}
          <div className="text-center mb-6">
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 inline-block">
              <span className="text-yellow-800 font-bold text-xl">
                💰 {gameState.gold} Or
              </span>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex mb-6 bg-white rounded-lg shadow">
            <button
              className={`flex-1 py-3 px-6 rounded-l-lg font-medium transition-colors ${
                selectedTab === 'inventory'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedTab('inventory')}
            >
              🎒 Inventaire
            </button>
            <button
              className={`flex-1 py-3 px-6 rounded-r-lg font-medium transition-colors ${
                selectedTab === 'shop'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedTab('shop')}
            >
              🏪 Boutique
            </button>
          </div>

          {/* Contenu */}
          <div className="bg-white rounded-lg shadow p-6">
            <AnimatePresence mode="wait">
              {selectedTab === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {renderInventoryTab()}
                </motion.div>
              )}
              {selectedTab === 'shop' && (
                <motion.div
                  key="shop"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderShopTab()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </ClientOnly>
  );
}
