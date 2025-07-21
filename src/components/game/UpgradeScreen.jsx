import React from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { useGameActions } from '../../hooks/useGameActions.js';

export default function UpgradeScreen() {
  const { gameState, dispatch, actions } = useGameContext();
  const { currentFloor, playerTeam, upgradeTarget, upgradeOptions } = gameState;
  const { applyUpgrade } = useGameActions();

  const setUpgradeTarget = (target) => {
    dispatch({ type: actions.SET_UPGRADE_TARGET, payload: target });
  };

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
          <BoarSelection 
            playerTeam={playerTeam}
            onSelectTarget={setUpgradeTarget}
          />
        ) : (
          <UpgradeSelection 
            upgradeTarget={upgradeTarget}
            upgradeOptions={upgradeOptions}
            onApplyUpgrade={applyUpgrade}
            onBack={() => setUpgradeTarget(null)}
          />
        )}
      </div>
    </div>
  );
}

function BoarSelection({ playerTeam, onSelectTarget }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-purple-700 mb-4">
        Sélectionnez un sanglier à améliorer :
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {playerTeam && playerTeam.map((boar) => (
          <button
            key={boar.id}
            onClick={() => onSelectTarget(boar)}
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
  );
}

function UpgradeSelection({ upgradeTarget, upgradeOptions, onApplyUpgrade, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-purple-700 mb-4">
        Amélioration pour {upgradeTarget.name} :
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {upgradeOptions.map((upgrade, index) => (
          <button
            key={index}
            onClick={() => onApplyUpgrade(upgrade, upgradeTarget)}
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
        onClick={onBack}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
      >
        Retour
      </button>
    </div>
  );
}
