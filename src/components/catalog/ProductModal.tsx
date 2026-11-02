import { customerPrice } from '../../utils/pricing';
import { useEffect, useRef, useState } from 'react';
import { X, Store, Check, Tag, Plus } from 'lucide-react';
import { Producto } from '../../types';
import { formatARS } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ProductQuestions } from '../questions/ProductQuestions';

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
}

export const ProductModal = ({
  producto,
  onClose,
}: ProductModalProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  useEffect(() => { setSelectedImage(0); }, [producto?.id]);
  useEffect(() => {
    if (!producto) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const getControls = () => Array.from(modalRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]') ?? []);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const controls = getControls();
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    getControls()[0]?.focus();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [producto, onClose]);

  if (!producto) return null;
  const images = producto.imagenes?.length ? producto.imagenes : [producto.imagenUrl];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        className="relative w-full max-w-4xl max-h-[90dvh] bg-white dark:bg-charcoal-800 rounded-3xl shadow-2xl border border-sand-300 dark:border-charcoal-700 overflow-y-auto md:overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 dark:bg-charcoal-700/90 text-charcoal-700 dark:text-sand-200 hover:bg-white dark:hover:bg-charcoal-600 shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 md:max-h-[90dvh]">
          {/* Product Image */}
          <div className="flex min-h-0 min-w-0 flex-col bg-sand-200 dark:bg-charcoal-900">
            <div className="relative aspect-square md:aspect-auto md:min-h-80 md:flex-1">
            <img
              src={images[selectedImage] ?? images[0]}
              alt={`${producto.titulo}, foto ${selectedImage + 1}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                {producto.rubro}
              </span>
            </div>
            </div>
            {images.length > 1 && <div className="flex flex-wrap gap-2 p-3" aria-label="Fotos del producto">
              {images.map((image, index) => <button key={index} type="button" aria-label={`Ver foto ${index + 1} de ${producto.titulo}`} aria-pressed={selectedImage === index} onClick={() => setSelectedImage(index)} className={`h-14 w-14 overflow-hidden rounded-lg border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${selectedImage === index ? 'border-terracotta' : 'border-transparent'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}
            </div>}
          </div>

          {/* Details Content */}
          <div className="min-h-0 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8 md:max-h-[90dvh] md:overflow-y-auto">
            <div>
              {/* Feriante */}
              <div className="mb-5 pr-10">
                <div className="flex items-center gap-2 text-sm font-bold text-forest dark:text-forest-400">
                  <Store className="w-4 h-4" />
                  <span>{producto.ferianteNombre}</span>
                </div>
              </div>

              {/* Title */}
              <h2 id="product-detail-title" className="text-2xl lg:text-3xl font-black text-charcoal-900 dark:text-white leading-snug mb-5 break-words">
                {producto.titulo}
              </h2>

              {/* Price */}
              <div className="mb-6">
                <span className="text-2xl sm:text-3xl font-extrabold text-terracotta dark:text-terracotta-300">
                  {formatARS(customerPrice(producto.precio))}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-charcoal-600 dark:text-sand-300 leading-relaxed mb-6 whitespace-pre-line break-words">
                {producto.descripcion}
              </p>

              {/* Specifications if present */}
              {producto.especificaciones && (
                <div className="bg-sand-100 dark:bg-charcoal-700/60 p-4 rounded-2xl border border-sand-200 dark:border-charcoal-600">
                  <h4 className="text-sm font-bold text-charcoal-800 dark:text-sand-200 mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-terracotta dark:text-terracotta-300" />
                    <span>Ficha Artesanal</span>
                  </h4>
                  <ul className="space-y-3 text-sm text-charcoal-600 dark:text-sand-300">
                    {Object.entries(producto.especificaciones).map(([key, val]) => (
                      <li key={key} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-forest dark:text-forest-300 shrink-0 mt-0.5" />
                        <span>
                          <strong>{key}:</strong> {val}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <ProductQuestions key={producto.id} productoId={producto.id} onLogin={() => {
              onClose();
              useAuthStore.getState().openLoginModal('comprador');
            }} />

            {/* Direct Actions: Add to Cart */}
            <div className="pt-4 border-t border-sand-200 dark:border-charcoal-700 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  addItem(producto);
                  onClose();
                }}
                className="group/add w-full min-h-12 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest hover:bg-forest-600 text-white font-bold text-sm shadow-xs transition-[background-color,transform] duration-150 motion-safe:hover:scale-[1.03] motion-safe:active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-charcoal-800 motion-reduce:transition-none"
              >
                <Plus aria-hidden="true" className="w-4 h-4 transition-transform duration-150 motion-safe:group-hover/add:rotate-90 motion-reduce:transition-none" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
