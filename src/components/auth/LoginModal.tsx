import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Store,
  Lock,
  UserCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  MapPin,
  UserPlus,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { COMPRADORES_MOCK } from '../../data/mockData';
import { UsuarioComprador, RolUsuario } from '../../types';

interface LoginModalProps {
  onShowToast?: (type: 'success' | 'error', title: string, message: string) => void;
}

export const LoginModal = ({ onShowToast }: LoginModalProps) => {
  const navigate = useNavigate();
  const {
    loginModalOpen,
    loginModalRole,
    loginModalMode,
    closeLoginModal,
    login,
    loginComprador,
    loginDirectoComprador,
    registrarComprador,
    isLoading,
    error,
  } = useAuthStore();

  const [rolActivo, setRolActivo] = useState<RolUsuario>('comprador');
  const [modoComprador, setModoComprador] = useState<'login' | 'register'>('login');

  // Formulario Feriante
  const [usuarioFeriante, setUsuarioFeriante] = useState('');
  const [contraseniaFeriante, setContraseniaFeriante] = useState('feria123');

  // Formulario Comprador Login
  const [usuarioComprador, setUsuarioComprador] = useState('');
  const [contraseniaComprador, setContraseniaComprador] = useState('comprador123');

  // Formulario Comprador Registro
  const [registroNombre, setRegistroNombre] = useState('');
  const [registroEmail, setRegistroEmail] = useState('');
  const [registroContrasenia, setRegistroContrasenia] = useState('');
  const [registroConfirmarContrasenia, setRegistroConfirmarContrasenia] = useState('');
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  // Sincronizar roles y modos al abrir modal
  useEffect(() => {
    if (loginModalOpen) {
      setRolActivo(loginModalRole || 'comprador');
      setModoComprador(loginModalMode || 'login');
      setErrorPassword(null);
    } else {
      setErrorPassword(null);
    }
  }, [loginModalOpen, loginModalRole, loginModalMode]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && loginModalOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loginModalOpen, closeLoginModal]);

  if (!loginModalOpen) return null;

  // Submit para Feriantes
  const handleSubmitFeriante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioFeriante.trim()) return;

    const res = await login(usuarioFeriante, contraseniaFeriante);
    if (res.success) {
      if (onShowToast) {
        onShowToast('success', 'Sesión Iniciada', res.message);
      }
      navigate('/admin');
    } else {
      if (onShowToast) {
        onShowToast('error', 'Error de Acceso', res.message);
      }
    }
  };


  // Submit para Compradores (Login)
  const handleSubmitComprador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioComprador.trim()) return;

    const res = await loginComprador(usuarioComprador, contraseniaComprador);
    if (res.success) {
      if (onShowToast) {
        onShowToast('success', 'Sesión Iniciada', res.message);
      }
    } else {
      if (onShowToast) {
        onShowToast('error', 'Error de Acceso', res.message);
      }
    }
  };

  // Submit para Compradores (Registro)
  const handleRegisterComprador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registroNombre.trim() || !registroEmail.trim()) return;

    if (!registroContrasenia) {
      setErrorPassword('Por favor, ingresá una contraseña.');
      return;
    }

    if (registroContrasenia.length < 4) {
      setErrorPassword('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (registroContrasenia !== registroConfirmarContrasenia) {
      setErrorPassword('Las contraseñas no coinciden.');
      if (onShowToast) {
        onShowToast('error', 'Error en Contraseña', 'Las contraseñas no coinciden.');
      }
      return;
    }

    setErrorPassword(null);

    const res = await registrarComprador(
      registroNombre,
      registroEmail,
      registroContrasenia,
      'Río Cuarto, Córdoba'
    );
    if (res.success) {
      if (onShowToast) {
        onShowToast('success', '¡Cuenta Creada!', res.message);
      }
    } else {
      if (onShowToast) {
        onShowToast('error', 'Error en Registro', res.message);
      }
    }
  };

  // Quick login para Compradores
  const handleQuickLoginComprador = (c: UsuarioComprador) => {
    loginDirectoComprador(c);
    if (onShowToast) {
      onShowToast(
        'success',
        'Sesión Iniciada',
        `Conectado como ${c.nombre} (${c.ubicacion || 'Río Cuarto'})`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-sand-100 dark:bg-charcoal-800 rounded-3xl shadow-2xl border border-sand-300 dark:border-charcoal-700 text-charcoal-900 dark:text-sand-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal con Identidad Adaptativa */}
        <div
          className={`relative px-6 py-6 text-white overflow-hidden transition-colors duration-300 ${
            rolActivo === 'feriante'
              ? 'bg-gradient-to-br from-terracotta to-terracotta-700'
              : 'bg-gradient-to-br from-forest-600 to-forest-800'
          }`}
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex min-w-0 items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-white/30 shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo Feria Imperio"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/25 text-[11px] font-bold tracking-wide uppercase">
                  <ShieldCheck className="w-3 h-3" />
                  {rolActivo === 'feriante'
                    ? 'Feriante'
                    : modoComprador === 'register'
                    ? 'Registro'
                    : 'Acceso'}
                </span>
                <h2 id="login-modal-title" className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  {rolActivo === 'feriante'
                    ? 'Iniciar sesión'
                    : modoComprador === 'register'
                    ? 'Crear Cuenta'
                    : 'Iniciar Sesión'}
                </h2>
              </div>
            </div>

            <button
              onClick={closeLoginModal}
              className="shrink-0 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Cerrar ventana de ingreso"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/90 mt-3 relative z-10 font-medium">
            {rolActivo === 'feriante'
              ? 'Gestioná tu emprendimiento desde un solo lugar: actualizá tus productos, administrá tus precios y mantené tu catálogo al día.'
              : modoComprador === 'register'
              ? 'Creá tu cuenta para descubrir emprendimientos, explorar sus productos y comprar de forma fácil y rápida.'
              : 'Conéctate para explorar los productos de cada emprendimiento, descubrir nuevos artículos y realizar tus compras directamente desde la plataforma.'}
          </p>

          {/* Selector de Pestañas Feriante / Comprador */}
          <div className="flex items-center p-1 bg-black/20 backdrop-blur-md rounded-2xl mt-4 relative z-10">
            <button
              type="button"
              role="tab"
              aria-selected={rolActivo === 'comprador'}
              onClick={() => setRolActivo('comprador')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                rolActivo === 'comprador'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Usuario</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={rolActivo === 'feriante'}
              onClick={() => setRolActivo('feriante')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                rolActivo === 'feriante'
                  ? 'bg-white text-terracotta-800 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Soy Feriante</span>
            </button>
          </div>
        </div>

        {/* Contenido / Cuerpo */}
        <div className="p-6 space-y-6">
          {rolActivo === 'comprador' ? (
            /* ================= VISTA TAB COMPRADOR ================= */
            <>
              {/* Selector interno de modo comprador: Iniciar Sesión vs Crear Cuenta */}
              <div className="flex items-center gap-2 p-1 bg-sand-200/80 dark:bg-charcoal-700 rounded-2xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setModoComprador('login')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    modoComprador === 'login'
                      ? 'bg-white dark:bg-charcoal-800 text-forest dark:text-forest-300 shadow-xs'
                      : 'text-charcoal-600 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setModoComprador('register')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    modoComprador === 'register'
                      ? 'bg-white dark:bg-charcoal-800 text-forest dark:text-forest-300 shadow-xs'
                      : 'text-charcoal-600 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
                >
                  Crear tu cuenta
                </button>
              </div>

              {modoComprador === 'register' ? (
                /* FORMULARIO DE REGISTRO COMPRADOR */
                <form onSubmit={handleRegisterComprador} className="space-y-4">
                  {(error || errorPassword) && (
                    <div
                      className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs animate-in slide-in-from-top-2"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorPassword || error}</span>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="register-comprador-nombre"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                    >
                      Nombre y Apellido *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-comprador-nombre"
                        type="text"
                        value={registroNombre}
                        onChange={(e) => setRegistroNombre(e.target.value)}
                        placeholder="Ej: Laura Martínez"
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-comprador-email"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                    >
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-comprador-email"
                        type="email"
                        value={registroEmail}
                        onChange={(e) => setRegistroEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-comprador-password"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                    >
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-comprador-password"
                        type="password"
                        value={registroContrasenia}
                        onChange={(e) => {
                          setRegistroContrasenia(e.target.value);
                          if (errorPassword) setErrorPassword(null);
                        }}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-comprador-confirm-password"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                    >
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-comprador-confirm-password"
                        type="password"
                        value={registroConfirmarContrasenia}
                        onChange={(e) => {
                          setRegistroConfirmarContrasenia(e.target.value);
                          if (errorPassword) setErrorPassword(null);
                        }}
                        placeholder="Repetí tu contraseña"
                        className={`w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border ${
                          registroConfirmarContrasenia && registroContrasenia !== registroConfirmarContrasenia
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-forest/20'
                        } focus:ring-2 focus:outline-none transition-all`}
                        required
                      />
                    </div>
                    {registroConfirmarContrasenia && registroContrasenia !== registroConfirmarContrasenia && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Las contraseñas no coinciden</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || (Boolean(registroConfirmarContrasenia) && registroContrasenia !== registroConfirmarContrasenia)}
                    className="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-forest-600 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creando tu cuenta...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Crear cuenta</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setModoComprador('login')}
                      className="text-xs font-semibold text-forest dark:text-forest-400 hover:underline"
                    >
                      ¿Ya tenés cuenta? Iniciar sesión aquí
                    </button>
                  </div>
                </form>
              ) : (
                /* FORMULARIO DE LOGIN COMPRADOR */
                <form onSubmit={handleSubmitComprador} className="space-y-4">
                  {error && (
                    <div
                      className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs animate-in slide-in-from-top-2"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="login-comprador-nombre"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                    >
                      Nombre de usuario o correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-comprador-nombre"
                        type="text"
                        value={usuarioComprador}
                        onChange={(e) => setUsuarioComprador(e.target.value)}
                        placeholder="Ej: María Gómez o maria.gomez@gmail.com"
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1.5">
                      <label
                        htmlFor="login-comprador-password"
                        className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider"
                      >
                        Contraseña
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="login-comprador-password"
                        type="password"
                        value={contraseniaComprador}
                        onChange={(e) => setContraseniaComprador(e.target.value)}
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-forest-600 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Ingresando a la feria...</span>
                      </>
                    ) : (
                      <>
                        <span>Iniciar Sesión como Comprador</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setModoComprador('register')}
                      className="text-xs font-semibold text-forest dark:text-forest-400 hover:underline"
                    >
                      ¿No tenés cuenta todavía? Crear tu cuenta
                    </button>
                  </div>
                </form>
              )}

              {/* Separador */}
              <div className="border-t border-sand-300 dark:border-charcoal-600 w-full my-1" />

              {/* Lista de Compradores Demo */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-forest dark:text-forest-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Elegir un perfil de comprador para probar de inmediato:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {COMPRADORES_MOCK.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleQuickLoginComprador(c)}
                      className="flex items-center sm:flex-col sm:text-center gap-2.5 p-2.5 rounded-2xl bg-white dark:bg-charcoal-700 hover:bg-sand-200 dark:hover:bg-charcoal-600 border border-sand-300 dark:border-charcoal-600 transition-all group active:scale-95"
                    >
                      <img
                        src={c.avatarUrl}
                        alt={c.nombre}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-forest/40"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-charcoal-900 dark:text-white truncate group-hover:text-forest transition-colors">
                          {c.nombre}
                        </p>
                        <p className="text-[10px] text-charcoal-500 dark:text-sand-400 truncate flex items-center sm:justify-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-forest" />
                          <span>{c.ubicacion}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ================= VISTA TAB FERIANTE ================= */
            <>
              <form onSubmit={handleSubmitFeriante} className="space-y-4">
                {error && (
                  <div
                    className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs animate-in slide-in-from-top-2"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="login-usuario-feriante"
                    className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                  >
                    Usuario
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-usuario-feriante"
                      type="text"
                      value={usuarioFeriante}
                      onChange={(e) => setUsuarioFeriante(e.target.value)}
                      placeholder="Ej: El Gaucho Tradición o Carlos Altamirano"
                      className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1.5">
                    <label
                      htmlFor="login-password-feriante"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider"
                    >
                      Contraseña
                    </label>
                    </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password-feriante"
                      type="password"
                      value={contraseniaFeriante}
                      onChange={(e) => setContraseniaFeriante(e.target.value)}
                      className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verificando puesto...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>


            </>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="bg-sand-200/70 dark:bg-charcoal-900/50 px-6 py-3 border-t border-sand-300 dark:border-charcoal-700 flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-500 dark:text-sand-400">
          <span>
            {rolActivo === 'feriante'
              ? '¿Querés registrar un nuevo puesto artesanal?'
              : '¿Tenés un emprendimiento y querés vender en la feria?'}
          </span>
          <a
            href="/#contacto"
            onClick={closeLoginModal}
            className="font-bold text-terracotta hover:underline"
          >
            Postularse aquí
          </a>
        </div>
      </div>
    </div>
  );
};
