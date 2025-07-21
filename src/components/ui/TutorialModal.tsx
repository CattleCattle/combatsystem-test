import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInUp, fadeIn, staggerContainer, staggerItem } from '../../utils/animations';

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  image?: string;
  tip?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Bienvenue dans le Donjon des Sangliers !",
    content: "Vous dirigez une équipe de 3 sangliers intrépides dans un donjon mystérieux. Votre objectif : survivre le plus longtemps possible en montant les étages !",
    tip: "Chaque sanglier a des statistiques et des attaques uniques."
  },
  {
    id: 2,
    title: "Comprendre votre équipe",
    content: "🐗 Sanglier Alpha : Tank avec beaucoup de PV et de défense\n🐗 Sanglier Guerrier : Attaquant puissant mais fragile\n🐗 Sanglier Soigneur : Soutien avec des sorts de soin",
    tip: "Équilibrez votre stratégie entre attaque, défense et soin."
  },
  {
    id: 3,
    title: "Navigation dans le donjon",
    content: "À chaque étage, vous devez choisir votre chemin parmi plusieurs options. Chaque chemin offre des défis et récompenses différents.",
    tip: "Combat = Amélioration garantie, Guérison = Récupération, Mystère = Surprise !"
  },
  {
    id: 4,
    title: "Combat au tour par tour",
    content: "Sélectionnez un sanglier, puis choisissez une attaque. Les combats alternent entre votre tour et celui de l'ennemi. Surveillez les PV de vos sangliers !",
    tip: "Certaines attaques soignent ou ont des effets spéciaux comme le recul."
  },
  {
    id: 5,
    title: "Système d'amélioration",
    content: "Après chaque victoire, choisissez une amélioration pour renforcer votre équipe : augmenter les stats, apprendre de nouvelles attaques, ou soigner vos sangliers.",
    tip: "Planifiez vos améliorations en fonction de votre style de jeu."
  },
  {
    id: 6,
    title: "Boss et défis spéciaux",
    content: "Tous les 5 étages, vous affronterez un boss puissant. Ces combats sont difficiles mais offrent les meilleures récompenses !",
    tip: "Préparez-vous bien avant un combat de boss en soignant votre équipe."
  },
  {
    id: 7,
    title: "Conseils de survie",
    content: "• Gérez vos PV avec prudence\n• Utilisez les sorts de soin au bon moment\n• Diversifiez vos améliorations\n• N'hésitez pas à prendre la guérison si votre équipe est blessée",
    tip: "La patience et la stratégie sont vos meilleures armes !"
  }
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function TutorialModal({ isOpen, onClose, onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onComplete();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={slideInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">🎓 Tutorial</h1>
                <button
                  onClick={skipTutorial}
                  className="text-white hover:text-gray-200 text-sm underline"
                >
                  Passer le tutorial
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  Étape {currentStep + 1} sur {tutorialSteps.length}
                </div>
                <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                  <motion.div
                    className="bg-white h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <motion.div
              key={currentStep}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="p-6"
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  variants={staggerItem}
                  className="text-xl font-bold text-gray-800 mb-4"
                >
                  {tutorialSteps[currentStep].title}
                </motion.h2>

                <motion.div 
                  variants={staggerItem}
                  className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed"
                >
                  {tutorialSteps[currentStep].content}
                </motion.div>

                {tutorialSteps[currentStep].tip && (
                  <motion.div 
                    variants={staggerItem}
                    className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6"
                  >
                    <div className="flex items-start">
                      <div className="text-blue-400 mr-2">💡</div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Conseil :</p>
                        <p className="text-sm text-blue-700">{tutorialSteps[currentStep].tip}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                Précédent
              </button>

              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook pour gérer l'état du tutorial
export function useTutorial() {
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('boar_dungeon_tutorial_seen') === 'true';
    }
    return false;
  });

  const [showTutorial, setShowTutorial] = useState(false);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const completeTutorial = () => {
    setHasSeenTutorial(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('boar_dungeon_tutorial_seen', 'true');
    }
  };

  const resetTutorial = () => {
    setHasSeenTutorial(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boar_dungeon_tutorial_seen');
    }
  };

  return {
    hasSeenTutorial,
    showTutorial,
    setShowTutorial,
    startTutorial,
    completeTutorial,
    resetTutorial,
  };
}
