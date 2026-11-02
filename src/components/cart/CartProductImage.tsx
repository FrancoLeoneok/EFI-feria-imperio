import { useEffect, useState } from 'react';
import { Producto } from '../../types';
import { productoRepository } from '../../repositories';

export function CartProductImage({ producto, className, alt = '' }: {
  producto: Producto; className: string; alt?: string;
}) {
  const [photo, setPhoto] = useState<{ id: string; url: string }>();
  useEffect(() => {
    if (producto.imagenUrl) return;
    let active = true;
    void productoRepository.getById(producto.id).then((saved) => {
      if (active && saved) setPhoto({ id: saved.id, url: saved.imagenUrl });
    }).catch(() => { /* Keep the local fallback if the photo cannot be read. */ });
    return () => { active = false; };
  }, [producto.id, producto.imagenUrl]);
  const source = producto.imagenUrl || (photo?.id === producto.id ? photo.url : '') || '/logo.png';
  return <img src={source} alt={alt} className={className} />;
}
