import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Plus, Store, Tag } from 'lucide-react';
import { productoRepository } from '../repositories';
import { Producto } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useStockStore } from '../store/useStockStore';
import { customerPrice } from '../utils/pricing';
import { formatARS } from '../utils/formatters';
import { ProductGallery } from '../components/catalog/ProductGallery';
import { ProductQuestions } from '../components/questions/ProductQuestions';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ id: string | undefined; producto: Producto | null; error: boolean } | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const disponibilidad = useStockStore((state) => state.disponibilidad);
  const loading = result?.id !== id || result === null;
  const producto = loading ? null : result.producto;

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);
    productoRepository.getById(id ?? '').then(
      (item) => { if (active) setResult({ id, producto: item, error: false }); },
      () => { if (active) setResult({ id, producto: null, error: true }); },
    );
    return () => { active = false; };
  }, [id, attempt]);

  useEffect(() => {
    if (!producto) return;
    const previousTitle = document.title;
    document.title = `${producto.titulo} | Feria Imperio`;
    titleRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [producto]);

  if (loading) return (
    <main aria-busy="true" aria-label="Detalle del producto" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p role="status" className="mb-6 text-sm text-charcoal-600 dark:text-sand-300">Cargando producto…</p>
      <div aria-hidden="true" className="grid gap-10 motion-safe:animate-pulse md:grid-cols-2">
        <div className="aspect-[4/5] rounded-3xl bg-sand-200 dark:bg-charcoal-700" />
        <div className="space-y-6"><div className="h-12 rounded-xl bg-sand-200 dark:bg-charcoal-700" /><div className="h-8 w-1/2 rounded-xl bg-sand-200 dark:bg-charcoal-700" /><div className="h-40 rounded-xl bg-sand-200 dark:bg-charcoal-700" /></div>
      </div>
    </main>
  );

  if (!producto) return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="mb-3 text-2xl font-extrabold text-charcoal-900 dark:text-white">{result?.error ? 'No pudimos cargar el producto' : 'Producto no encontrado'}</h1>
      <p className="mb-6 text-sm text-charcoal-600 dark:text-sand-300">{result?.error ? 'Intentá nuevamente para ver el detalle.' : 'Este producto ya no está disponible en el catálogo.'}</p>
      {result?.error && <button type="button" onClick={() => { setResult(null); setAttempt((value) => value + 1); }} className="mb-6 min-h-11 rounded-xl bg-forest px-5 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">Reintentar</button>}
      <Link to="/#catalogo" className="flex min-h-11 items-center justify-center gap-2 font-bold text-terracotta dark:text-terracotta-300"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver al catálogo</Link>
    </main>
  );

  const inStock = disponibilidad[producto.id] ?? producto.enStock;
  const images = [...new Set(producto.imagenes?.length ? producto.imagenes : [producto.imagenUrl])];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <nav aria-label="Ruta del producto" className="mb-6 sm:mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:text-sm">
          <li><Link to={`/tienda/${encodeURIComponent(producto.ferianteId)}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-charcoal-600 hover:text-terracotta dark:text-sand-300 dark:hover:text-terracotta-300"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Catálogo</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5 text-charcoal-400" /></li>
          <li className="min-w-0 break-words font-semibold text-charcoal-900 dark:text-sand-100" aria-current="page">{producto.titulo}</li>
        </ol>
      </nav>

      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-14">
        <ProductGallery key={producto.id} images={images} title={producto.titulo} />
        <div className="min-w-0">
          <Link to={`/tienda/${encodeURIComponent(producto.ferianteId)}`} className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-forest hover:underline dark:text-forest-300"><Store aria-hidden="true" className="h-4 w-4 shrink-0" /><span className="break-words">{producto.ferianteNombre}</span></Link>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal-500 dark:text-sand-400">{producto.rubro}</p>
          <h1 ref={titleRef} tabIndex={-1} className="mb-6 break-words text-3xl font-extrabold leading-tight tracking-tight text-charcoal-900 outline-none dark:text-white lg:text-4xl">{producto.titulo}</h1>

          <div className="border-y border-sand-300 py-5 dark:border-charcoal-700">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-500 dark:text-sand-400">Precio</p>
            <p className="text-3xl font-extrabold text-terracotta dark:text-terracotta-300 sm:text-4xl">{formatARS(customerPrice(producto.precio))}</p>
            <p className={`mt-3 text-sm font-semibold ${inStock ? 'text-forest dark:text-forest-300' : 'text-charcoal-500 dark:text-sand-400'}`}>{inStock ? 'Disponible' : 'Sin stock por el momento'}</p>
          </div>

          <div className="py-6">
            <h2 className="mb-3 text-base font-bold text-charcoal-900 dark:text-sand-100">Sobre este producto</h2>
            <p className="whitespace-pre-line break-words text-sm leading-relaxed text-charcoal-600 dark:text-sand-300 sm:text-base">{producto.descripcion}</p>
          </div>

          <button type="button" disabled={!inStock} onClick={() => addItem(producto)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-50">
            <Plus aria-hidden="true" className="h-4 w-4" />{inStock ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>

      <div className="mt-10 grid items-start gap-8 border-t border-sand-300 pt-8 dark:border-charcoal-700 sm:mt-12 md:grid-cols-2 lg:gap-14">
        {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 && <section aria-label="Ficha artesanal" className="min-w-0 rounded-2xl border border-sand-300 bg-white p-5 dark:border-charcoal-700 dark:bg-charcoal-800 sm:p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-charcoal-900 dark:text-sand-100"><Tag aria-hidden="true" className="h-4 w-4 text-terracotta dark:text-terracotta-300" />Ficha artesanal</h2>
          <dl className="space-y-4 text-sm text-charcoal-600 dark:text-sand-300">
            {Object.entries(producto.especificaciones).map(([key, value]) => <div key={key} className="min-w-0 break-words"><dt className="flex items-start gap-2 font-bold"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-forest dark:text-forest-300" />{key}</dt><dd className="ml-6 mt-1">{value}</dd></div>)}
          </dl>
        </section>}
        <div className="min-w-0 md:col-start-2"><ProductQuestions key={producto.id} productoId={producto.id} onLogin={() => useAuthStore.getState().openLoginModal('comprador')} /></div>
      </div>
    </main>
  );
}
