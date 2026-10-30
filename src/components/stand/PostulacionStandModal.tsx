import { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePostulacionStore } from '../../store/usePostulacionStore';
import { Rubro, UbicacionFeria } from '../../types';
import { formatARS } from '../../utils/formatters';

interface PostulacionStandModalProps {
  onShowToast?: (type: 'success' | 'error', title: string, message: string) => void;
}

export const PostulacionStandModal = ({ onShowToast }: PostulacionStandModalProps) => {
  const {
    isModalOpen,
    pasoActual,
    postulacionActiva,
    isLoading,
    error,
    closeModal,
    enviarPostulacion,
    simularPago,
    reiniciar,
  } = usePostulacionStore();

  // Estados del Formulario
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [nombreEmprendimiento, setNombreEmprendimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [rubro, setRubro] = useState<Rubro>('artesanias');
  const [ubicacionPreferencia, setUbicacionPreferencia] = useState<UbicacionFeria>('paseo_andino');
  const [descripcion, setDescripcion] = useState('');

  // Estado para feedback de copiado
  const [copiado, setCopiado] = useState(false);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleClose = () => {
    closeModal();
    if (pasoActual === 'confirmado') {
      reiniciar();
      setNombreCompleto('');
      setNombreEmprendimiento('');
      setTelefono('');
      setEmail('');
      setDescripcion('');
    }
  };

  const handleSubmitFormulario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto || !nombreEmprendimiento || !telefono || !email || !descripcion) {
      if (onShowToast) {
        onShowToast('error', 'Campos incompletos', 'Por favor complete todos los datos requeridos.');
      }
      return;
    }

    const exito = await enviarPostulacion({
      nombreCompleto,
      nombreEmprendimiento,
      telefono,
      email,
      rubro,
      ubicacionPreferencia,
      descripcion,
    });

    if (exito && onShowToast) {
      onShowToast('success', '¡Link de Pago Generado!', 'Aboná el 100% para asegurar tu stand en la feria.');
    }
  };

  const handleCopiarLink = async () => {
    if (!postulacionActiva?.linkPagoSimulado) return;
    try {
      await navigator.clipboard.writeText(postulacionActiva.linkPagoSimulado);
      setCopiado(true);
      if (onShowToast) {
        onShowToast('success', '¡Copiado!', 'Link de pago copiado al portapapeles.');
      }
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      if (onShowToast) {
        onShowToast('error', 'Error al copiar', 'No se pudo copiar el enlace.');
      }
    }
  };

  const handleConfirmarPago = async () => {
    const exito = await simularPago();
    if (exito && onShowToast) {
      onShowToast('success', '¡Puesto Asegurado!', 'El pago del 100% fue acreditado con éxito.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-postulacion-title"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl border border-sand-300 dark:border-charcoal-700 overflow-hidden flex flex-col my-6 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Estado de Proceso */}
        <div className="relative p-5 sm:p-6 bg-sand-100 dark:bg-charcoal-900 border-b border-sand-300 dark:border-charcoal-700 flex items-start justify-between">
          <div className="pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-900/60 border border-forest-300 dark:border-forest-700 text-forest-700 dark:text-forest-300 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Convocatoria Presencial • Próximo Fin de Semana</span>
            </div>
            <h2
              id="modal-postulacion-title"
              className="text-xl sm:text-2xl font-extrabold text-charcoal-900 dark:text-white tracking-tight"
            >
              {pasoActual === 'formulario' && 'Postulación para Puesto en Feria Física'}
              {pasoActual === 'pago_simulado' && 'Asegurá tu Stand • Link de Pago'}
              {pasoActual === 'confirmado' && '¡Lugar Asegurado con Éxito!'}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 mt-0.5">
              {pasoActual === 'formulario' && 'Completá tus datos para participar y asegurar tu stand en el paseo.'}
              {pasoActual === 'pago_simulado' && 'Aboná el 100% del stand para confirmar tu lugar en el predio.'}
              {pasoActual === 'confirmado' && 'Tu postulación y pago fueron confirmados. Te esperamos este fin de semana.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 dark:hover:text-sand-200 hover:bg-sand-200 dark:hover:bg-charcoal-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback de Error Global */}
        {error && (
          <div className="m-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Cuerpo del Modal con Scroll */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* PASO 1: Formulario de Postulación */}
          {pasoActual === 'formulario' && (
            <form onSubmit={handleSubmitFormulario} className="space-y-5">
              {/* Tarjeta Informativa de Servicios del Stand: Luz + Wi-Fi + Abono 100% */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-forest-50 to-sand-100 dark:from-charcoal-900 dark:to-charcoal-700/80 border border-forest-200 dark:border-forest-800/60 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Stand Ferial Oficial
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-charcoal-900 dark:text-white">
                    {formatARS(45000)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-charcoal-700 dark:text-sand-200 mb-3">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-charcoal-800/80 border border-sand-300/60 dark:border-charcoal-600">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold">Luz incluida:</span>
                      <p className="text-[11px] text-charcoal-500 dark:text-sand-400">Toma 220V segura para iluminación</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-charcoal-800/80 border border-sand-300/60 dark:border-charcoal-600">
                    <Wifi className="w-4 h-4 text-forest shrink-0" />
                    <div>
                      <span className="font-bold">Wi-Fi incluido:</span>
                      <p className="text-[11px] text-charcoal-500 dark:text-sand-400">Red exclusiva para posnet y cobros</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-forest-200/60 dark:border-forest-900/40 text-[11px] sm:text-xs text-charcoal-600 dark:text-sand-300">
                  <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <p>
                    <strong>Abono del 100%:</strong> Para asegurar tu lugar asignado en la feria física es condición requerida abonar el valor completo del stand mediante el link de pago que se generará a continuación.
                  </p>
                </div>
              </div>

              {/* Campos del Formulario */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre Completo */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                    Nombre Completo <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Ej: Marcelo Gómez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                {/* Nombre del Emprendimiento */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                    Nombre del Emprendimiento <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreEmprendimiento}
                    onChange={(e) => setNombreEmprendimiento(e.target.value)}
                    placeholder="Ej: Cerámicas El Riel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                    Número de Teléfono <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: 3584123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                    Correo Electrónico <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                {/* Rubro Principal */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                    Rubro Principal de Producción <span className="text-terracotta">*</span>
                  </label>
                  <select
                    value={rubro}
                    onChange={(e) => setRubro(e.target.value as Rubro)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                  >
                    <option value="artesanias">Artesanías Generales</option>
                    <option value="ceramica">Cerámica y Alfarería</option>
                    <option value="madera">Trabajos en Madera</option>
                    <option value="marroquineria">Marroquinería & Cuero</option>
                    <option value="gastronomia">Gastronomía y Sabores Caseros</option>
                    <option value="indumentaria">Indumentaria y Textil</option>
                  </select>
                </div>

                {/* Paseo de Preferencia */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                    Paseo Ferial de Preferencia <span className="text-terracotta">*</span>
                  </label>
                  <select
                    value={ubicacionPreferencia}
                    onChange={(e) => setUbicacionPreferencia(e.target.value as UbicacionFeria)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                  >
                    <option value="paseo_andino">Paseo del Andino (Bv. Ameghino)</option>
                    <option value="parque_sarmiento">Parque Sarmiento (Banda Norte)</option>
                  </select>
                </div>
              </div>

              {/* Descripción del Puesto */}
              <div>
                <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200 mb-1">
                  Descripción de Productos y Puesto <span className="text-terracotta">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detallá los productos que vas a exhibir, dimensiones requeridas de gazebo o requerimientos especiales..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-charcoal-600 bg-sand-50 dark:bg-charcoal-700 text-charcoal-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta resize-none"
                />
              </div>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-terracotta hover:bg-terracotta-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registrando y generando link de pago...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Generar Link de Pago y Asegurar Lugar</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 2: Link de Pago Simulado y Abono del 100% */}
          {pasoActual === 'pago_simulado' && postulacionActiva && (
            <div className="space-y-6">
              {/* Tarjeta de Resumen de Pago */}
              <div className="p-5 rounded-2xl bg-sand-100 dark:bg-charcoal-900 border border-sand-300 dark:border-charcoal-700 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-sand-200 dark:border-charcoal-700">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-900 dark:text-white">
                      {postulacionActiva.nombreEmprendimiento}
                    </h3>
                    <p className="text-xs text-charcoal-500 dark:text-sand-400">
                      Responsable: {postulacionActiva.nombreCompleto} • {postulacionActiva.telefono}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    Pago Pendiente
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-charcoal-600 dark:text-sand-300">
                    <span>Canon Stand Ferial Fin de Semana:</span>
                    <span>{formatARS(postulacionActiva.costoStand)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600 dark:text-sand-300">
                    <span>Conexión de Luz 220V:</span>
                    <span className="text-forest font-bold">Incluida</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600 dark:text-sand-300">
                    <span>Acceso Wi-Fi para cobros POS:</span>
                    <span className="text-forest font-bold">Incluido</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600 dark:text-sand-300">
                    <span>Paseo Asignado:</span>
                    <span className="font-semibold text-charcoal-900 dark:text-white">
                      {postulacionActiva.ubicacionPreferencia === 'paseo_andino'
                        ? 'Paseo del Andino'
                        : 'Parque Sarmiento'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-sand-300 dark:border-charcoal-700 flex justify-between text-sm sm:text-base font-extrabold text-charcoal-900 dark:text-white">
                    <span>Total a abonar (100% reserva):</span>
                    <span className="text-terracotta">{formatARS(postulacionActiva.costoStand)}</span>
                  </div>
                </div>
              </div>

              {/* Caja de Link de Pago Generado */}
              <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-700 border border-sand-300 dark:border-charcoal-600 shadow-xs space-y-2">
                <label className="block text-xs font-bold text-charcoal-800 dark:text-sand-200">
                  Link de Pago Simulado Generado:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={postulacionActiva.linkPagoSimulado}
                    className="flex-1 px-3 py-2 rounded-xl bg-sand-100 dark:bg-charcoal-800 border border-sand-300 dark:border-charcoal-600 text-xs font-mono text-charcoal-700 dark:text-sand-200 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopiarLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sand-200 dark:bg-charcoal-600 hover:bg-sand-300 dark:hover:bg-charcoal-500 text-xs font-bold transition-all text-charcoal-800 dark:text-sand-100"
                    title="Copiar enlace"
                  >
                    {copiado ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-forest" />
                        <span className="text-forest">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-charcoal-500 dark:text-sand-400">
                  Podés copiar este enlace para abonarlo o simular el pago instantáneo a continuación.
                </p>
              </div>

              {/* Botón de Pago Simulado */}
              <div className="space-y-3">
                      <button
                  type="button"
                  onClick={handleConfirmarPago}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest-600 active:scale-95 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Procesando pago del 100%...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Pagar {formatARS(postulacionActiva.costoStand)} (Simular Pago Seguro)</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-charcoal-500 dark:text-sand-400">
                  🔒 Simulación segura de pasarela ferial. Al hacer clic se confirma el abono y se asegura el puesto físico.
                </p>
              </div>
            </div>
          )}

          {/* PASO 3: Confirmación Exitosa y Puesto Asegurado */}
          {pasoActual === 'confirmado' && postulacionActiva && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-forest-100 dark:bg-forest-900/50 border border-forest-300 dark:border-forest-700 flex items-center justify-center text-forest">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-900/60 text-forest-700 dark:text-forest-300 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Puesto 100% Asegurado
                </span>
                <h3 className="text-2xl font-extrabold text-charcoal-900 dark:text-white">
                  ¡Felicitaciones, {postulacionActiva.nombreCompleto}!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 max-w-md mx-auto mt-1">
                  Tu stand para <strong>{postulacionActiva.nombreEmprendimiento}</strong> fue reservado y abonado en su totalidad.
                </p>
              </div>

              {/* Comprobante Digital */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sand-100 dark:bg-charcoal-900 border border-sand-300 dark:border-charcoal-700 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal-500 dark:text-sand-400">Comprobante de Reserva:</span>
                  <span className="font-mono font-bold text-charcoal-900 dark:text-white">{postulacionActiva.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500 dark:text-sand-400">Paseo Asignado:</span>
                  <span className="font-semibold text-charcoal-900 dark:text-white">
                    {postulacionActiva.ubicacionPreferencia === 'paseo_andino'
                      ? 'Paseo del Andino (Bv. Ameghino)'
                      : 'Parque Sarmiento (Banda Norte)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500 dark:text-sand-400">Servicios Conectados:</span>
                  <span className="text-forest font-bold">Luz eléctrica 220V + Wi-Fi POS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-500 dark:text-sand-400">Estado del Canon:</span>
                  <span className="text-forest font-bold">Abonado 100% ({formatARS(postulacionActiva.costoStand)})</span>
                </div>
              </div>

              {/* Acciones Finales */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-sand-300 dark:border-charcoal-600 hover:bg-sand-200 dark:hover:bg-charcoal-700 font-bold text-xs sm:text-sm text-charcoal-800 dark:text-sand-200 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
