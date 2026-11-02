import { Link } from 'react-router-dom';
import { Store, MapPin, ArrowRight } from 'lucide-react';
import { Feriante } from '../../types';

interface StoreCardProps {
  feriante: Feriante;
  conteoProductos?: number;
}

export const StoreCard = ({ feriante, conteoProductos }: StoreCardProps) => {
  const ubicacionTexto =
    feriante.ubicacionFeria === 'paseo_andino'
      ? 'Paseo del Andino'
      : feriante.ubicacionFeria === 'parque_sarmiento'
      ? 'Parque Sarmiento'
      : 'Andino & Sarmiento';

  return (
    <article className="group flex flex-col bg-white dark:bg-charcoal-700 rounded-3xl border border-sand-300 dark:border-charcoal-600 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
      {/* Banner de Portada */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-sand-200 dark:bg-charcoal-800">
        <img
          src={feriante.bannerUrl}
          alt={`Banner de ${feriante.nombreComercio}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white shadow-xs">
            {feriante.rubroPrincipal}
          </span>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="relative p-5 pt-0 flex-1 flex flex-col justify-between">
        {/* Avatar Superpuesto */}
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div className="relative">
            <img
              src={feriante.avatarUrl}
              alt={feriante.nombreResponsable}
              className="w-16 h-16 rounded-2xl object-cover border-3 border-white dark:border-charcoal-700 shadow-md bg-sand-200"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center shadow-xs">
              <Store className="w-3 h-3" />
            </div>
          </div>

          {conteoProductos !== undefined && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-sand-200 dark:bg-charcoal-600 text-charcoal-700 dark:text-sand-200">
              {conteoProductos} {conteoProductos === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>

        {/* Título y Datos */}
        <div>
          <h3 className="text-lg font-extrabold text-charcoal-900 dark:text-white leading-tight mb-1 group-hover:text-terracotta dark:group-hover:text-terracotta-300 transition-colors">
            {feriante.nombreComercio}
          </h3>
          <p className="text-xs font-semibold text-terracotta dark:text-terracotta-300 mb-2">
            Por {feriante.nombreResponsable}
          </p>

          <p className="text-xs text-charcoal-600 dark:text-sand-300 line-clamp-2 leading-relaxed mb-4">
            {feriante.bio}
          </p>

          {/* Ubicación Física del Puesto */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-sand-400 bg-sand-100 dark:bg-charcoal-800/70 p-2 rounded-xl mb-4">
            <MapPin className="w-3.5 h-3.5 text-forest dark:text-forest-300 shrink-0" />
            <span className="truncate font-medium">
              {ubicacionTexto} • {feriante.puestoNumero}
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-3 border-t border-sand-200 dark:border-charcoal-600 flex items-center justify-between gap-2">
          <Link
            to={`/tienda/${feriante.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
          >
            <span>Ver Tienda & Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
