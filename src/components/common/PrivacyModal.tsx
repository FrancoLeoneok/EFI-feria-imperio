import { useEffect } from 'react';
import { X, ShieldCheck, Lock, UserCheck, Smartphone, Scale, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal = ({ isOpen, onClose }: PrivacyModalProps) => {
  // Manejo de la tecla Escape para cerrar el modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl border border-sand-300 dark:border-charcoal-700 overflow-hidden text-charcoal-900 dark:text-sand-100 animate-in zoom-in-95 duration-200 my-6 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="relative bg-gradient-to-br from-forest to-forest-700 px-6 py-5 text-white shrink-0 overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/25 text-[11px] font-bold tracking-wide uppercase">
                  Protección de Datos • Ley 25.326
                </span>
                <h2 id="privacy-modal-title" className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  Políticas de Privacidad
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar ventana de políticas"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/90 mt-2 relative z-10 font-medium">
            Feria Imperio Río Cuarto — Compromiso con la transparencia, la soberanía de datos y la economía local.
          </p>
        </div>

        {/* Contenido con scroll independiente */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm text-charcoal-700 dark:text-sand-200 leading-relaxed">
          {/* Introducción */}
          <div className="p-4 rounded-2xl bg-sand-100 dark:bg-charcoal-700/60 border border-sand-300 dark:border-charcoal-600">
            <p className="font-semibold text-charcoal-900 dark:text-white">
              En <strong className="text-terracotta">Feria Imperio</strong> promovemos la economía popular, artesanal y sustentable de Río Cuarto (Paseo del Andino y Parque Sarmiento). La privacidad de los artesanos y visitantes es un principio fundacional: no lucramos con datos personales ni utilizamos intermediarios comerciales.
            </p>
          </div>

          {/* Sección 1: Datos de Feriantes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-forest dark:text-forest-400 font-bold text-sm">
              <UserCheck className="w-4 h-4 shrink-0" />
              <h3>1. Información de Puestos y Postulaciones</h3>
            </div>
            <p className="text-charcoal-600 dark:text-sand-300">
              Los datos facilitados mediante el formulario de postulación (nombre, rubro de producción y descripción del puesto) se utilizan exclusivamente para validar la presencia ferial, coordinar las ubicaciones en los paseos y publicar el catálogo digital al público.
            </p>
          </div>

          {/* Sección 2: Almacenamiento Local (LocalStorage) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-forest dark:text-forest-400 font-bold text-sm">
              <Lock className="w-4 h-4 shrink-0" />
              <h3>2. Privacidad de Clientes y Presupuesto Simulado</h3>
            </div>
            <p className="text-charcoal-600 dark:text-sand-300">
              No exigimos registro ni contraseña a los visitantes para explorar el catálogo. Los artículos añadidos a "Mi Lista de Feria" y las preferencias de modo oscuro se guardan exclusivamente en la memoria local de su propio navegador (<code className="bg-sand-200 dark:bg-charcoal-600 px-1 py-0.5 rounded text-charcoal-800 dark:text-sand-100">localStorage</code>). No utilizamos cookies invasivas de rastreo de terceros.
            </p>
          </div>

          {/* Sección 3: Trato Directo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-forest dark:text-forest-400 font-bold text-sm">
              <Smartphone className="w-4 h-4 shrink-0" />
              <h3>3. Vínculo Directo sin Comisiones</h3>
            </div>
            <p className="text-charcoal-600 dark:text-sand-300">
              Feria Imperio no procesa cobros ni retiene pagos. Las condiciones de entrega, pago y garantía se pactan de forma bilateral entre el productor y el consumidor final.
            </p>
          </div>

          {/* Sección 4: Ley 25.326 y Derechos ARCO */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-forest dark:text-forest-400 font-bold text-sm">
              <Scale className="w-4 h-4 shrink-0" />
              <h3>4. Derechos de Acceso, Rectificación y Cancelación (Habeas Data)</h3>
            </div>
            <p className="text-charcoal-600 dark:text-sand-300">
              En conformidad con la <strong>Ley de Protección de Datos Personales N° 25.326 de la República Argentina</strong>, todo expositor o titular de datos tiene derecho a solicitar la rectificación, actualización o eliminación inmediata de su información pública de nuestro catálogo digital contactando al equipo coordinador.
            </p>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="bg-sand-200/70 dark:bg-charcoal-900/60 px-6 py-4 border-t border-sand-300 dark:border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-sand-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
            <span>Última revisión: Octubre 2026 • Río Cuarto</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all text-center"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
