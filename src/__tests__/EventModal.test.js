import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../contexts/GameContext.js';
import EventModal from '../components/game/EventModal.jsx';

const renderWithGameProvider = (component) => {
  return render(
    <GameProvider>
      {component}
    </GameProvider>
  );
};

describe('EventModal Component', () => {
  test('should not render when modal is not visible', () => {
    const { container } = renderWithGameProvider(<EventModal />);
    expect(container.firstChild).toBeNull();
  });

  test('should render modal content when visible', () => {
    // Pour ce test, nous aurions besoin de mock le contexte avec une modale visible
    // C'est un test de base pour vérifier que le composant se charge sans erreur
    expect(() => renderWithGameProvider(<EventModal />)).not.toThrow();
  });
});
