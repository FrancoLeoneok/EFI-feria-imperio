import { useState, useEffect, useCallback } from 'react';
import { HeroBanner } from '../components/layout/HeroBanner';
import { CategoryFilter } from '../components/catalog/CategoryFilter';
import { StoreGrid } from '../components/stores/StoreGrid';
import { FeriasSection } from '../components/ferias/FeriasSection';
import { ContactForm } from '../components/contact/ContactForm';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { ProductModal } from '../components/catalog/ProductModal';
import { Feriante, Producto, Rubro, UbicacionFeria, UIStatus } from '../types';
import { ferianteRepository, productoRepository } from '../repositories';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, MapPin, ShoppingBag, Store } from 'lucide-react';

interface HomePageProps {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  onShowToast: (type: 'success' | 'error', title: string, message: string) => void;
}

export const HomePage = ({
  busqueda,
  onBusquedaChange,
  onShowToast,
}: HomePageProps) => {
  const { isAuthenticated, userRole, currentComprador } = useAuthStore();
  const esCliente = isAuthenticated && userRole === 'comprador';
  const [vistaCliente, setVistaCliente] = useState<'productos' | 'tiendas'>('productos');

  const [rubroActivo, setRubroActivo] = useState<Rubro | 'todos'>('todos');
  const [ubicacionActiva, setUbicacionActiva] = useState<UbicacionFeria | 'todas'>('todas');

  const [feriantes, setFeriantes] = useState<Feriante[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosCatalogo, setProductosCatalogo] = useState<Producto[]>([]);
  const [productosStatus, setProductosStatus] = useState<UIStatus>('loading');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [selectedProductModal, setSelectedProductModal] = useState<Producto | null>(null);
  const [status, setStatus] = useState<UIStatus>('loading');

  // Cargar productos para conteos de tiendas
  useEffect(() => {
    productoRepository.getAll().then(setProductos).catch(console.error);
  }, []);

  // Cargar catálogo de productos reactivamente (con soporte de 4 Estados de UI)
  const fetchProductos = useCallback(async () => {
    setProductosStatus('loading');
    try {
      const resultado = await productoRepository.filtrar({
        busqueda,
        rubro: rubroActivo,
        soloDisponibles: false,
        orden: 'destacados',
      });
      setProductosCatalogo(resultado);
      setProductosFiltrados(busqueda.trim() ? resultado : []);
      setProductosStatus(resultado.length === 0 ? 'empty' : 'success');
    } catch {
      setProductosStatus('error');
    }
  }, [busqueda, rubroActivo]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Filtrar tiendas reactivamente
  const fetchFeriantes = useCallback(async () => {
    setStatus('loading');
    try {
      const resultado = await ferianteRepository.filtrar({
        busqueda,
        rubro: rubroActivo,
        ubicacion: ubicacionActiva,
      });

      setFeriantes(resultado);
      setStatus(resultado.length === 0 ? 'empty' : 'success');
    } catch {
      setStatus('error');
    }
  }, [busqueda, rubroActivo, ubicacionActiva]);

  useEffect(() => {
    fetchFeriantes();
  }, [fetchFeriantes]);

  // Conteos
  const conteoPorRubro = feriantes.reduce<Record<string, number>>((acc, f) => {
    acc[f.rubroPrincipal] = (acc[f.rubroPrincipal] || 0) + 1;
    return acc;
  }, {});

  const conteoProductosPorFeriante = productos.reduce<Record<string, number>>((acc, p) => {
    acc[p.ferianteId] = (acc[p.ferianteId] || 0) + 1;
    return acc;
  }, {});

  const handleResetFilters = () => {
    onBusquedaChange('');
    setRubroActivo('todos');
    setUbicacionActiva('todas');
  };

  return (
    <div id="inicio">
      {/* 1. Hero de Bienvenida y Anuncios (SOLO PARA VISITANTES NO AUTENTICADOS O FERIANTES) */}
      {!esCliente && <HeroBanner />}

      {/* 2. Sección Principal: Catálogo Digital (Unificado con anclas #catalogo y #tiendas) */}
      <section id="catalogo" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="tiendas" />

        {/* Cabecera Adaptativa: Vista Exclusiva Cliente vs Vista General */}
        {esCliente ? (
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-900/40 text-forest text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catálogo Digital de Feria Imperio</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 dark:text-white tracking-tight">
                  {currentComprador ? `¡Hola, ${currentComprador.nombre}!` : 'Catálogo de la Feria'}
                </h1>
                <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 mt-1 max-w-2xl">
                  Explorá todas las creaciones artesanales disponibles, filtrá por rubro y agregá artículos a tu lista de compra para coordinar directamente con los feriantes.
                </p>
              </div>

              {/* Selector de Vista: Productos vs Tiendas */}
              <div className="flex items-center gap-1.5 p-1 bg-sand-200 dark:bg-charcoal-800 rounded-2xl border border-sand-300 dark:border-charcoal-700 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setVistaCliente('productos')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vistaCliente === 'productos'
                      ? 'bg-white dark:bg-charcoal-700 text-terracotta shadow-xs'
                      : 'text-charcoal-600 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
                  aria-pressed={vistaCliente === 'productos'}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Productos ({productosCatalogo.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVistaCliente('tiendas')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vistaCliente === 'tiendas'
                      ? 'bg-white dark:bg-charcoal-700 text-forest dark:text-forest-400 shadow-xs'
                      : 'text-charcoal-600 dark:text-sand-400 hover:text-charcoal-900 dark:hover:text-white'
                  }`}
                  aria-pressed={vistaCliente === 'tiendas'}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Tiendas ({feriantes.length})</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Puestos y Emprendedores Locales</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-white tracking-tight">
                Explorá las Tiendas de la Feria
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 mt-1">
                Conocé a los artesanos, visitá el catálogo de cada puesto y contactate directamente.
              </p>
            </div>

            {/* Filtros de Ubicación y Presencia */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white dark:bg-charcoal-700 px-3 py-2 rounded-xl border border-sand-300 dark:border-charcoal-600 text-xs font-semibold shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-forest" />
                <select
                  value={ubicacionActiva}
                  onChange={(e) => setUbicacionActiva(e.target.value as UbicacionFeria | 'todas')}
                  className="bg-transparent text-charcoal-800 dark:text-sand-100 focus:outline-none cursor-pointer"
                >
                  <option value="todas">Todos los Paseos</option>
                  <option value="paseo_andino">Paseo del Andino</option>
                  <option value="parque_sarmiento">Parque Sarmiento</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Filtros por Rubro (Común para ambos modos) */}
        <div className="mb-8">
          <CategoryFilter
            rubroActivo={rubroActivo}
            onSelectRubro={setRubroActivo}
            conteoPorRubro={conteoPorRubro}
          />
        </div>

        {/* Resumen de Búsqueda Activa */}
        {busqueda.trim() !== '' && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sand-200 dark:bg-charcoal-700 px-4 py-3 rounded-2xl text-xs border border-sand-300 dark:border-charcoal-600 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-terracotta shrink-0" />
              <span className="text-charcoal-800 dark:text-sand-100">
                Resultados para: <strong className="text-terracotta">"{busqueda}"</strong>
                {' • '}
                <span className="font-semibold">
                  {feriantes.length} {feriantes.length === 1 ? 'puesto' : 'puestos'}
                </span>
                {' y '}
                <strong className="text-forest dark:text-forest-400">
                  {productosCatalogo.length} {productosCatalogo.length === 1 ? 'artículo' : 'artículos'}
                </strong>
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-terracotta hover:underline font-bold self-start sm:self-auto cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL: CONDICIONAL SEGÚN VISTA DE CLIENTE O VISITANTE */}
        {esCliente ? (
          /* VISTA EXCLUSIVA DEL CLIENTE: CATÁLOGO DE PRODUCTOS O TIENDAS */
          vistaCliente === 'productos' ? (
            <ProductGrid
              productos={productosCatalogo}
              status={productosStatus}
              onRetry={fetchProductos}
              onResetFilters={handleResetFilters}
              onVerDetalle={setSelectedProductModal}
            />
          ) : (
            <StoreGrid
              feriantes={feriantes}
              status={status}
              conteoProductosPorFeriante={conteoProductosPorFeriante}
              onRetry={fetchFeriantes}
              onResetFilters={handleResetFilters}
            />
          )
        ) : (
          /* VISTA DE VISITANTE GENERAL */
          <>
            {/* Sección de Artículos Coincidentes en Búsqueda General */}
            {busqueda.trim() !== '' && productosFiltrados.length > 0 && (
              <div className="mb-10 p-5 sm:p-6 bg-white dark:bg-charcoal-800 rounded-3xl border border-sand-300 dark:border-charcoal-700 shadow-card">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-sand-200 dark:border-charcoal-700">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-terracotta" />
                    <h3 className="text-base sm:text-lg font-extrabold text-charcoal-900 dark:text-white">
                      Artículos encontrados ({productosFiltrados.length})
                    </h3>
                  </div>
                  <span className="text-xs text-charcoal-500 dark:text-sand-400 hidden sm:inline">
                    Creaciones que coinciden con "{busqueda}"
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {productosFiltrados.map((producto) => (
                    <ProductCard
                      key={producto.id}
                      producto={producto}
                      onVerDetalle={setSelectedProductModal}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grilla de Tiendas con 4 Estados de UI */}
            <StoreGrid
              feriantes={feriantes}
              status={status}
              conteoProductosPorFeriante={conteoProductosPorFeriante}
              onRetry={fetchFeriantes}
              onResetFilters={handleResetFilters}
            />
          </>
        )}
      </section>

      {/* 3. Sección Geográfica de Paseos de Ferias (SOLO PARA VISITANTES NO AUTENTICADOS) */}
      {!esCliente && <FeriasSection feriantes={feriantes} />}

      {/* 4. Formulario de Convocatoria / Postulación (SOLO PARA VISITANTES NO AUTENTICADOS) */}
      {!esCliente && (
        <ContactForm
          onSuccessToast={(title, msg) => onShowToast('success', title, msg)}
          onErrorToast={(title, msg) => onShowToast('error', title, msg)}
        />
      )}

      {/* Modal de Ficha Técnica cuando se abre un producto */}
      {selectedProductModal && (
        <ProductModal
          producto={selectedProductModal}
          onClose={() => setSelectedProductModal(null)}
          ferianteUbicacion={
            feriantes.find((f) => f.id === selectedProductModal.ferianteId)?.puestoNumero
          }
        />
      )}
    </div>
  );
};
