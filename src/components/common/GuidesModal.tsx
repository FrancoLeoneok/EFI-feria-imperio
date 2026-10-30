import { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Store,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export type GuideTab = 'usuario' | 'feriante';

interface GuidesModalProps {
  isOpen: boolean;
  initialTab?: GuideTab;
  onClose: () => void;
}

export const GuidesModal = ({
  isOpen,
  initialTab = 'usuario',
  onClose,
}: GuidesModalProps) => {
  const [activeTab, setActiveTab] = useState<GuideTab>(initialTab);

  // Sincronizar tab inicial cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialTab]);

  // Manejo de la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guides-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl border border-sand-300 dark:border-charcoal-700 overflow-hidden text-charcoal-900 dark:text-sand-100 animate-in zoom-in-95 duration-200 my-6 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="relative bg-gradient-to-br from-terracotta to-terracotta-700 px-6 py-5 text-white shrink-0 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-white">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/25 text-[11px] font-bold tracking-wide uppercase">
                  Centro de Ayuda • Feria Imperio
                </span>
                <h2 id="guides-modal-title" className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  Guías de la Feria
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar ventana de guías"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de Pestañas (Tabs) */}
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <button
              type="button"
              onClick={() => setActiveTab('usuario')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'usuario'
                  ? 'bg-white text-terracotta shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Guía de Usuario (Visitantes)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('feriante')}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'feriante'
                  ? 'bg-white text-terracotta shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Guía de Feriante (Artesanos)</span>
            </button>
          </div>
        </div>

        {/* Contenido Dinámico según la Pestaña Activa */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {activeTab === 'usuario' ? (
            /* ================= GUÍA DE USUARIO ================= */
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-sand-100 dark:bg-charcoal-700/60 border border-sand-300 dark:border-charcoal-600">
                <p className="text-xs sm:text-sm text-charcoal-800 dark:text-sand-100 font-medium">
                  Bienvenido al catálogo digital de <strong>Feria Imperio</strong>. Esta guía te orienta para descubrir creaciones locales, armar presupuestos y conectar directamente con los artesanos del Paseo del Andino y Parque Sarmiento.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paso 1 */}
                <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-terracotta font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h4>Explorá Tiendas y Rubros</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Utilizá los filtros por rubro (cerámica, madera, marroquinería, indumentaria, gastronomía) o la barra de búsqueda para encontrar rápidamente a tus artesanos favoritos.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-forest dark:text-forest-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-forest text-white text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h4>Consultá Paseos y Presencia</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Identificá la insignia <span className="inline-flex items-center gap-1 font-semibold text-forest"><Calendar className="w-3 h-3 inline" /> Finde Confirmado</span> para saber con certeza qué emprendedores estarán en el Paseo del Andino o Parque Sarmiento este fin de semana.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-terracotta font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h4>Armá "Mi Lista de Feria"</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Hacé clic en el ícono de bolsa de compras en cualquier producto para agregarlo a tu presupuesto simulado. Podrás ver los subtotales calculados antes de coordinar tu compra.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ================= GUÍA DE FERIANTE ================= */
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-800/60">
                <p className="text-xs sm:text-sm text-forest-900 dark:text-forest-200 font-medium">
                  Guía oficial para emprendedores y artesanos registrados en <strong>Feria Imperio</strong>. Conocé cómo gestionar tu puesto, mantener actualizado tu stock y visibilizar tus creaciones ante toda la ciudad de Río Cuarto.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paso 1 */}
                <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-forest dark:text-forest-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-forest text-white text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h4>Ingreso a "Mi Taller"</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Hacé clic en el botón <strong className="text-charcoal-900 dark:text-white">"Iniciar Sesión"</strong> ubicado en la barra superior. Ingresá con tu nombre de responsable o comercio y tu contraseña ferial asignada.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-terracotta font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h4>Control de Stock y Disponibilidad</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Dentro de tu panel de administración podés alternar con un solo clic si una pieza está <span className="font-semibold text-emerald-600 dark:text-emerald-400">En Stock</span> o si se produce <span className="font-semibold text-amber-600 dark:text-amber-400">Bajo Pedido</span>.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-forest dark:text-forest-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-forest text-white text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h4>Actualización Rápida de Precios</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Modificá tus precios en pesos argentinos al instante para que tus clientes siempre vean los valores actualizados antes de consultarte en la feria.
                  </p>
                </div>

                {/* Paso 4 */}
                <div className="p-4 rounded-2xl bg-sand-50 dark:bg-charcoal-700/40 border border-sand-200 dark:border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2.5 text-terracotta font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs flex items-center justify-center shrink-0">
                      4
                    </span>
                    <h4>Tu Enlace Público Único</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-sand-300 leading-relaxed">
                    Cada puesto dispone de una URL propia (<code className="bg-sand-200 dark:bg-charcoal-600 px-1 py-0.5 rounded text-[11px]">/tienda/:id</code>) que podés colocar en la bio de tu Instagram o enviar por mensaje directo a tus clientes.
                  </p>
                </div>
              </div>

              {/* Registro para nuevos puestos */}
              <div className="p-4 rounded-2xl bg-sand-100 dark:bg-charcoal-700/60 border border-sand-300 dark:border-charcoal-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-charcoal-700 dark:text-sand-300">
                  <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
                  <span>¿Aún no tenés tu puesto dado de alta en la plataforma?</span>
                </div>
                <a
                  href="/#contacto"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shrink-0 transition-all active:scale-95"
                >
                  <span>Postular mi Puesto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="bg-sand-200/70 dark:bg-charcoal-900/60 px-6 py-4 border-t border-sand-300 dark:border-charcoal-700 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-sand-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
            <span>Feria Imperio • Economía Social de Río Cuarto</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all text-center"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
