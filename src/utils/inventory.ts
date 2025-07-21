// Système d'inventaire et d'objets pour le jeu

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'consumable' | 'equipment' | 'artifact' | 'material';
  stackable: boolean;
  maxStack: number;
  effects: ItemEffect[];
}

export interface ItemEffect {
  type: 'heal' | 'buff_attack' | 'buff_defense' | 'buff_speed' | 'damage' | 'revive' | 'heal_team';
  value: number;
  duration?: number; // en tours, pour les buffs temporaires
  target: 'self' | 'team' | 'enemy';
}

export interface InventorySlot {
  item: Item | null;
  quantity: number;
}

export const ITEMS: Item[] = [
  {
    id: 'health_potion',
    name: 'Potion de Soin',
    description: 'Restaure 50 PV à un sanglier',
    icon: '🧪',
    rarity: 'common',
    type: 'consumable',
    stackable: true,
    maxStack: 99,
    effects: [{ type: 'heal', value: 50, target: 'self' }],
  },
  {
    id: 'mega_health_potion',
    name: 'Méga Potion de Soin',
    description: 'Restaure 100 PV à un sanglier',
    icon: '🍶',
    rarity: 'uncommon',
    type: 'consumable',
    stackable: true,
    maxStack: 50,
    effects: [{ type: 'heal', value: 100, target: 'self' }],
  },
  {
    id: 'team_heal_potion',
    name: 'Potion de Soin d\'Équipe',
    description: 'Restaure 30 PV à toute l\'équipe',
    icon: '🏺',
    rarity: 'rare',
    type: 'consumable',
    stackable: true,
    maxStack: 20,
    effects: [{ type: 'heal_team', value: 30, target: 'team' }],
  },
  {
    id: 'strength_potion',
    name: 'Potion de Force',
    description: 'Augmente l\'attaque de 10 pour 3 tours',
    icon: '💪',
    rarity: 'uncommon',
    type: 'consumable',
    stackable: true,
    maxStack: 30,
    effects: [{ type: 'buff_attack', value: 10, duration: 3, target: 'self' }],
  },
  {
    id: 'shield_potion',
    name: 'Potion de Bouclier',
    description: 'Augmente la défense de 8 pour 3 tours',
    icon: '🛡️',
    rarity: 'uncommon',
    type: 'consumable',
    stackable: true,
    maxStack: 30,
    effects: [{ type: 'buff_defense', value: 8, duration: 3, target: 'self' }],
  },
  {
    id: 'speed_potion',
    name: 'Potion de Vitesse',
    description: 'Augmente la vitesse de 15 pour 3 tours',
    icon: '💨',
    rarity: 'uncommon',
    type: 'consumable',
    stackable: true,
    maxStack: 30,
    effects: [{ type: 'buff_speed', value: 15, duration: 3, target: 'self' }],
  },
  {
    id: 'revive_crystal',
    name: 'Cristal de Résurrection',
    description: 'Ressuscite un sanglier KO avec 50% de ses PV',
    icon: '💎',
    rarity: 'epic',
    type: 'consumable',
    stackable: true,
    maxStack: 5,
    effects: [{ type: 'revive', value: 0.5, target: 'self' }],
  },
  {
    id: 'ancient_charm',
    name: 'Charme Antique',
    description: 'Artefact mystérieux qui augmente l\'expérience gagnée',
    icon: '🔮',
    rarity: 'legendary',
    type: 'artifact',
    stackable: false,
    maxStack: 1,
    effects: [], // Effet passif géré ailleurs
  },
  {
    id: 'iron_tusk',
    name: 'Défense de Fer',
    description: 'Équipement qui augmente définitivement la défense de 5',
    icon: '🦷',
    rarity: 'rare',
    type: 'equipment',
    stackable: false,
    maxStack: 1,
    effects: [{ type: 'buff_defense', value: 5, target: 'self' }],
  },
  {
    id: 'crystal_horn',
    name: 'Corne de Cristal',
    description: 'Équipement qui augmente définitivement l\'attaque de 8',
    icon: '🔶',
    rarity: 'epic',
    type: 'equipment',
    stackable: false,
    maxStack: 1,
    effects: [{ type: 'buff_attack', value: 8, target: 'self' }],
  },
];

export class Inventory {
  private slots: InventorySlot[];
  private maxSlots: number;

  constructor(maxSlots: number = 30) {
    this.maxSlots = maxSlots;
    this.slots = Array(maxSlots).fill(null).map(() => ({ item: null, quantity: 0 }));
  }

