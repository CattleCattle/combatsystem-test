import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../../contexts/GameContext.js';
import GameApp from '../../components/game/GameApp.jsx';

describe('Event Modal Integration', () => {
  test('should render GameApp with EventModal without errors', () => {
    expect(() => render(
      <GameProvider>
        <GameApp />
      </GameProvider>
    )).not.toThrow();
  });

  test('should show main menu initially', () => {
    render(
      <GameProvider>
        <GameApp />
      </GameProvider>
    );
    
    expect(screen.getByText('🐗 Donjon des Sangliers 🐗')).toBeInTheDocument();
  });
});
