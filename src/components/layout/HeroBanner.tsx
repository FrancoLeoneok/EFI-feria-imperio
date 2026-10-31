import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Store } from 'lucide-react';

export const HeroBanner = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);


  return (
    <section id="inicio" className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-terracotta-200/40 dark:bg-terracotta-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-forest-200/30 dark:bg-forest-900/10 blur-[80px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Next Edition Alert Chip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900/50 border border-forest-300 dark:border-forest-700 text-forest-700 dark:text-forest-300 text-xs sm:text-sm font-bold mb-6 shadow-xs animate-pulse">
          <Calendar className="w-4 h-4 text-forest" />
          <span>Próxima Feria: Este Fin de Semana • 16:00 a 22:00 hs</span>
        </div>

        {/* Featured Promotional Banner with CTA */}
        <div className="relative max-w-4xl mx-auto mb-10 rounded-3xl overflow-hidden border border-sand-300 dark:border-charcoal-700 shadow-2xl group bg-sand-200 dark:bg-charcoal-800 aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.4/1]">
          {/* 1. Loading State */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-sand-200 dark:bg-charcoal-800 animate-pulse flex items-center justify-center">
              <span className="text-xs font-semibold text-charcoal-400 dark:text-sand-400">
                Cargando banner de la feria...
              </span>
            </div>
          )}

          {/* 2. Error Fallback State */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-700 to-forest-900 flex flex-col items-center justify-center p-6 text-white text-center">
              <Store className="w-10 h-10 mb-2 opacity-80" />
              <p className="text-lg font-bold">Feria Imperio</p>
              <p className="text-xs text-sand-200">Artesanías y emprendedores de Río Cuarto</p>
            </div>
          )}

          {/* 3. Success State: Image Rendering */}
          <img
            src="/nuevo-banner.png"
            alt="Feria Imperio - Paseo de artesanos y emprendedores en Río Cuarto"
            className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="eager"
            fetchPriority="high"
          />

          {/* Accessible Overlay & "Postularme" Call to Action */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="text-white text-center sm:text-left drop-shadow-sm">
              <p className="text-xs sm:text-sm font-bold text-sand-100">
                ¿Tenés un emprendimiento o elaborás artesanías?
              </p>
              <p className="text-[11px] sm:text-xs text-sand-300 hidden sm:block">
                Sumá tu puesto a los paseos del Andino y Parque Sarmiento.
              </p>
            </div>

            <a href="/#contacto"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-terracotta hover:bg-terracotta-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Abrir formulario para postularme a la feria física"
            >
              <Store className="w-4 h-4" />
              <span>Postularme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main Value Proposition Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal-900 dark:text-white max-w-4xl mx-auto leading-tight mb-6">
          El corazón de las ferias de{' '}
          <span className="text-terracotta underline decoration-terracotta-300 underline-offset-8">
            Río Cuarto
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-600 dark:text-sand-300 leading-relaxed mb-8">
          Descubrí piezas únicas de cerámica, madera, cuero, artesanías y sabores caseros creados por emprendedores del{' '}
          <strong className="text-forest dark:text-forest-400">Paseo del Andino</strong> y el{' '}
          <strong className="text-forest dark:text-forest-400">Parque Sarmiento</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
          <a
            href="/#tiendas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all"
          >
            <span>Explorar Catálogo Digital</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#ferias"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-charcoal-700 hover:bg-sand-100 dark:hover:bg-charcoal-600 text-charcoal-800 dark:text-sand-100 border border-sand-300 dark:border-charcoal-600 font-bold text-sm sm:text-base shadow-xs active:scale-95 transition-all"
          >
            <MapPin className="w-4 h-4 text-forest" />
            <span>Ver Paseos & Ubicaciones</span>
          </a>
        </div>

        {/* Trust & Location Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-charcoal-800/70 border border-sand-300 dark:border-charcoal-700 shadow-card">
            <MapPin className="w-5 h-5 text-terracotta shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-charcoal-900 dark:text-white">Paseo del Andino</p>
              <p className="text-[11px] text-charcoal-500 dark:text-sand-400">Bv. Ameghino & Rieles</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-charcoal-800/70 border border-sand-300 dark:border-charcoal-700 shadow-card">
            <MapPin className="w-5 h-5 text-forest shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-charcoal-900 dark:text-white">Parque Sarmiento</p>
              <p className="text-[11px] text-charcoal-500 dark:text-sand-400">Banda Norte</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/70 dark:bg-charcoal-800/70 border border-sand-300 dark:border-charcoal-700 shadow-card">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-charcoal-900 dark:text-white">Trato Directo</p>
              <p className="text-[11px] text-charcoal-500 dark:text-sand-400">Sin intermediarios ni comisiones</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
