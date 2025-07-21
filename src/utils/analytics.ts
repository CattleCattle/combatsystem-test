// Système d'analytics pour le jeu

interface GameEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

class GameAnalytics {
  private events: GameEvent[] = [];
  private sessionId: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('game_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des analytics:', error);
    }
  }

  private saveToStorage(): void {
    try {
      // Garder seulement les 1000 derniers événements
      const eventsToSave = this.events.slice(-1000);
      localStorage.setItem('game_analytics_events', JSON.stringify(eventsToSave));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des analytics:', error);
    }
  }

  track(type: string, data: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const event: GameEvent = {
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.saveToStorage();

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', event);
    }
  }

  // Événements spécifiques au jeu
  trackGameStart(): void {
    this.track('game_start', {
      version: '1.0.0',
      userAgent: navigator.userAgent,
    });
  }

  trackGameEnd(floor: number, reason: 'victory' | 'defeat'): void {
    this.track('game_end', {
      floor,
      reason,
      duration: Date.now() - this.getSessionStartTime(),
    });
  }

  trackFloorComplete(floor: number, path: string): void {
    this.track('floor_complete', {
      floor,
      path,
    });
  }

  trackCombatStart(floor: number, enemyType: string): void {
    this.track('combat_start', {
      floor,
      enemyType,
    });
  }

  trackCombatEnd(floor: number, result: 'victory' | 'defeat', duration: number): void {
    this.track('combat_end', {
      floor,
      result,
      duration,
    });
  }

  trackUpgrade(boarId: number, upgradeType: string): void {
    this.track('upgrade_applied', {
      boarId,
      upgradeType,
    });
  }

  trackError(error: string, context?: Record<string, any>): void {
    this.track('error', {
      error,
      context,
    });
  }

  // Méthodes d'analyse
  getPlayTime(): number {
    const gameStartEvents = this.events.filter(e => e.type === 'game_start');
    const gameEndEvents = this.events.filter(e => e.type === 'game_end');
    
    let totalTime = 0;
    gameStartEvents.forEach((start, index) => {
      const end = gameEndEvents[index];
      if (end) {
        totalTime += end.timestamp - start.timestamp;
      }
    });
    
    return totalTime;
  }

  getSessionStartTime(): number {
    const sessionEvents = this.events.filter(e => e.sessionId === this.sessionId);
    return sessionEvents.length > 0 ? sessionEvents[0].timestamp : Date.now();
  }

  getStatistics() {
    const stats = {
      totalGames: this.events.filter(e => e.type === 'game_start').length,
      totalFloors: this.events.filter(e => e.type === 'floor_complete').length,
      totalCombats: this.events.filter(e => e.type === 'combat_start').length,
      victories: this.events.filter(e => e.type === 'game_end' && e.data.reason === 'victory').length,
      defeats: this.events.filter(e => e.type === 'game_end' && e.data.reason === 'defeat').length,
      totalPlayTime: this.getPlayTime(),
      averageFloorReached: 0,
    };

    const gameEndEvents = this.events.filter(e => e.type === 'game_end');
    if (gameEndEvents.length > 0) {
      const totalFloors = gameEndEvents.reduce((sum, event) => sum + (event.data.floor || 0), 0);
      stats.averageFloorReached = totalFloors / gameEndEvents.length;
    }

    return stats;
  }

  getMostUsedPaths(): { [path: string]: number } {
    const pathEvents = this.events.filter(e => e.type === 'floor_complete');
    const pathCounts: { [path: string]: number } = {};
    
    pathEvents.forEach(event => {
      const path = event.data.path || 'unknown';
      pathCounts[path] = (pathCounts[path] || 0) + 1;
    });
    
    return pathCounts;
  }

  getMostUsedUpgrades(): { [upgrade: string]: number } {
    const upgradeEvents = this.events.filter(e => e.type === 'upgrade_applied');
    const upgradeCounts: { [upgrade: string]: number } = {};
    
    upgradeEvents.forEach(event => {
      const upgrade = event.data.upgradeType || 'unknown';
      upgradeCounts[upgrade] = (upgradeCounts[upgrade] || 0) + 1;
    });
    
    return upgradeCounts;
  }

  // Configuration
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  clearData(): void {
    this.events = [];
    localStorage.removeItem('game_analytics_events');
  }

  exportData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      events: this.events,
      statistics: this.getStatistics(),
    }, null, 2);
  }
}

// Instance globale
export const gameAnalytics = new GameAnalytics();

// Hook React pour l'analytics
import { useEffect } from 'react';

export function useGameAnalytics() {
  useEffect(() => {
    // Tracker le début de session
    gameAnalytics.track('session_start');
    
    // Cleanup à la fermeture
    const handleBeforeUnload = () => {
      gameAnalytics.track('session_end');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      gameAnalytics.track('session_end');
    };
  }, []);

  return {
    track: gameAnalytics.track.bind(gameAnalytics),
    trackGameStart: gameAnalytics.trackGameStart.bind(gameAnalytics),
    trackGameEnd: gameAnalytics.trackGameEnd.bind(gameAnalytics),
    trackFloorComplete: gameAnalytics.trackFloorComplete.bind(gameAnalytics),
    trackCombatStart: gameAnalytics.trackCombatStart.bind(gameAnalytics),
    trackCombatEnd: gameAnalytics.trackCombatEnd.bind(gameAnalytics),
    trackUpgrade: gameAnalytics.trackUpgrade.bind(gameAnalytics),
    trackError: gameAnalytics.trackError.bind(gameAnalytics),
    getStatistics: gameAnalytics.getStatistics.bind(gameAnalytics),
  };
}
