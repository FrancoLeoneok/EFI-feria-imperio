import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const MAX_IMAGES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No pudimos leer la imagen. Intentá cargarla otra vez.'));
    reader.onload = () => {
      const source = String(reader.result);
      const image = new Image();
      image.onload = () => resolve(source);
      image.onerror = () => reject(new Error(`La imagen ${file.name} no se puede abrir. Elegí otra.`));
      image.src = source;
    };
    reader.readAsDataURL(file);
  });
}

export function ProductImageUpload({ images, onChange, onLoadingChange }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function addFiles(files: File[]) {
    if (busyRef.current || files.length === 0) return;
    setError('');
    if (images.length + files.length > MAX_IMAGES) {
      setError('Podés subir hasta 6 fotos. Quitá alguna antes de agregar más.');
      return;
    }
    const invalid = files.find((file) => !IMAGE_TYPES.includes(file.type) || file.size > MAX_BYTES);
    if (invalid) {
      setError(`${invalid.name}: elegí una imagen JPG, PNG o WebP de hasta 5 MB.`);
      return;
    }
    busyRef.current = true;
    setLoading(true);
    onLoadingChange(true);
    try {
      const sources = await Promise.all(files.map(readImage));
      onChange([...images, ...sources]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos cargar las fotos. Intentá otra vez.');
    } finally {
      busyRef.current = false;
      setLoading(false);
      onLoadingChange(false);
    }
  }

  return (
    <div className="space-y-3">
      <p id="product-images-label" className="text-xs font-bold text-charcoal-700 dark:text-sand-200">Fotos del producto</p>
      <div
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          aria-labelledby="product-images-label product-images-action"
          aria-describedby="product-images-help product-images-error"
          aria-busy={loading}
          className={`group w-full rounded-2xl border-2 border-dashed p-6 text-center transition-[background-color,border-color,transform] duration-150 hover:border-terracotta hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none ${dragging ? 'border-terracotta bg-terracotta-50 dark:bg-terracotta-900/20' : 'border-sand-400 bg-sand-100 dark:border-charcoal-500 dark:bg-charcoal-700/40'}`}
        >
          <Upload aria-hidden="true" className="mx-auto mb-2 h-6 w-6 text-terracotta transition-transform duration-150 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none" />
          <span id="product-images-action" className="block text-sm font-bold text-charcoal-900 dark:text-white">{loading ? 'Cargando fotos…' : dragging ? 'Soltá tus fotos acá' : 'Arrastrá tus fotos o hacé clic para subir'}</span>
          <span id="product-images-help" className="mt-1 block text-xs text-charcoal-500 dark:text-sand-300">Hasta 6 fotos · JPG, PNG o WebP · 5 MB por foto</span>
        </button>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" aria-label="Seleccionar fotos del producto" onChange={(event) => { void addFiles(Array.from(event.target.files ?? [])); event.target.value = ''; }} />
      </div>
      <p id="product-images-error" role="alert" className="text-xs text-red-700 dark:text-red-400">{error}</p>
      {images.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-charcoal-500 dark:text-sand-300">La primera foto será la portada. {images.length} de 6 fotos.</p>
          <ul className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <li key={`${index}-${image.slice(-24)}`} className="relative aspect-square overflow-hidden rounded-xl border border-sand-300 dark:border-charcoal-600">
                <img src={image} alt={`Foto ${index + 1} del producto`} className="h-full w-full object-cover" />
                {index === 0 && <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold text-white">Portada</span>}
                <button type="button" disabled={loading} onClick={() => onChange(images.filter((_, i) => i !== index))} aria-label={`Quitar foto ${index + 1}`} className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-charcoal hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"><X aria-hidden="true" className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
