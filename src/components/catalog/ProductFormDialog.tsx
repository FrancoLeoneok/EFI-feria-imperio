import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Feriante, Producto, Rubro } from '../../types';
import { ProductImageUpload } from './ProductImageUpload';
import { ProductCard } from './ProductCard';

interface ProductFormDialogProps {
  feriante: Feriante;
  producto?: Producto;
  onClose: () => void;
  onSave: (producto: Producto) => Promise<void>;
}

const inputClass = 'w-full rounded-xl border border-sand-300 bg-sand-100 px-3.5 py-2.5 text-sm text-charcoal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white';
const labelClass = 'mb-1 block text-xs font-bold text-charcoal-700 dark:text-sand-200';
const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f3f1ec"/><text x="200" y="200" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#52525b">Tu foto aparecerá acá</text></svg>');

export function ProductFormDialog({ feriante, producto, onClose, onSave }: ProductFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [titulo, setTitulo] = useState(producto?.titulo ?? '');
  const [precio, setPrecio] = useState(String(producto?.precio ?? 1000));
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
  const [rubro, setRubro] = useState<Rubro>(producto?.rubro ?? 'artesanias');
  const [images, setImages] = useState<string[]>(producto?.imagenes?.length ? producto.imagenes : producto ? [producto.imagenUrl] : []);
  const [enStock, setEnStock] = useState(producto?.enStock ?? true);
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);
  const [specifications, setSpecifications] = useState(() =>
    Object.entries(producto?.especificaciones ?? {}).map(([name, value]) => ({ id: crypto.randomUUID(), name, value }))
  );
  const [loadingImages, setLoadingImages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  const preview: Producto = {
    id: 'preview', titulo: titulo.trim() || 'Nombre de tu producto',
    descripcion: descripcion.trim() || 'Contá qué hace especial a tu creación.',
    precio: Number(precio) || 0, rubro,
    ferianteId: feriante.id, ferianteNombre: feriante.nombreComercio,
    imagenUrl: images[0] || placeholderImage, imagenes: images,
    enStock, destacado,
    especificaciones: specifications.length ? Object.fromEntries(specifications.map(({ name, value }) => [name.trim(), value.trim()])) : undefined,
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="create-product-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-sand-300 bg-white p-6 text-charcoal shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm sm:p-8 dark:border-charcoal-700 dark:bg-charcoal-800 dark:text-white">
      <div className="mb-5 flex items-start justify-between gap-3">
        <h2 id="create-product-title" className="text-lg font-black">{producto ? 'Editar producto' : `Publicar en ${feriante.nombreComercio}`}</h2>
        <button type="button" disabled={saving} onClick={onClose} aria-label="Cerrar formulario" className="rounded-lg p-2 hover:bg-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:hover:bg-charcoal-700"><X aria-hidden="true" className="h-5 w-5" /></button>
      </div>
      <form className="space-y-4" onSubmit={async (event) => {
        event.preventDefault();
        if (saving || loadingImages) return;
        if (!titulo.trim() || !descripcion.trim()) { setError('Completá el título y la descripción.'); return; }
        if (!images.length) { setError('Agregá al menos una foto del producto.'); return; }
        if (!Number.isFinite(Number(precio)) || Number(precio) < 100) { setError('El precio debe ser de al menos $100.'); return; }
        if (specifications.some(({ name, value }) => !name.trim() || !value.trim())) { setError('Completá el nombre y el valor de cada dato de la ficha artesanal, o quitalo.'); return; }
        if (new Set(specifications.map(({ name }) => name.trim().toLocaleLowerCase())).size !== specifications.length) { setError('Cada dato de la ficha artesanal debe tener un nombre diferente.'); return; }
        setError(''); setSaving(true);
        try { await onSave({ ...producto, ...preview, id: producto?.id ?? `prd-${crypto.randomUUID()}` }); }
        catch { setError('No pudimos guardar el producto. Intentá otra vez o liberá espacio en el navegador.'); setSaving(false); }
      }}>
        <fieldset disabled={saving} className="space-y-4">
          <div><label htmlFor="product-title" className={labelClass}>Título del producto *</label><input id="product-title" autoFocus required value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Ej: Mate torneado en algarrobo" className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="product-price" className={labelClass}>Precio ($ ARS) *</label><input id="product-price" type="number" required min="100" step="0.01" value={precio} onChange={(event) => setPrecio(event.target.value)} className={inputClass} /></div>
            <div><label htmlFor="product-category" className={labelClass}>Rubro *</label><select id="product-category" value={rubro} onChange={(event) => setRubro(event.target.value as Rubro)} className={inputClass}><option value="artesanias">Artesanías</option><option value="ceramica">Cerámica</option><option value="gastronomia">Gastronomía</option><option value="marroquineria">Marroquinería</option><option value="madera">Madera</option><option value="indumentaria">Indumentaria</option></select></div>
          </div>
          <div><label htmlFor="product-description" className={labelClass}>Descripción artesanal *</label><textarea id="product-description" required rows={3} value={descripcion} onChange={(event) => setDescripcion(event.target.value)} placeholder="Materiales, proceso de elaboración, medidas…" className={`${inputClass} resize-y`} /></div>
          <ProductImageUpload images={images} onChange={setImages} onLoadingChange={setLoadingImages} />
          <div className="flex flex-wrap gap-5 text-sm">
            <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={enStock} onChange={(event) => setEnStock(event.target.checked)} className="h-4 w-4 accent-forest" />En stock</label>
            <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={destacado} onChange={(event) => setDestacado(event.target.checked)} className="h-4 w-4 accent-terracotta" />Producto destacado</label>
          </div>
          <section aria-labelledby="product-specifications-title" className="space-y-3">
            <h3 id="product-specifications-title" className="text-sm font-bold">Ficha artesanal</h3>
            <p className="text-xs text-charcoal-500 dark:text-sand-300">Agregá detalles como material, medidas u origen.</p>
            {specifications.map((specification, index) => (
              <div key={specification.id} className="flex items-end gap-2">
                <div className="min-w-0 flex-1"><label htmlFor={`spec-name-${specification.id}`} className={labelClass}>Dato {index + 1}</label><input id={`spec-name-${specification.id}`} value={specification.name} onChange={(event) => setSpecifications((current) => current.map((item) => item.id === specification.id ? { ...item, name: event.target.value } : item))} placeholder="Material" className={inputClass} /></div>
                <div className="min-w-0 flex-1"><label htmlFor={`spec-value-${specification.id}`} className={labelClass}>Valor {index + 1}</label><input id={`spec-value-${specification.id}`} value={specification.value} onChange={(event) => setSpecifications((current) => current.map((item) => item.id === specification.id ? { ...item, value: event.target.value } : item))} placeholder="Algarrobo" className={inputClass} /></div>
                <button type="button" aria-label={`Quitar dato ${index + 1}`} onClick={() => setSpecifications((current) => current.filter((item) => item.id !== specification.id))} className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-red-700 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:text-red-400 dark:hover:bg-red-900/30"><X aria-hidden="true" className="h-4 w-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => setSpecifications((current) => [...current, { id: crypto.randomUUID(), name: '', value: '' }])} className="min-h-11 rounded-xl border border-sand-300 px-3 text-xs font-bold hover:bg-sand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:border-charcoal-600 dark:hover:bg-charcoal-700">Agregar dato a la ficha</button>
          </section>
        </fieldset>
        <section aria-labelledby="product-preview-title" className="border-t border-sand-300 pt-5 dark:border-charcoal-600">
          <h3 id="product-preview-title" className="text-sm font-bold">Así se verá en tu tienda</h3>
          <p className="mb-4 mt-1 text-xs text-charcoal-500 dark:text-sand-300">La vista previa se actualiza mientras completás los datos.</p>
          <div className="mx-auto max-w-xs"><ProductCard key={preview.imagenUrl} producto={preview} preview onVerDetalle={() => {}} /></div>
        </section>
        <p role="alert" className="text-xs text-red-700 dark:text-red-400">{error}</p>
        <div className="flex justify-end gap-2.5 pt-2">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-sand-200 dark:hover:bg-charcoal-700">Cancelar</button>
          <button type="submit" disabled={loadingImages || saving} className="rounded-xl bg-terracotta px-5 py-2.5 text-xs font-bold text-white hover:bg-terracotta-600 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta">{saving ? 'Guardando…' : loadingImages ? 'Cargando fotos…' : producto ? 'Guardar cambios' : 'Publicar en mi tienda'}</button>
        </div>
      </form>
    </dialog>
  );
}
