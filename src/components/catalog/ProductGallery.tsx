import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const image = images[selected];
  const controlClass = 'absolute top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-white/95 text-charcoal-700 shadow-sm hover:bg-sand-200 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-sand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta';

  return (
    <section aria-label="Fotos del producto" className="min-w-0">
      <div className="relative flex aspect-[4/5] max-h-[680px] items-center justify-center overflow-hidden rounded-3xl border border-sand-300 bg-sand-200 dark:border-charcoal-700 dark:bg-charcoal-900">
        {image && failedImage !== image ? (
          <img src={image} alt={`${title}, foto ${selected + 1}`} onError={() => setFailedImage(image)} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center text-charcoal-500 dark:text-sand-400">
            <ImageOff aria-hidden="true" className="h-10 w-10" />
            <p>La foto no está disponible.</p>
          </div>
        )}
        {images.length > 1 && <>
          <button type="button" aria-label="Foto anterior" onClick={() => setSelected((current) => (current - 1 + images.length) % images.length)} className={`${controlClass} left-3 sm:left-4`}><ChevronLeft aria-hidden="true" className="h-5 w-5" /></button>
          <button type="button" aria-label="Foto siguiente" onClick={() => setSelected((current) => (current + 1) % images.length)} className={`${controlClass} right-3 sm:right-4`}><ChevronRight aria-hidden="true" className="h-5 w-5" /></button>
        </>}
      </div>
      {images.length > 1 && <div className="mt-4 flex flex-wrap justify-center gap-3">
        {images.map((source, index) => (
          <button key={source} type="button" aria-label={`Ver foto ${index + 1} de ${title}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`h-16 w-16 overflow-hidden rounded-xl border-2 bg-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${selected === index ? 'border-terracotta' : 'border-sand-300 dark:border-charcoal-600'}`}>
            <img src={source} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>}
      <p role="status" aria-live="polite" className="sr-only">Foto {selected + 1} de {images.length}</p>
    </section>
  );
}
