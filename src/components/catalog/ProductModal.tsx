import { useEffect } from 'react';
import { X, Store, Check, MapPin, Tag, ShoppingBag } from 'lucide-react';
import { Producto } from '../../types';
import { formatARS } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
  ferianteUbicacion?: string;
}

export const ProductModal = ({
  producto,
  onClose,
  ferianteUbicacion = 'Paseo del Andino / Parque Sarmiento',
}: ProductModalProps) => {
  const addItem = useCartStore((state) => state.addItem);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (producto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [producto, onClose]);

  if (!producto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl border border-sand-300 dark:border-charcoal-700 overflow-hidden animate-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-charcoal-700/80 text-charcoal-700 dark:text-sand-200 hover:bg-white dark:hover:bg-charcoal-600 shadow-md transition-all focus:outline-none"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-sand-200 dark:bg-charcoal-900">
            <img
              src={producto.imagenUrl}
              alt={producto.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                {producto.rubro}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Feriante & Location */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-forest dark:text-forest-400">
                  <Store className="w-4 h-4" />
                  <span>{producto.ferianteNombre}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-charcoal-500 dark:text-sand-400">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{ferianteUbicacion}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 dark:text-white leading-snug mb-3">
                {producto.titulo}
              </h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-terracotta">
                  {formatARS(producto.precio)}
                </span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sand-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-300">
                  {producto.enStock ? 'En Stock para entrega inmediata' : 'Hecho bajo pedido'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 leading-relaxed mb-6">
                {producto.descripcion}
              </p>

              {/* Specifications if present */}
              {producto.especificaciones && (
                <div className="mb-6 bg-sand-100 dark:bg-charcoal-700/60 p-3.5 rounded-2xl border border-sand-200 dark:border-charcoal-600">
                  <h4 className="text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-terracotta" />
                    <span>Ficha Artesanal</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-charcoal-600 dark:text-sand-300">
                    {Object.entries(producto.especificaciones).map(([key, val]) => (
                      <li key={key} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                        <span>
                          <strong>{key}:</strong> {val}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Direct Actions: Add to Cart */}
            <div className="pt-4 border-t border-sand-200 dark:border-charcoal-700 space-y-2.5">
              <button
                onClick={() => {
                  addItem(producto);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-sand-200 dark:bg-charcoal-700 hover:bg-terracotta hover:text-white dark:hover:bg-terracotta text-charcoal-800 dark:text-sand-100 font-bold text-sm shadow-xs active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Sumar a mi Lista de Feria</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
