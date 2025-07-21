import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../contexts/GameContext';
import { ITEMS } from '../../utils/simpleInventory';
import { useInventory } from '../../hooks/useInventory';

const rarityColors = {
  common: 'bg-gray-100 border-gray-300',
  uncommon: 'bg-green-100 border-green-300',
  rare: 'bg-blue-100 border-blue-300',
  epic: 'bg-purple-100 border-purple-300',
  legendary: 'bg-yellow-100 border-yellow-300',
};

export default function SimpleInventoryScreen() {
  const { gameState, dispatch } = useGameContext();
  const inventory = useInventory();
  const [selectedTab, setSelectedTab] = useState('inventory');

  const goBackToMenu = () => {
    dispatch({ type: 'SET_GAME_STATE', payload: 'menu' });
  };

  const handleBuyItem = (item) => {
    const cost = getItemCost(item);
    if (gameState.gold >= cost) {
      if (inventory && inventory.addItem(item.id, 1)) {
        dispatch({ type: 'SPEND_GOLD', payload: cost });
        alert(`Acheté: ${item.name}`);
      } else {
        alert('Inventaire plein!');
      }
    } else {
      alert('Pas assez d\'or!');
    }
  };

  const getItemCost = (item) => {
    const baseCosts = {
      common: 50,
      uncommon: 150,
      rare: 400,
      epic: 1000,
      legendary: 2500,
    };
    return baseCosts[item.rarity];
  };

  // Attendre que l'inventaire soit initialisé
  if (!inventory) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-xl">Chargement de l'inventaire...</div>
      </div>
    );
  }

  const renderInventoryTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Inventaire</h3>
        <div className="text-yellow-600 font-bold">
          💰 {gameState.gold}
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {inventory.getSlots().slice(0, 24).map((slot, index) => (
          <div
            key={index}
            className={`
              aspect-square border-2 rounded-lg flex flex-col items-center justify-center
              relative
              ${slot.item ? rarityColors[slot.item.rarity] : 'bg-gray-50 border-gray-200'}
            `}
          >
            {slot.item ? (
              <>
                <span className="text-2xl">{slot.item.icon}</span>
                {slot.quantity > 1 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {slot.quantity}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400">+</span>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-600">
        Utilisez vos objets pendant les combats pour soigner vos sangliers !
      </div>
    </div>
  );

  const renderShopTab = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Boutique</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {ITEMS.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border-2 ${rarityColors[item.rarity]}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold">
                    💰 {getItemCost(item)}
                  </span>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    onClick={() => handleBuyItem(item)}
                    disabled={gameState.gold < getItemCost(item)}
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
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
          {selectedTab === 'inventory' && renderInventoryTab()}
          {selectedTab === 'shop' && renderShopTab()}
        </div>
      </motion.div>
    </div>
  );
}
