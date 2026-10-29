import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  ShoppingBag,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
  User,
  Compass,
  Store,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePostulacionStore } from '../../store/usePostulacionStore';

interface NavBarProps {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
}

export const NavBar = ({ busqueda, onBusquedaChange }: NavBarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { toggleCart, getTotalItems } = useCartStore();
  const {
    currentFeriante,
    currentComprador,
    userRole,
    isAuthenticated,
    openLoginModal,
    logout,
  } = useAuthStore();
  const totalItems = getTotalItems();
  const openPostulacionModal = usePostulacionStore((state) => state.openModal);


  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('tiendas')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };


  return (
    <header className="sticky top-0 z-40 bg-sand/90 dark:bg-charcoal/90 backdrop-blur-md border-b border-sand-300 dark:border-charcoal-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* 1. Brand Logo (Izquierda) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group" aria-label="Ir al inicio de Feria Imperio">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-white border border-sand-300 dark:border-charcoal-700 p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Logo Feria Imperio"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl text-terracotta tracking-tight leading-none">
                Feria Imperio
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-forest dark:text-forest-400 tracking-wide mt-0.5">
                Río Cuarto • Tiendas Locales
              </span>
            </div>
          </Link>

          {/* 2. Barra y Botón de Búsqueda Centralizados (Centro) */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Búsqueda de puestos, rubros y artículos"
            className="hidden md:flex flex-1 justify-center max-w-md lg:max-w-lg mx-auto"
          >
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-charcoal-400 dark:text-sand-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => onBusquedaChange(e.target.value)}
                placeholder="Buscar puestos, rubros o artículos (ej: mate, cazuela)..."
                className="w-full bg-sand-200 dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-24 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:bg-white dark:focus:bg-charcoal-800 focus:outline-none transition-all shadow-inner"
              />
              {busqueda.trim() !== '' && (
                <button
                  type="button"
                  onClick={() => onBusquedaChange('')}
                  className="absolute right-20 p-1 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-sand-200 transition-colors"
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {/* Botón Centralizado de Búsqueda */}
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 rounded-full bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Buscar en la feria"
              >
                <Search className="w-3 h-3" />
                <span>Buscar</span>
              </button>
            </div>
          </form>

          {/* 3. Acciones y Perfil (Derecha) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            {/* SECCIÓN DE AUTENTICACIÓN (COMPRADOR / FERIANTE) */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1.5 lg:gap-2">
                {/* 1. Iniciar sesión */}
                <button
                  type="button"
                  onClick={() => openLoginModal('comprador', 'login')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sand-300 dark:border-charcoal-600 hover:border-forest dark:hover:border-forest-400 text-charcoal-800 dark:text-sand-100 hover:bg-sand-100 dark:hover:bg-charcoal-800 text-xs font-bold transition-all active:scale-95"
                  title="Iniciar sesión"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </button>

                {/* 2. Postular mi emprendimiento */}
                <button
                  type="button"
                  onClick={openPostulacionModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  title="Postular mi emprendimiento a la feria física"
                >
                  <Store className="w-4 h-4" />
                  <span>Postular mi emprendimiento</span>
                </button>
              </div>
            ) : userRole === 'comprador' && currentComprador ? (
              /* Dropdown Usuario Comprador */
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-sand-200 dark:bg-charcoal-700 hover:bg-sand-300 dark:hover:bg-charcoal-600 border border-sand-300 dark:border-charcoal-600 transition-all focus:outline-none"
                  aria-expanded={profileDropdownOpen}
                >
                  <img
                    src={currentComprador.avatarUrl}
                    alt={currentComprador.nombre}
                    className="w-8 h-8 rounded-full object-cover border-2 border-forest"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-charcoal-900 dark:text-white leading-tight truncate max-w-[120px]">
                      {currentComprador.nombre}
                    </p>
                    <span className="text-[10px] text-forest dark:text-forest-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                      Comprador Ferial
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-charcoal-500 dark:text-sand-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-charcoal-800 shadow-xl border border-sand-300 dark:border-charcoal-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-sand-200 dark:border-charcoal-700">
                      <p className="text-[11px] font-semibold text-charcoal-400 dark:text-sand-400">
                        Sesión de Comprador
                      </p>
                      <p className="text-sm font-bold text-charcoal-900 dark:text-white truncate">
                        {currentComprador.nombre}
                      </p>
                      <p className="text-xs text-forest dark:text-forest-400 truncate">
                        {currentComprador.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        toggleCart();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-700 hover:text-forest transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Mi Lista de Compras</span>
                      </div>
                      {totalItems > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-forest text-white text-[10px]">
                          {totalItems}
                        </span>
                      )}
                    </button>

                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-700 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-terracotta" />
                      <span>Explorar Puestos y Ferias</span>
                    </Link>

                    <div className="border-t border-sand-200 dark:border-charcoal-700 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Dropdown Feriante Autenticado */
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-sand-200 dark:bg-charcoal-700 hover:bg-sand-300 dark:hover:bg-charcoal-600 border border-sand-300 dark:border-charcoal-600 transition-all focus:outline-none"
                  aria-expanded={profileDropdownOpen}
                >
                  <img
                    src={
                      currentFeriante?.avatarUrl ||
                      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={currentFeriante?.nombreComercio}
                    className="w-8 h-8 rounded-xl object-cover border border-forest"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-charcoal-900 dark:text-white leading-tight truncate max-w-[120px]">
                      {currentFeriante?.nombreComercio}
                    </p>
                    <span className="text-[10px] text-forest dark:text-forest-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                      Puesto Activo
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-charcoal-500 dark:text-sand-400" />
                </button>

                {/* Menú Desplegable Feriante */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-charcoal-800 shadow-xl border border-sand-300 dark:border-charcoal-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-sand-200 dark:border-charcoal-700">
                      <p className="text-xs font-semibold text-charcoal-400 dark:text-sand-400">
                        Sesión de Feriante
                      </p>
                      <p className="text-sm font-bold text-charcoal-900 dark:text-white truncate">
                        {currentFeriante?.nombreResponsable}
                      </p>
                      <p className="text-xs text-terracotta truncate">
                        {currentFeriante?.nombreComercio}
                      </p>
                    </div>

                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-700 hover:text-forest transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Mi Taller (Panel de Stock)</span>
                    </Link>

                    {currentFeriante && (
                      <Link
                        to={`/tienda/${currentFeriante.id}`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-charcoal-700 dark:text-sand-200 hover:bg-sand-100 dark:hover:bg-charcoal-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Ver Mi Puesto Público</span>
                      </Link>
                    )}

                    <div className="border-t border-sand-200 dark:border-charcoal-700 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-charcoal-700 dark:text-sand-200 hover:bg-sand-200 dark:hover:bg-charcoal-700 focus:outline-none"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Mobile Centralizada con Botón */}
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          aria-label="Búsqueda móvil de puestos, rubros y artículos"
          className="md:hidden pb-3"
        >
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-charcoal-400 dark:text-sand-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar puestos, rubros o artículos..."
              className="w-full bg-sand-200 dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 pl-10 pr-22 py-2 rounded-full text-xs border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none"
            />
            {busqueda.trim() !== '' && (
              <button
                type="button"
                onClick={() => onBusquedaChange('')}
                className="absolute right-18 p-1 text-charcoal-400 hover:text-charcoal-700 dark:hover:text-sand-200"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-bold shadow-xs active:scale-95 cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand-300 dark:border-charcoal-700 bg-sand dark:bg-charcoal px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {/* Card de Usuario Autenticado en Mobile */}
          {isAuthenticated && userRole === 'comprador' && currentComprador ? (
            <div className="p-3 mb-3 rounded-2xl bg-sand-200 dark:bg-charcoal-700 border border-sand-300 dark:border-charcoal-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentComprador.avatarUrl}
                  alt={currentComprador.nombre}
                  className="w-10 h-10 rounded-full object-cover border-2 border-forest"
                />
                <div>
                  <p className="text-xs font-bold text-charcoal-900 dark:text-white">
                    {currentComprador.nombre}
                  </p>
                  <p className="text-[11px] text-forest dark:text-forest-400 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3" /> Comprador Ferial
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : isAuthenticated && userRole === 'feriante' && currentFeriante ? (
            <div className="p-3 mb-3 rounded-2xl bg-sand-200 dark:bg-charcoal-700 border border-sand-300 dark:border-charcoal-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentFeriante.avatarUrl}
                  alt={currentFeriante.nombreComercio}
                  className="w-10 h-10 rounded-xl object-cover border border-forest"
                />
                <div>
                  <p className="text-xs font-bold text-charcoal-900 dark:text-white">
                    {currentFeriante.nombreComercio}
                  </p>
                  <p className="text-[11px] text-forest dark:text-forest-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Puesto Conectado
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          <div className="pt-2">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal('comprador', 'login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-sm shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPostulacionModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm shadow-md transition-all text-center cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Postular mi emprendimiento</span>
                </button>
              </div>
            ) : userRole === 'comprador' ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleCart();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest text-white font-bold text-sm shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ver Mi Lista de Compras ({totalItems})</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest text-white font-bold text-sm shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ir a Mi Taller (Panel de Stock)</span>
                </Link>
                <Link
                  to={`/tienda/${currentFeriante?.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sand-200 dark:bg-charcoal-700 text-charcoal-800 dark:text-sand-200 font-bold text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Mi Puesto en la Feria</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
