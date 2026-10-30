import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Store,
  MapPin,
  Calendar,
  Instagram,
  Sparkles,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { Feriante, Producto, UIStatus } from '../types';
import { ferianteRepository, productoRepository } from '../repositories';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductModal } from '../components/catalog/ProductModal';

export const StoreDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [feriante, setFeriante] = useState<Feriante | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [status, setStatus] = useState<UIStatus>('loading');
  const [productoModal, setProductoModal] = useState<Producto | null>(null);
  const [busquedaInterna, setBusquedaInterna] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    setStatus('loading');
    Promise.all([
      ferianteRepository.getById(id),
      productoRepository.getByFeriante(id),
    ])
      .then(([f, prods]) => {
        if (!f) {
          setStatus('error');
          return;
        }
        setFeriante(f);
        setProductos(prods);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-8 w-48 bg-sand-300 dark:bg-charcoal-700 rounded-xl" />
        <div className="h-64 sm:h-80 w-full bg-sand-300 dark:bg-charcoal-700 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 bg-sand-200 dark:bg-charcoal-700 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error' || !feriante) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-charcoal-900 dark:text-white mb-2">
          Puesto o Tienda no encontrada
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 mb-6">
          El enlace seleccionado no corresponde a un puesto registrado en Feria Imperio.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-terracotta text-white font-bold text-sm shadow-md hover:bg-terracotta-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio de Tiendas</span>
        </Link>
      </div>
    );
  }

  // Productos filtrados dentro de la tienda
  const productosFiltrados = productos.filter((p) => {
    if (!busquedaInterna.trim()) return true;
    const term = busquedaInterna.toLowerCase();
    return p.titulo.toLowerCase().includes(term) || p.descripcion.toLowerCase().includes(term);
  });

  const ubicacionTexto =
    feriante.ubicacionFeria === 'paseo_andino'
      ? 'Paseo del Andino'
      : feriante.ubicacionFeria === 'parque_sarmiento'
      ? 'Parque Sarmiento'
      : 'Paseo del Andino & Parque Sarmiento';

  return (
    <div className="pb-20">
      {/* 1. Barra de Navegación / Breadcrumb */}
      <div className="bg-sand-100 dark:bg-charcoal-800 border-b border-sand-300 dark:border-charcoal-700 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-charcoal-600 dark:text-sand-300 hover:text-terracotta dark:hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Directorio de Puestos</span>
          </Link>
        </div>
      </div>

      {/* 2. Banner de Portada de la Tienda */}
      <div className="relative h-60 sm:h-80 lg:h-96 w-full overflow-hidden bg-sand-200 dark:bg-charcoal-900">
        <img
          src={feriante.bannerUrl}
          alt={`Banner de ${feriante.nombreComercio}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* 3. Perfil y Cabecera de la Tienda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-charcoal-700 shadow-xl mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Avatar y Datos del Taller */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative shrink-0">
                <img
                  src={feriante.avatarUrl}
                  alt={feriante.nombreResponsable}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white dark:border-charcoal-800 shadow-lg bg-sand-200"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center shadow-md">
                  <Store className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-terracotta-100 text-terracotta dark:bg-terracotta-900/40 dark:text-terracotta-300">
                    {feriante.rubroPrincipal}
                  </span>
                  {feriante.findeConfirmado && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest dark:bg-forest-900/40 dark:text-forest-300">
                      <Calendar className="w-3 h-3" />
                      <span>Finde Confirmado</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 dark:text-white leading-tight">
                  {feriante.nombreComercio}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-terracotta dark:text-terracotta-300 mt-0.5">
                  Artesano responsable: {feriante.nombreResponsable}
                </p>
              </div>
            </div>

            {/* Acciones de Contacto */}
            {feriante.instagram && (
              <div className="flex items-center gap-3">
                <a
                  href={`https://instagram.com/${feriante.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-sand-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-sand-200 hover:text-terracotta transition-colors shadow-xs"
                  title="Instagram del emprendedor"
                  aria-label="Instagram del emprendedor"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Biografía y Ubicación del Gazebo */}
          <div className="mt-6 pt-6 border-t border-sand-200 dark:border-charcoal-700 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 dark:text-sand-400">
                Sobre el Emprendimiento
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-700 dark:text-sand-200 leading-relaxed">
                {feriante.bio}
              </p>
            </div>

            <div className="bg-sand-100 dark:bg-charcoal-700/60 p-4 rounded-2xl border border-sand-200 dark:border-charcoal-600 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 dark:text-sand-400">
                Ubicación del Puesto en Feria
              </h3>
              <div className="flex items-start gap-2 text-xs text-charcoal-700 dark:text-sand-200">
                <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-charcoal-900 dark:text-white">{ubicacionTexto}</p>
                  <p className="text-charcoal-500 dark:text-sand-400">{feriante.puestoNumero}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Catálogo Exclusivo de Esta Tienda */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-900/40 text-forest text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Catálogo del Puesto</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 dark:text-white">
                Creaciones de {feriante.nombreComercio}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-500 dark:text-sand-400">
                {productos.length} {productos.length === 1 ? 'producto artesanal disponible' : 'productos artesanales disponibles'}
              </p>
            </div>

            {/* Buscador dentro de la tienda */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={busquedaInterna}
                onChange={(e) => setBusquedaInterna(e.target.value)}
                placeholder="Buscar en este puesto..."
                className="w-full bg-sand-200 dark:bg-charcoal-700 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-2.5 rounded-2xl text-xs border border-transparent focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>

          {/* Grilla de Productos */}
          {productosFiltrados.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-charcoal-800 rounded-3xl border border-sand-300 dark:border-charcoal-700">
              <Store className="w-12 h-12 text-terracotta mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-charcoal-900 dark:text-white mb-1">
                No encontramos productos con esa búsqueda
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-sand-400 mb-4">
                Probá con otro término o limpiá el filtro interno.
              </p>
              <button
                onClick={() => setBusquedaInterna('')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-white text-xs font-bold shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ver todos los productos del puesto</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onVerDetalle={setProductoModal}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal de Ficha Técnica */}
      <ProductModal
        producto={productoModal}
        onClose={() => setProductoModal(null)}
        ferianteUbicacion={`${ubicacionTexto} • ${feriante.puestoNumero}`}
      />
    </div>
  );
};
