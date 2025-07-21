import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../contexts/GameContext.js';
import MainMenu from '../components/game/MainMenu.jsx';
import { INITIAL_PLAYER_TEAM } from '../constants/gameData.js';

// Mock du contexte de jeu pour les tests
const renderWithGameProvider = (component) => {
  return render(
    <GameProvider>
      {component}
    </GameProvider>
  );
};

describe('MainMenu Component', () => {
  test('should render main menu with title', () => {
    renderWithGameProvider(<MainMenu />);
    
    expect(screen.getByText('🐗 Donjon des Sangliers 🐗')).toBeInTheDocument();
    expect(screen.getByText('Un roguelite de combat au tour par tour')).toBeInTheDocument();
  });

  test('should display player team information', () => {
    renderWithGameProvider(<MainMenu />);
    
    INITIAL_PLAYER_TEAM.forEach(boar => {
      expect(screen.getByText(boar.name)).toBeInTheDocument();
    });
  });

  test('should render start game button', () => {
    renderWithGameProvider(<MainMenu />);
    
    const startButton = screen.getByRole('button', { name: /commencer l'aventure/i });
    expect(startButton).toBeInTheDocument();
  });

  test('should display game instructions', () => {
    renderWithGameProvider(<MainMenu />);
    
    expect(screen.getByText(/dirigez une équipe de 3 sangliers/i)).toBeInTheDocument();
    expect(screen.getByText(/choisissez votre chemin entre les combats/i)).toBeInTheDocument();
    expect(screen.getByText(/créez vos sangliers personnalisés/i)).toBeInTheDocument();
    expect(screen.getByText(/participez aux tournois pour gagner de l'or/i)).toBeInTheDocument();
  });

  test('should display team stats correctly', () => {
    renderWithGameProvider(<MainMenu />);
    
    // Vérifier que les stats sont affichées
    expect(screen.getByText(/PV: 100 \| ATT: 25 \| DEF: 15/)).toBeInTheDocument(); // Sanglier Alpha
    expect(screen.getByText(/PV: 80 \| ATT: 30 \| DEF: 12/)).toBeInTheDocument(); // Sanglier Guerrier
    expect(screen.getByText(/PV: 70 \| ATT: 18 \| DEF: 20/)).toBeInTheDocument(); // Sanglier Soigneur
  });
});
