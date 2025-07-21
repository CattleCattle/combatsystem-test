import React from 'react';
import { motion } from 'framer-motion';

export default function BattleQueue({ actionOrder, actionBars }) {
  if (!actionOrder || actionOrder.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 rounded-lg p-4 min-w-[250px] z-40">
      <h3 className="text-white text-sm font-bold mb-3 text-center">
        🎯 File d'attaque
      </h3>
      
      <div className="space-y-2">
        {actionOrder.slice(0, 6).map((combatant, index) => {
          const key = `${combatant.type}_${combatant.id}`;
          const actionBar = actionBars[key];
          
          if (!actionBar) return null;

          const isReady = actionBar.ready;
          const isNext = index === 0 && isReady;

          return (
            <motion.div
              key={key}
              className={`flex items-center space-x-2 p-2 rounded transition-all ${
                isNext 
                  ? 'bg-yellow-500 bg-opacity-30 border border-yellow-400' 
                  : 'bg-gray-700 bg-opacity-50'
              }`}
              animate={{
                scale: isNext ? 1.05 : 1,
                boxShadow: isNext ? '0 0 10px rgba(255, 255, 0, 0.5)' : '0 0 0px transparent'
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                combatant.type === 'player' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {combatant.type === 'player' ? '🐗' : '👹'}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium truncate ${
                  isNext ? 'text-yellow-100' : 'text-white'
                }`}>
                  {combatant.name}
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                  <motion.div
                    className={`h-2 rounded-full transition-all duration-200 ${
                      isReady 
                        ? 'bg-green-400' 
                        : combatant.type === 'player' 
                          ? 'bg-blue-400' 
                          : 'bg-red-400'
                    }`}
                    style={{ width: `${actionBar.progress}%` }}
                    animate={{
                      opacity: isReady ? [1, 0.5, 1] : 1
                    }}
                    transition={{
                      repeat: isReady ? Infinity : 0,
                      duration: 0.8
                    }}
                  />
                </div>
              </div>

              {/* Indicateur de vitesse */}
              <div className="text-xs text-gray-300">
                {combatant.speed}
              </div>

              {/* Indicateur "Prêt" */}
              {isReady && (
                <motion.div
                  className="text-green-400 text-xs font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  PRÊT
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="flex justify-between text-xs text-gray-400">
          <span>🐗 Vos sangliers</span>
          <span>👹 Ennemis</span>
        </div>
      </div>
    </div>
  );
}
