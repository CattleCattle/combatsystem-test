import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameProvider } from '../contexts/GameContext.js';
import BattleScreen from '../components/game/BattleScreen.jsx';

describe('BattleScreen Component', () => {
  test('should render battle screen without crashing', () => {
    expect(() => render(
      <GameProvider>
        <BattleScreen />
      </GameProvider>
    )).not.toThrow();
  });

  test('should render some battle elements', () => {
    render(
      <GameProvider>
        <BattleScreen />
      </GameProvider>
    );
    
    // Vérifier qu'il y a du contenu (au moins un div avec certaines classes)
    const battleContainer = document.querySelector('.min-h-screen');
    expect(battleContainer).toBeInTheDocument();
  });
});
