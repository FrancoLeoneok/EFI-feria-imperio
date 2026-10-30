import { AlertTriangle, RotateCcw, SearchX } from 'lucide-react';
import { Producto, UIStatus } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  productos: Producto[];
  status: UIStatus;
  errorMessage?: string;
  onRetry?: () => void;
  onResetFilters?: () => void;
  onVerDetalle: (producto: Producto) => void;
}

export const ProductGrid = ({
  productos,
  status,
  errorMessage = 'Ocurrió un error al cargar los productos del catálogo.',
  onRetry,
  onResetFilters,
  onVerDetalle,
}: ProductGridProps) => {
  // 1. Estado Loading (Skeletons)
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-charcoal-700 rounded-3xl border border-sand-300 dark:border-charcoal-600 overflow-hidden shadow-card p-4 space-y-4 animate-pulse"
          >
            <div className="w-full aspect-square bg-sand-200 dark:bg-charcoal-600 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-3 w-1/3 bg-sand-200 dark:bg-charcoal-600 rounded" />
              <div className="h-5 w-4/5 bg-sand-300 dark:bg-charcoal-500 rounded" />
              <div className="h-3 w-full bg-sand-200 dark:bg-charcoal-600 rounded" />
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-sand-200 dark:border-charcoal-600">
              <div className="h-6 w-1/3 bg-terracotta-200 dark:bg-terracotta-900/40 rounded" />
              <div className="h-8 w-20 bg-sand-300 dark:bg-charcoal-600 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Estado Error
  if (status === 'error') {
    return (
      <div className="p-8 sm:p-12 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">
          No pudimos conectar con el catálogo
        </h3>
        <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mb-6">
          {errorMessage}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar carga</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Estado Vacío (Empty State)
  if (status === 'empty' || productos.length === 0) {
    return (
      <div className="p-10 sm:p-16 text-center bg-white dark:bg-charcoal-700 border border-sand-300 dark:border-charcoal-600 rounded-3xl max-w-xl mx-auto my-8 shadow-card">
        <div className="w-16 h-16 rounded-3xl bg-sand-200 dark:bg-charcoal-600 text-charcoal-400 dark:text-sand-400 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-terracotta" />
        </div>
        <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">
          No encontramos artesanías coincidentes
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 mb-6 max-w-sm mx-auto">
          Probá buscando con otro término o seleccioná otro rubro ferial.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ver todos los productos</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Estado Success (Render con datos)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onVerDetalle={onVerDetalle}
        />
      ))}
    </div>
  );
};
