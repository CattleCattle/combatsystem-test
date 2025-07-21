// Système d'inventaire simplifié pour éviter les problèmes d'import

export const ITEMS = [
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
];

export class SimpleInventory {
  constructor(maxSlots = 30) {
    this.maxSlots = maxSlots;
    this.slots = Array(maxSlots).fill(null).map(() => ({ item: null, quantity: 0 }));
  }

  addItem(itemId, quantity = 1) {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    if (item.stackable) {
      const existingSlot = this.slots.find(slot => 
        slot.item?.id === itemId && slot.quantity < item.maxStack
      );

      if (existingSlot) {
        const spaceAvailable = item.maxStack - existingSlot.quantity;
        const toAdd = Math.min(quantity, spaceAvailable);
        existingSlot.quantity += toAdd;
        quantity -= toAdd;
      }

      while (quantity > 0) {
        const emptySlot = this.slots.find(slot => slot.item === null);
        if (!emptySlot) return false;

        const toAdd = Math.min(quantity, item.maxStack);
        emptySlot.item = item;
        emptySlot.quantity = toAdd;
        quantity -= toAdd;
      }
    } else {
      for (let i = 0; i < quantity; i++) {
        const emptySlot = this.slots.find(slot => slot.item === null);
        if (!emptySlot) return false;

        emptySlot.item = item;
        emptySlot.quantity = 1;
      }
    }

    return true;
  }

  removeItem(itemId, quantity = 1) {
    const slotsWithItem = this.slots.filter(slot => slot.item?.id === itemId);
    if (slotsWithItem.length === 0) return false;

    let totalAvailable = slotsWithItem.reduce((sum, slot) => sum + slot.quantity, 0);
    if (totalAvailable < quantity) return false;

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

  getSlots() {
    return [...this.slots];
  }

  getItemsByType(type) {
    return this.slots.filter(slot => slot.item?.type === type && slot.quantity > 0);
  }

  getConsumables() {
    return this.getItemsByType('consumable');
  }
}

export function useItem(item, targetBoar, playerTeam) {
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