  addItem(itemId: string, quantity: number = 1): boolean {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    if (item.stackable) {
      // Essayer d'ajouter à un slot existant
      const existingSlot = this.slots.find(slot => 
        slot.item?.id === itemId && slot.quantity < item.maxStack
      );

      if (existingSlot) {
        const spaceAvailable = item.maxStack - existingSlot.quantity;
        const toAdd = Math.min(quantity, spaceAvailable);
        existingSlot.quantity += toAdd;
        quantity -= toAdd;
      }

      // Si il reste des objets, utiliser de nouveaux slots
      while (quantity > 0) {
        const emptySlot = this.slots.find(slot => slot.item === null);
        if (!emptySlot) return false; // Plus de place

        const toAdd = Math.min(quantity, item.maxStack);
        emptySlot.item = item;
        emptySlot.quantity = toAdd;
        quantity -= toAdd;
      }
    } else {
      // Objet non stackable
      for (let i = 0; i < quantity; i++) {
        const emptySlot = this.slots.find(slot => slot.item === null);
        if (!emptySlot) return false;

        emptySlot.item = item;
        emptySlot.quantity = 1;
      }
    }

    return true;
  }

  removeItem(itemId: string, quantity: number = 1): boolean {
    const slotsWithItem = this.slots.filter(slot => slot.item?.id === itemId);
    if (slotsWithItem.length === 0) return false;

    let totalAvailable = slotsWithItem.reduce((sum, slot) => sum + slot.quantity, 0);
    if (totalAvailable < quantity) return false;

    // Retirer des slots en commençant par la fin
    for (let i = slotsWithItem.length - 1; i >= 0 && quantity > 0; i--) {
      const slot = slotsWithItem[i];
      const toRemove = Math.min(quantity, slot.quantity);
      
      slot.quantity -= toRemove;
      quantity -= toRemove;

      if (slot.quantity === 0) {
        slot.item = null;
      }
    }

    return true;
  }

  hasItem(itemId: string, quantity: number = 1): boolean {
    const totalQuantity = this.slots
      .filter(slot => slot.item?.id === itemId)
      .reduce((sum, slot) => sum + slot.quantity, 0);
    
    return totalQuantity >= quantity;
  }

  getItemQuantity(itemId: string): number {
    return this.slots
      .filter(slot => slot.item?.id === itemId)
      .reduce((sum, slot) => sum + slot.quantity, 0);
  }

  getSlots(): InventorySlot[] {
    return [...this.slots];
  }

  getItemsByType(type: Item['type']): InventorySlot[] {
    return this.slots.filter(slot => slot.item?.type === type && slot.quantity > 0);
  }

  getConsumables(): InventorySlot[] {
    return this.getItemsByType('consumable');
  }

  isEmpty(): boolean {
    return this.slots.every(slot => slot.item === null);
  }

  isFull(): boolean {
    return this.slots.every(slot => slot.item !== null);
  }

  clear(): void {
    this.slots.forEach(slot => {
      slot.item = null;
      slot.quantity = 0;
    });
  }

  serialize(): string {
    const data = this.slots
      .filter(slot => slot.item !== null)
      .map(slot => ({
        itemId: slot.item!.id,
        quantity: slot.quantity,
      }));
    
    return JSON.stringify(data);
  }

  deserialize(data: string): void {
    try {
      const items = JSON.parse(data);
      this.clear();
      
      items.forEach((itemData: any) => {
        this.addItem(itemData.itemId, itemData.quantity);
      });
    } catch (error) {
      console.error('Erreur lors de la désérialisation de l\'inventaire:', error);
    }
  }
}

// Fonction pour utiliser un objet
export function useItem(item: Item, targetBoar: any, playerTeam: any[]): { success: boolean; message: string; updatedTeam: any[] } {
  let updatedTeam = [...playerTeam];
  let message = '';
  let success = false;

  item.effects.forEach(effect => {
    switch (effect.type) {
      case 'heal':
        if (targetBoar.hp < targetBoar.maxHp) {
          const healAmount = Math.min(effect.value, targetBoar.maxHp - targetBoar.hp);
          updatedTeam = updatedTeam.map(boar =>
            boar.id === targetBoar.id
              ? { ...boar, hp: boar.hp + healAmount }
              : boar
          );
          message = `${targetBoar.name} récupère ${healAmount} PV !`;
          success = true;
        } else {
          message = `${targetBoar.name} a déjà tous ses PV !`;
        }
        break;

      case 'heal_team':
        let totalHealed = 0;
        updatedTeam = updatedTeam.map(boar => {
          const healAmount = Math.min(effect.value, boar.maxHp - boar.hp);
          totalHealed += healAmount;
          return { ...boar, hp: boar.hp + healAmount };
        });
        message = `L'équipe récupère ${totalHealed} PV au total !`;
        success = totalHealed > 0;
        break;

      case 'revive':
        if (targetBoar.hp === 0) {
          const reviveHp = Math.floor(targetBoar.maxHp * effect.value);
          updatedTeam = updatedTeam.map(boar =>
            boar.id === targetBoar.id
              ? { ...boar, hp: reviveHp }
              : boar
          );
          message = `${targetBoar.name} est ressuscité avec ${reviveHp} PV !`;
          success = true;
        } else {
          message = `${targetBoar.name} n'est pas KO !`;
        }
        break;

      // Les buffs temporaires seraient gérés par le système de combat
      case 'buff_attack':
      case 'buff_defense':
      case 'buff_speed':
        message = `${targetBoar.name} reçoit un bonus temporaire !`;
        success = true;
        break;
    }
  });

  return { success, message, updatedTeam };
}
