// Système d'achievements du jeu

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  type: 'combat' | 'survival' | 'exploration' | 'progression';
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_victory',
    name: 'Premier Sang',
    description: 'Gagner votre premier combat',
    icon: '🗡️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'combat',
  },
  {
    id: 'floor_5',
    name: 'Explorateur',
    description: 'Atteindre l\'étage 5',
    icon: '🗺️',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    type: 'exploration',
  },
  {
    id: 'floor_10',
    name: 'Aventurier',
    description: 'Atteindre l\'étage 10',
    icon: '⛰️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    type: 'exploration',
  },
  {
    id: 'floor_20',
    name: 'Maître du Donjon',
    description: 'Atteindre l\'étage 20',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    type: 'exploration',
  },
  {
    id: 'no_deaths',
    name: 'Équipe Invincible',
    description: 'Survivre 10 étages sans perdre un sanglier',
    icon: '🛡️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    type: 'survival',
  },
  {
    id: 'defeat_boss',
    name: 'Tueur de Boss',
    description: 'Vaincre votre premier boss',
    icon: '💀',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'combat',
  },
  {
    id: 'heal_team',
    name: 'Soigneur Dévoué',
    description: 'Utiliser 50 sorts de soin',
    icon: '💚',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    type: 'combat',
  },
  {
    id: 'upgrade_master',
    name: 'Maître des Améliorations',
    description: 'Obtenir 25 améliorations',
    icon: '⬆️',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    type: 'progression',
  },
];

const ACHIEVEMENTS_KEY = 'boar_dungeon_achievements';

export function loadAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!saved) return [...ACHIEVEMENTS];
    
    const savedAchievements = JSON.parse(saved);
    
    // Fusionner avec les nouveaux achievements
    return ACHIEVEMENTS.map(achievement => {
      const saved = savedAchievements.find((s: Achievement) => s.id === achievement.id);
      return saved || achievement;
    });
  } catch (error) {
    console.error('Erreur lors du chargement des achievements:', error);
    return [...ACHIEVEMENTS];
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des achievements:', error);
  }
}

export function updateAchievement(
  achievements: Achievement[],
  id: string,
  progress: number
): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.id === id) {
      const newProgress = Math.min(achievement.maxProgress, achievement.progress + progress);
      const unlocked = newProgress >= achievement.maxProgress;
      
      return {
        ...achievement,
        progress: newProgress,
        unlocked: unlocked || achievement.unlocked,
      };
    }
    return achievement;
  });
}

export function checkAchievements(gameState: any, achievements: Achievement[]): Achievement[] {
  let updatedAchievements = [...achievements];
  
  // Vérifier les différents types d'achievements
  
  // Achievement étage
  const floorAchievements = ['floor_5', 'floor_10', 'floor_20'];
  floorAchievements.forEach(id => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement && gameState.currentFloor >= achievement.maxProgress) {
      updatedAchievements = updateAchievement(updatedAchievements, id, achievement.maxProgress);
    }
  });
  
  return updatedAchievements;
}
