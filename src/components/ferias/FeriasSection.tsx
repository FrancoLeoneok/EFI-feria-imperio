import { MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Feriante } from '../../types';

interface FeriasSectionProps {
  feriantes: Feriante[];
}

export const FeriasSection = ({ feriantes }: FeriasSectionProps) => {
  const feriantesConfirmados = feriantes.filter((f) => f.findeConfirmado);

  return (
    <section id="ferias" className="py-16 sm:py-24 border-t border-sand-300 dark:border-charcoal-700 bg-sand-100/50 dark:bg-charcoal-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold text-forest uppercase tracking-wider bg-forest-100 dark:bg-forest-900/40 px-3 py-1 rounded-full">
            Encuentros Presenciales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-white mt-3 mb-4">
            Paseos de Ferias en Río Cuarto
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 dark:text-sand-300">
            Conocé los dos grandes polos de encuentro donde los feriantes despliegan sus gazebos cada fin de semana.
          </p>
        </div>

        {/* Feria Cards (Andino & Sarmiento) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Paseo del Andino */}
          <div className="bg-white dark:bg-charcoal-700 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-charcoal-600 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-terracotta/10 text-terracotta dark:bg-terracotta-900/40 dark:text-terracotta-300">
                  Espacio Cultural y Ferial
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-forest">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activo</span>
                </span>
              </div>

              <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
                Paseo del Andino
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 leading-relaxed mb-6">
                Ubicado en el predio del ex ferrocarril, entre el galpón blanco, los rieles y el Museo del Riel. Feria de artesanos tradicionales, marroquinería y espectáculos al aire libre.
              </p>

              <div className="space-y-2.5 text-xs text-charcoal-700 dark:text-sand-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Bv. Ameghino y Rieles, Río Cuarto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest shrink-0" />
                  <span>Sábados, Domingos y Feriados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>16:00 a 22:00 hs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sand-200 dark:border-charcoal-600">
              <a
                href="https://maps.google.com/?q=Paseo+del+Andino+Rio+Cuarto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta hover:text-terracotta-600 transition-colors"
              >
                <span>Ver ubicación en Google Maps</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Parque Sarmiento */}
          <div className="bg-white dark:bg-charcoal-700 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-charcoal-600 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest/10 text-forest dark:bg-forest-900/40 dark:text-forest-300">
                  Pulmón Verde & Feria Familiar
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-forest">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activo</span>
                </span>
              </div>

              <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">
                Parque Sarmiento
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 leading-relaxed mb-6">
                El tradicional paseo de Banda Norte junto al lago y los tilos. Gran presencia de gastronomía casera regional, cerámica utilitaria, tablas de madera y plantas.
              </p>

              <div className="space-y-2.5 text-xs text-charcoal-700 dark:text-sand-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Av. Marcelo T. de Alvear, Banda Norte, Río Cuarto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest shrink-0" />
                  <span>Sábados y Domingos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>15:30 a 21:30 hs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sand-200 dark:border-charcoal-600">
              <a
                href="https://maps.google.com/?q=Parque+Sarmiento+Rio+Cuarto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-forest-600 transition-colors"
              >
                <span>Ver ubicación en Google Maps</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feriantes con "Finde Confirmado" */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white">
                Puestos con Presencia Confirmada este Fin de Semana
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-sand-400">
                Artesanos y emprendedores que estarán presencialmente con sus gazebos en feria.
              </p>
            </div>
            <span className="text-xs font-bold text-forest bg-forest-100 dark:bg-forest-900/40 px-3 py-1 rounded-full self-start sm:self-auto">
              {feriantesConfirmados.length} puestos listos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feriantesConfirmados.map((feriante) => (
              <div
                key={feriante.id}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-charcoal-700 border border-sand-300 dark:border-charcoal-600 shadow-xs hover:border-terracotta transition-colors"
              >
                <img
                  src={feriante.avatarUrl}
                  alt={feriante.nombreComercio}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 dark:text-white truncate">
                      {feriante.nombreComercio}
                    </h4>
                  </div>
                  <p className="text-[11px] text-charcoal-500 dark:text-sand-400 truncate">
                    {feriante.puestoNumero}
                  </p>
                  <span className="text-[10px] font-bold text-terracotta uppercase tracking-wide">
                    {feriante.rubroPrincipal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
