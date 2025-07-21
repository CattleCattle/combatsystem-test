import React from 'react';
import { GameProvider, useGameContext } from '../../contexts/GameContext.js';
import { GAME_STATES } from '../../constants/gameData.js';
import MainMenu from './MainMenu.jsx';
import PathChoice from './PathChoice.jsx';
// import BattleScreen from './BattleScreen.jsx';
import { SwordFightBattleScreen } from './SwordFightBattleScreen.jsx';
import { SimpleSwordFightTest } from './SimpleSwordFightTest.jsx';
import UpgradeScreen from './UpgradeScreen.jsx';
import { VictoryScreen, GameOverScreen } from './GameEndScreens.jsx';
import InventoryScreen from './InventoryScreen.js';
import SimpleBoarEditor from './SimpleBoarEditor.js';
import SimpleTournamentMode from './SimpleTournamentMode.js';
import DebugPanel from '../debug/DebugPanel.jsx';
import EventModal from './EventModal.jsx';

function GameContent() {
  const { gameState } = useGameContext();

  switch (gameState.gameState) {
    case GAME_STATES.MENU:
      return <MainMenu />;
    case GAME_STATES.PATH_CHOICE:
      return <PathChoice />;
    case GAME_STATES.BATTLE:
      return <SwordFightBattleScreen />;
    case GAME_STATES.SWORDFIGHT_BATTLE:
      return <SwordFightBattleScreen />;
    case GAME_STATES.SWORDFIGHT_TEST:
      return <SimpleSwordFightTest />;
    case GAME_STATES.UPGRADE:
      return <UpgradeScreen />;
    case GAME_STATES.VICTORY:
      return <VictoryScreen />;
    case GAME_STATES.GAME_OVER:
      return <GameOverScreen />;
    case GAME_STATES.INVENTORY:
      return <InventoryScreen />;
    case GAME_STATES.BOAR_EDITOR:
      return <SimpleBoarEditor />;
    case GAME_STATES.TOURNAMENT:
      return <SimpleTournamentMode />;
    default:
      return <MainMenu />;
  }
}

export default function GameApp() {
  return (
    <GameProvider>
      <GameContent />
      <EventModal />
      <DebugPanel />
    </GameProvider>
  );
}
