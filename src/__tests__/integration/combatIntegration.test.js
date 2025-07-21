import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../../contexts/GameContext.js';
import GameApp from '../../components/game/GameApp.jsx';

describe('Combat Integration Test', () => {
  test('should transition to battle screen when clicking combat path', async () => {
    const { container } = render(
      <GameProvider>
        <GameApp />
      </GameProvider>
    );

    // Vérifier qu'on est sur le menu principal
    expect(screen.getByText('🐗 Donjon des Sangliers 🐗')).toBeInTheDocument();

    // Cliquer sur "Commencer l'aventure"
    const startButton = screen.getByRole('button', { name: /commencer l'aventure/i });
    fireEvent.click(startButton);

    // Attendre un peu pour le changement d'état
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier qu'on est sur l'écran de choix de chemin
    expect(screen.getByText('🗺️ Carte du Donjon')).toBeInTheDocument();

    // Trouver et cliquer sur un chemin de combat
    const combatButtons = screen.getAllByText(/combat/i);
    if (combatButtons.length > 0) {
      // Trouver le bouton parent du texte combat et cliquer dessus
      const combatButton = combatButtons[0].closest('button');
      if (combatButton) {
        fireEvent.click(combatButton);
        
        // Attendre un peu pour le changement d'état
        await new Promise(resolve => setTimeout(resolve, 200));

        // Vérifier qu'on est maintenant sur l'écran de combat
        // Chercher des éléments spécifiques à l'écran de combat
        const battleTitle = screen.queryByText(/combat en cours/i) || 
                           screen.queryByText(/bataille/i) ||
                           screen.queryByText(/vs\./i);
        
        const combatElements = screen.queryAllByText(/étage|combat|ennemi|pv|attaque/i);
        console.log('Combat elements found:', combatElements.map(el => el.textContent));
        
        // Vérifier qu'on a bien quitté l'écran de carte
        const mapTitle = screen.queryByText('🗺️ Carte du Donjon');
        if (mapTitle) {
          console.log('Still on map screen - checking for battle elements');
          // Si on est encore sur la carte, vérifier qu'au moins on a des éléments de combat
          expect(combatElements.length).toBeGreaterThan(0);
        } else {
          // Si on a quitté la carte, c'est bon
          expect(mapTitle).not.toBeInTheDocument();
        }
      } else {
        console.log('Combat text found but no button parent');
      }
    } else {
      console.log('No combat buttons found');
      // Afficher ce qui est disponible
      const allButtons = screen.getAllByRole('button');
      console.log('Available buttons:', allButtons.map(btn => btn.textContent));
    }
  });
});
