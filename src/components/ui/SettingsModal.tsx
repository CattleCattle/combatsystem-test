import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../utils/audioManager';
import { slideInUp, fadeIn } from '../../utils/animations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    toggleMute,
    setMusicVolume,
    setSoundVolume,
    isMuted,
    musicVolume,
    soundVolume,
  } = useAudio();

  const [localMusicVolume, setLocalMusicVolume] = useState(musicVolume);
  const [localSoundVolume, setLocalSoundVolume] = useState(soundVolume);

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setLocalMusicVolume(volume);
    setMusicVolume(volume);
  };

  const handleSoundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setLocalSoundVolume(volume);
    setSoundVolume(volume);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
          >
            {/* Modal */}
            <motion.div
              variants={slideInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">⚙️ Paramètres</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Section Audio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    🔊 Audio
                  </h3>
                  
                  {/* Bouton Muet */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Son activé</span>
                    <button
                      onClick={toggleMute}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isMuted ? 'bg-gray-400' : 'bg-green-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isMuted ? 'translate-x-1' : 'translate-x-6'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Volume Musique */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Volume Musique: {Math.round(localMusicVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={localMusicVolume}
                      onChange={handleMusicVolumeChange}
                      disabled={isMuted}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Volume Effets */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Volume Effets: {Math.round(localSoundVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={localSoundVolume}
                      onChange={handleSoundVolumeChange}
                      disabled={isMuted}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Section Gameplay */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    🎮 Gameplay
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Sauvegarde automatique</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Animations rapides</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-400">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Section Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    ℹ️ Informations
                  </h3>
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>Version: 1.0.0</div>
                    <div>Développé avec ❤️ en React & Next.js</div>
                    <div>🐗 Donjon des Sangliers © 2025</div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Fermer
                  </button>
                  <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Réinitialiser
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Composant bouton paramètres
export function SettingsButton() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg z-30 transition-colors"
        title="Paramètres"
      >
        ⚙️
      </motion.button>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
