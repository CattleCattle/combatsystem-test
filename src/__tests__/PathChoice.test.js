import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameProvider } from '../contexts/GameContext.js';
import PathChoice from '../components/game/PathChoice.jsx';

// Mock du contexte de jeu pour les tests
const renderWithGameProvider = (component) => {
  return render(
    <GameProvider>
      {component}
    </GameProvider>
  );
};

describe('PathChoice Component', () => {
  test('should render path choice screen with paths', () => {
    renderWithGameProvider(<PathChoice />);
    
    // Vérifier que l'en-tête est affiché
    expect(screen.getByText('🗺️ Carte du Donjon')).toBeInTheDocument();
    expect(screen.getByText(/Étage.*Choisissez votre chemin/)).toBeInTheDocument();
    
    // Vérifier que les chemins sont générés (pas d'affichage "Aucun chemin disponible")
    expect(screen.queryByText('Aucun chemin disponible')).not.toBeInTheDocument();
  });

  test('should display player team status', () => {
    renderWithGameProvider(<PathChoice />);
    
    // Vérifier que l'état de l'équipe est affiché
    expect(screen.getByText('État de votre équipe :')).toBeInTheDocument();
  });
});
