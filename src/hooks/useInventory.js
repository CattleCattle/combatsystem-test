import { useEffect, useState } from 'react';
import { SimpleInventory } from '../utils/simpleInventory';

export function useInventory() {
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    // Initialiser l'inventaire côté client uniquement
    if (typeof window !== 'undefined') {
      setInventory(new SimpleInventory());
    }
  }, []);

  return inventory;
}
