import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { readStoreSales, StoreSale } from '../../repositories/localOrders';
import { subscribeOrdersChanged } from '../../utils/orderEvents';
import { formatARS } from '../../utils/formatters';
import { roundMoney } from '../../utils/pricing';

function ReceiptPreview({ source, onClose }: { source: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} onClose={onClose} aria-label="Comprobante de transferencia" className="m-auto w-[calc(100%_-_2rem)] max-w-3xl rounded-2xl bg-white p-4 text-charcoal-900 backdrop:bg-black/70 dark:bg-charcoal-800 dark:text-white">
    <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-bold">Comprobante de transferencia</h3><button type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar comprobante" className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:hover:bg-charcoal-700"><X aria-hidden="true" className="h-5 w-5" /></button></div>
    <img src={source} alt="Comprobante de transferencia ampliado" className="mx-auto max-h-[75vh] max-w-full object-contain" />
  </dialog>;
}

function SaleCard({ sale }: { sale: StoreSale }) {
  const [preview, setPreview] = useState<string>();
  const baseTotal = roundMoney(sale.grupo.items.reduce((sum, { producto, cantidad }) => sum + (producto.precioBase ?? producto.precio) * cantidad, 0));
  const commission = roundMoney(sale.grupo.subtotal - baseTotal);
  return <article aria-label={`Venta ${sale.pedidoId}`} className="rounded-2xl border border-sand-300 p-4 sm:p-5 dark:border-charcoal-600">
    <div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-sm font-extrabold">{sale.comprador.nombre}</h3><p className="mt-1 break-all text-xs text-charcoal-500 dark:text-sand-300">{sale.comprador.email}</p>{sale.comprador.telefono && <p className="mt-1 text-xs">{sale.comprador.telefono}</p>}</div><div><p className="text-base font-extrabold text-terracotta dark:text-terracotta-300">{formatARS(sale.grupo.subtotal)}</p><p className="mt-1 text-xs text-charcoal-500 dark:text-sand-300">{new Date(sale.fecha).toLocaleString('es-AR')}</p></div></div>
    <p className="mt-3 break-all text-[11px] text-charcoal-500 dark:text-sand-400">Pedido {sale.pedidoId}</p>
    <dl className="mt-3 space-y-1 text-xs">
      <div className="flex flex-wrap justify-between gap-2"><dt>Tu importe base</dt><dd className="font-bold">{formatARS(baseTotal)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2"><dt>Comisión de Feria Imperio{sale.grupo.items.every(({ producto }) => producto.precioBase !== undefined) ? ' (10%)' : ''}</dt><dd>{formatARS(commission)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2"><dt>Total cobrado al cliente por tu tienda</dt><dd>{formatARS(sale.grupo.subtotal)}</dd></div>
    </dl>
    <ul className="my-4 space-y-3">{sale.grupo.items.map(({ producto, cantidad }) => <li key={producto.id} className="flex items-center gap-3"><img src={producto.imagenUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-bold">{producto.titulo}</p><p className="text-xs text-charcoal-500 dark:text-sand-300">{cantidad} × {formatARS(producto.precio)}</p></div><span className="text-xs font-bold">{formatARS(producto.precio * cantidad)}</span></li>)}</ul>
    <div className="border-t border-sand-200 pt-4 dark:border-charcoal-600"><h4 className="text-xs font-bold">Comprobantes ({sale.grupo.comprobantes.length})</h4>
      {sale.grupo.comprobantes.length ? <ul className="mt-3 flex flex-wrap gap-3">{sale.grupo.comprobantes.map((source, index) => <li key={`${source.slice(-32)}-${index}`}><button type="button" onClick={() => setPreview(source)} aria-label={`Ver comprobante ${index + 1} del pedido ${sale.pedidoId}`} className="rounded-xl border border-sand-300 p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:border-charcoal-600"><img src={source} alt={`Comprobante ${index + 1}`} className="h-20 w-20 rounded-lg object-cover" /></button></li>)}</ul> : <p className="mt-2 text-xs text-charcoal-500 dark:text-sand-300">El cliente todavía no adjuntó comprobantes.</p>}
      <p className="mt-3 text-xs font-semibold text-terracotta dark:text-terracotta-300">Pago a Feria Imperio pendiente de verificación</p>
      <p className="mt-1 text-xs text-charcoal-500 dark:text-sand-300">El comprobante corresponde al pago total del pedido, que puede incluir otras tiendas.</p>
    </div>
    {preview && <ReceiptPreview source={preview} onClose={() => setPreview(undefined)} />}
  </article>;
}

export function StoreSales({ ferianteId }: { ferianteId: string }) {
  const [sales, setSales] = useState<StoreSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    let request = 0;
    async function refresh() {
      const current = ++request;
      try {
        const next = await readStoreSales(ferianteId);
        if (active && current === request) { setSales(next); setError(''); }
      } catch { if (active && current === request) setError('No pudimos cargar las ventas. Volvé a intentar.'); }
      finally { if (active && current === request) setLoading(false); }
    }
    void refresh();
    const unsubscribe = subscribeOrdersChanged(() => { void refresh(); });
    return () => { active = false; unsubscribe(); };
  }, [ferianteId, retry]);

  return <section aria-labelledby="store-sales-title" className="mb-8 rounded-3xl border border-sand-300 bg-white p-5 shadow-card sm:p-6 dark:border-charcoal-700 dark:bg-charcoal-800">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 id="store-sales-title" className="flex items-center gap-2 text-lg font-extrabold"><ShoppingBag aria-hidden="true" className="h-5 w-5 text-forest dark:text-forest-300" />Ventas</h2><p className="mt-2 text-xs text-charcoal-500 dark:text-sand-300">Pedidos de tu tienda · Se actualizan en este navegador.</p></div><span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-bold text-forest dark:bg-forest-900 dark:text-forest-300">{sales.length} {sales.length === 1 ? 'venta' : 'ventas'}</span></div>
    {loading && <p role="status" className="text-sm">Cargando ventas…</p>}
    {error && <div><p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p><button className="min-h-11 text-sm font-bold underline" onClick={() => setRetry((value) => value + 1)}>Reintentar ventas</button></div>}
    {!loading && !error && sales.length === 0 && <div className="rounded-2xl bg-sand-100 p-6 text-center dark:bg-charcoal-700/40"><p className="text-sm font-bold">Todavía no tenés ventas</p><p className="mt-2 text-xs text-charcoal-500 dark:text-sand-300">Cuando un cliente confirme una compra con productos de tu tienda, aparecerá acá.</p></div>}
    {!error && <div className="grid items-start gap-4 lg:grid-cols-2">{sales.map((sale) => <SaleCard key={sale.pedidoId} sale={sale} />)}</div>}
  </section>;
}
