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
  CheckCircle2,
  User,
  Mail,
  MapPin,
  UserPlus,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ferianteRepository } from '../../repositories';
import { COMPRADORES_MOCK } from '../../data/mockData';
import { Feriante, UsuarioComprador, RolUsuario } from '../../types';

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
    loginDirecto,
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
  const [feriantesLista, setFeriantesLista] = useState<Feriante[]>([]);
  const [cargandoLista, setCargandoLista] = useState(true);

  // Formulario Comprador Login
  const [usuarioComprador, setUsuarioComprador] = useState('');
  const [contraseniaComprador, setContraseniaComprador] = useState('comprador123');

  // Formulario Comprador Registro
  const [registroNombre, setRegistroNombre] = useState('');
  const [registroEmail, setRegistroEmail] = useState('');
  const [registroContrasenia, setRegistroContrasenia] = useState('comprador123');
  const [registroUbicacion, setRegistroUbicacion] = useState('Río Cuarto, Córdoba');

  const [loginExitoso, setLoginExitoso] = useState<string | null>(null);

  // Sincronizar roles y modos al abrir modal
  useEffect(() => {
    if (loginModalOpen) {
      setRolActivo(loginModalRole || 'comprador');
      setModoComprador(loginModalMode || 'login');
      setCargandoLista(true);
      ferianteRepository
        .getAll()
        .then((data) => {
          setFeriantesLista(data);
          setCargandoLista(false);
        })
        .catch(() => setCargandoLista(false));
    } else {
      setLoginExitoso(null);
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
      setLoginExitoso(res.message);
      if (onShowToast) {
        onShowToast('success', 'Sesión Iniciada', res.message);
      }
      setTimeout(() => {
        closeLoginModal();
        navigate('/admin');
      }, 700);
    } else {
      if (onShowToast) {
        onShowToast('error', 'Error de Acceso', res.message);
      }
    }
  };

  // Quick login para Feriantes
  const handleQuickLoginFeriante = (f: Feriante) => {
    loginDirecto(f);
    setLoginExitoso(`¡Bienvenido al taller de ${f.nombreComercio}!`);
    if (onShowToast) {
      onShowToast(
        'success',
        'Sesión Iniciada',
        `Ingresaste como ${f.nombreResponsable} (${f.nombreComercio})`
      );
    }
    setTimeout(() => {
      closeLoginModal();
      navigate('/admin');
    }, 600);
  };

  // Submit para Compradores (Login)
  const handleSubmitComprador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioComprador.trim()) return;

    const res = await loginComprador(usuarioComprador, contraseniaComprador);
    if (res.success) {
      setLoginExitoso(res.message);
      if (onShowToast) {
        onShowToast('success', 'Sesión Iniciada', res.message);
      }
      setTimeout(() => {
        closeLoginModal();
      }, 700);
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

    const res = await registrarComprador(
      registroNombre,
      registroEmail,
      registroContrasenia || 'comprador123',
      registroUbicacion || 'Río Cuarto, Córdoba'
    );
    if (res.success) {
      setLoginExitoso(res.message);
      if (onShowToast) {
        onShowToast('success', '¡Cuenta Creada!', res.message);
      }
      setTimeout(() => {
        closeLoginModal();
      }, 700);
    } else {
      if (onShowToast) {
        onShowToast('error', 'Error en Registro', res.message);
      }
    }
  };

  // Quick login para Compradores
  const handleQuickLoginComprador = (c: UsuarioComprador) => {
    loginDirectoComprador(c);
    setLoginExitoso(`¡Bienvenido/a a la feria, ${c.nombre}!`);
    if (onShowToast) {
      onShowToast(
        'success',
        'Sesión Iniciada',
        `Conectado como ${c.nombre} (${c.ubicacion || 'Río Cuarto'})`
      );
    }
    setTimeout(() => {
      closeLoginModal();
    }, 600);
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
                    ? 'Acceso Ferial'
                    : modoComprador === 'register'
                    ? 'Registro Vecinos'
                    : 'Portal Vecinos'}
                </span>
                <h2 id="login-modal-title" className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  {rolActivo === 'feriante'
                    ? 'Ingreso de Feriantes'
                    : modoComprador === 'register'
                    ? 'Crear Cuenta de Usuario'
                    : 'Ingreso de Compradores'}
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
              ? 'Accedé a tu taller digital para actualizar tu stock, precios y presencia en la feria.'
              : modoComprador === 'register'
              ? 'Creá tu cuenta de usuario normal para armar presupuestos, contactar feriantes y guardar puestos favoritos.'
              : 'Conectate para armar listas de pedidos, consultar directamente a los feriantes y guardar tus puestos favoritos.'}
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
              <span>Soy Comprador</span>
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
          {/* Estado de Éxito Inmediato */}
          {loginExitoso ? (
            <div className="py-8 flex flex-col items-center text-center space-y-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  rolActivo === 'feriante'
                    ? 'bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta'
                    : 'bg-forest-100 dark:bg-forest-900/50 text-forest'
                }`}
              >
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 dark:text-white">
                ¡Operación Exitosa!
              </h3>
              <p className="text-sm text-charcoal-600 dark:text-sand-300">
                {loginExitoso}
              </p>
            </div>
          ) : rolActivo === 'comprador' ? (
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
                        onChange={(e) => setRegistroContrasenia(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-comprador-ubicacion"
                      className="block text-xs font-bold text-charcoal-700 dark:text-sand-300 uppercase tracking-wider mb-1.5"
                    >
                      Barrio / Ubicación en Río Cuarto
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-charcoal-400 dark:text-sand-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="register-comprador-ubicacion"
                        type="text"
                        value={registroUbicacion}
                        onChange={(e) => setRegistroUbicacion(e.target.value)}
                        placeholder="Ej: Banda Norte, Centro, Alberdi..."
                        className="w-full bg-white dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-forest focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all"
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
                        <span>Creando tu cuenta...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Crear Cuenta como Usuario Normal</span>
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
                      Tu Nombre o Correo Electrónico
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
                      <span className="text-[11px] text-forest dark:text-forest-400 font-medium">
                        Clave demo: <code className="bg-sand-200 dark:bg-charcoal-600 px-1 py-0.5 rounded">comprador123</code>
                      </span>
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
                      ¿No tenés cuenta todavía? Crear tu cuenta como usuario normal
                    </button>
                  </div>
                </form>
              )}

              {/* Separador */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-sand-300 dark:border-charcoal-600 w-full absolute" />
                <span className="bg-sand-100 dark:bg-charcoal-800 px-3 text-[11px] font-bold text-charcoal-400 dark:text-sand-400 uppercase tracking-widest text-center max-w-full relative sm:absolute">
                  O Acceso Rápido Vecinos Demo (1 click)
                </span>
              </div>

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
                    Puesto o Responsable
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
                      Contraseña Ferial
                    </label>
                    <span className="text-[11px] text-terracotta dark:text-terracotta-300 font-medium">
                      Clave demo: <code className="bg-sand-200 dark:bg-charcoal-600 px-1 py-0.5 rounded">feria123</code>
                    </span>
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
                      <span>Iniciar Sesión en Mi Taller</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Separador */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-sand-300 dark:border-charcoal-600 w-full absolute" />
                <span className="bg-sand-100 dark:bg-charcoal-800 px-3 text-[11px] font-bold text-charcoal-400 dark:text-sand-400 uppercase tracking-widest text-center max-w-full relative sm:absolute">
                  O Acceso Rápido Feriante Demo (1 click)
                </span>
              </div>

              {/* Lista de Feriantes Disponibles para Demostración */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seleccionar artesano para probar de inmediato:</span>
                </div>

                {cargandoLista ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 rounded-2xl bg-sand-200 dark:bg-charcoal-700 animate-pulse"
                      />
                    ))}
                  </div>
                ) : feriantesLista.length === 0 ? (
                  <div className="p-4 text-center text-xs text-charcoal-500 dark:text-sand-400 bg-sand-200/50 dark:bg-charcoal-700/50 rounded-2xl">
                    No hay feriantes cargados en el repositorio.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {feriantesLista.slice(0, 4).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleQuickLoginFeriante(f)}
                        className="flex items-center gap-2.5 p-2 rounded-2xl bg-white dark:bg-charcoal-700 hover:bg-sand-200 dark:hover:bg-charcoal-600 border border-sand-300 dark:border-charcoal-600 text-left transition-all group active:scale-95"
                      >
                        <img
                          src={f.avatarUrl}
                          alt={f.nombreComercio}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 border border-terracotta/30"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-charcoal-900 dark:text-white truncate group-hover:text-terracotta transition-colors">
                            {f.nombreComercio}
                          </p>
                          <p className="text-[10px] text-charcoal-500 dark:text-sand-400 truncate">
                            {f.nombreResponsable}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
