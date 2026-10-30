import { useState } from 'react';
import { Eye, Sparkles, Store, ShoppingBag } from 'lucide-react';
import { Producto } from '../../types';
import { formatARS } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  producto: Producto;
  onVerDetalle: (producto: Producto) => void;
}

export const ProductCard = ({
  producto,
  onVerDetalle,
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="group flex flex-col bg-white dark:bg-charcoal-700 rounded-3xl border border-sand-300 dark:border-charcoal-600 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-sand-200 dark:bg-charcoal-800">
        {!imageError ? (
          <img
            src={producto.imagenUrl}
            alt={producto.titulo}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 dark:text-sand-500 p-4 text-center">
            <Store className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">Foto artesanal</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white shadow-xs">
            {producto.rubro}
          </span>

          {producto.destacado && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Destacado</span>
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <button
          onClick={() => onVerDetalle(producto)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 dark:bg-charcoal-800/90 text-charcoal-800 dark:text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label={`Ver detalles de ${producto.titulo}`}
          title="Ver detalles"
        >
          <Eye className="w-5 h-5 text-terracotta" />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Feriante / Puesto Tag */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-sand-400 mb-1.5">
            <Store className="w-3.5 h-3.5 text-forest" />
            <span className="font-semibold line-clamp-1">{producto.ferianteNombre}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onVerDetalle(producto)}
            className="text-base font-bold text-charcoal-900 dark:text-white line-clamp-2 hover:text-terracotta dark:hover:text-terracotta-300 cursor-pointer transition-colors leading-snug mb-2"
          >
            {producto.titulo}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-charcoal-600 dark:text-sand-300 line-clamp-2 mb-4">
            {producto.descripcion}
          </p>
        </div>

        {/* Footer Area: Price & Actions */}
        <div className="pt-3 border-t border-sand-200 dark:border-charcoal-600 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[11px] font-semibold text-charcoal-400 dark:text-sand-400">
              {producto.enStock ? 'Disponible' : 'Bajo Pedido'}
            </span>
            <span className="text-lg font-extrabold text-terracotta tracking-tight">
              {formatARS(producto.precio)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addItem(producto)}
              className="p-2 rounded-xl bg-sand-200 dark:bg-charcoal-600 hover:bg-terracotta hover:text-white dark:hover:bg-terracotta text-charcoal-700 dark:text-sand-200 active:scale-95 transition-all shadow-xs"
              title="Sumar a mi lista de compras"
              aria-label={`Sumar ${producto.titulo} a mi lista`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
