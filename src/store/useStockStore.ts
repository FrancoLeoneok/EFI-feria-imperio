import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StockState {
  disponibilidad: Record<string, boolean>;
  setDisponibilidad: (productoId: string, enStock: boolean) => void;
}

const storageKey = 'feria-imperio-stock';

export const useStockStore = create<StockState>()(
  persist(
    (set) => ({
      disponibilidad: {},
      setDisponibilidad: (productoId, enStock) =>
        set((state) => ({
          disponibilidad: { ...state.disponibilidad, [productoId]: enStock },
        })),
    }),
    { name: storageKey },
  ),
);

// Mantener sincronizada la tienda que se abre en otra pestaña.
window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage && (event.key === storageKey || event.key === null)) {
    void useStockStore.persist.rehydrate();
  }
});
