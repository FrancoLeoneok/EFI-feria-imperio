import { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatARS } from '../../utils/formatters';

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeCart}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white dark:bg-charcoal-800 shadow-2xl flex flex-col border-l border-sand-300 dark:border-charcoal-700 animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-sand-200 dark:border-charcoal-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta dark:bg-terracotta-900/40 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-charcoal-900 dark:text-white leading-tight">
                  Mi carrito
                </h3>
                <span className="text-xs text-charcoal-500 dark:text-sand-400">
                  {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} seleccionados
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-charcoal-500 hover:text-charcoal-800 dark:text-sand-400 dark:hover:text-white hover:bg-sand-100 dark:hover:bg-charcoal-700 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-charcoal-400 dark:text-sand-500">
                <ShoppingCart className="w-14 h-14 mb-3 text-sand-400 dark:text-charcoal-600 stroke-1" />
                <h4 className="text-base font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                  Tu carrito está vacío
                </h4>
                <p className="text-xs max-w-xs mb-6 text-charcoal-500 dark:text-sand-400">
                  Explorá el catálogo y sumá tus artesanías y delicias favoritas para presupuestar tu visita.
                </p>
                <a
                  href="/#tiendas"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta text-white font-bold text-xs shadow-sm hover:bg-terracotta-600 active:scale-95 transition-all"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.producto.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-sand-50 dark:bg-charcoal-700/50 border border-sand-200 dark:border-charcoal-700"
                >
                  <img
                    src={item.producto.imagenUrl}
                    alt={item.producto.titulo}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-sand-200 dark:bg-charcoal-800"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-forest dark:text-forest-300 uppercase tracking-wider block truncate">
                      {item.producto.ferianteNombre}
                    </span>
                    <h5 className="text-xs font-bold text-charcoal-900 dark:text-white truncate">
                      {item.producto.titulo}
                    </h5>
                    <span className="text-xs font-extrabold text-terracotta dark:text-terracotta-300 block mt-0.5">
                      {formatARS(item.producto.precio * item.cantidad)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                        className="p-1 rounded-md bg-sand-200 dark:bg-charcoal-600 text-charcoal-700 dark:text-sand-200 hover:bg-sand-300 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-charcoal-900 dark:text-white">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                        className="p-1 rounded-md bg-sand-200 dark:bg-charcoal-600 text-charcoal-700 dark:text-sand-200 hover:bg-sand-300 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.producto.id)}
                    className="p-2 text-charcoal-400 hover:text-red-500 transition-colors"
                    aria-label={`Eliminar ${item.producto.titulo} de la lista`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-sand-200 dark:border-charcoal-700 space-y-4 bg-sand-50/50 dark:bg-charcoal-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal-500 dark:text-sand-400">
                  Total Estimado
                </span>
                <span className="text-xl font-extrabold text-terracotta dark:text-terracotta-300">
                  {formatARS(totalPrice)}
                </span>
              </div>

              <div className="space-y-2">
                <a href="/checkout" target="_blank" rel="noopener noreferrer" onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-3 text-sm font-bold text-white hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">
                  Comprar <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">(abre en otra pestaña)</span>
                </a>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs font-semibold text-charcoal-500 dark:text-sand-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-center"
                >
                  Vaciar lista
                </button>
              </div>

              <p className="text-[10px] text-center text-charcoal-400 dark:text-sand-500 leading-tight">
                Revisá tu pedido y pagá por transferencia a cada tienda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
