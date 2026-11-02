import { customerPrice, roundMoney } from '../utils/pricing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Producto } from '../types';
import { useStockStore } from './useStockStore';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartStore {
  revision: string;
  items: CartItem[];
  isOpen: boolean;
  addItem: (producto: Producto) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      revision: 'initial',
      isOpen: false,

      addItem: (producto: Producto) => {
        if (!(useStockStore.getState().disponibilidad[producto.id] ?? producto.enStock)) return;
        set((state) => {
          const existing = state.items.find((item) => item.producto.id === producto.id);
          if (existing) {
            return {
              revision: crypto.randomUUID(),
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            revision: crypto.randomUUID(),
            items: [...state.items, { producto, cantidad: 1 }],
            isOpen: true,
          };
        });
      },

      removeItem: (productoId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== productoId),
          revision: crypto.randomUUID(),
        }));
      },

      updateQuantity: (productoId: string, cantidad: number) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }
        set((state) => ({
          revision: crypto.randomUUID(),
          items: state.items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], revision: crypto.randomUUID() });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      getTotalPrice: () => {
        return roundMoney(get().items.reduce(
          (total, item) => total + customerPrice(item.producto.precio) * item.cantidad,
          0
        ));
      },
    }),
    {
      name: 'feria_imperio_cart',
      // Uploaded photos already live in IndexedDB. Duplicating a cover and its
      // gallery here can exceed localStorage and silently lose cross-tab items.
      partialize: ({ items, revision }) => ({
        revision,
        items: items.map(({ producto, cantidad }) => ({
          cantidad,
          producto: {
            ...producto,
            imagenUrl: producto.imagenUrl.startsWith('data:') ? '' : producto.imagenUrl,
            imagenes: undefined,
          },
        })),
      }),
    }
  )
);

window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage && (event.key === 'feria_imperio_cart' || event.key === null)) {
    void useCartStore.persist.rehydrate();
  }
});
