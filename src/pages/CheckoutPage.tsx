import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { confirmPurchase } from '../repositories/checkout';
import { ferianteRepository } from '../repositories';
import { groupItems, Order, readOrder } from '../repositories/localOrders';
import { Feriante } from '../types';
import { checkoutButton, checkoutCard, OrderProducts } from '../components/cart/OrderProducts';
import { OrderConfirmation } from '../components/cart/OrderConfirmation';
import { formatARS } from '../utils/formatters';

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const revision = useCartStore((state) => state.revision);
  const comprador = useAuthStore((state) => state.currentComprador);
  const openLogin = useAuthStore((state) => state.openLoginModal);
  const [params, setParams] = useSearchParams();
  const orderId = params.get('pedido');
  const [tiendas, setTiendas] = useState<Feriante[]>([]);
  const [loadedOrder, setOrder] = useState<Order>();
  const order = loadedOrder?.comprador.id === comprador?.id ? loadedOrder : undefined;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setOrder(undefined);
    const load = async () => {
      try {
        if (orderId && comprador) {
          const saved = await readOrder(orderId, comprador.id);
          if (active) {
            setOrder(saved);
            if (!saved) setError('No encontramos este pedido para tu cuenta.');
          }
        } else {
          const stores = await ferianteRepository.getAll();
          if (active) setTiendas(stores);
        }
      } catch { if (active) setError('No pudimos cargar los datos de compra. Volvé a intentar.'); }
      finally { if (active) setLoading(false); }
    };
    void load();
    return () => { active = false; };
  }, [orderId, comprador?.id, retry]);

  // Another tab can log out or switch accounts while checkout is open.
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.storageArea === localStorage && (event.key === 'feria_imperio_auth' || event.key === null)) void useAuthStore.persist.rehydrate();
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const grupos = groupItems(items, tiendas);
  const total = grupos.reduce((sum, group) => sum + group.subtotal, 0);

  async function finalize() {
    if (busy.current || !comprador) return;
    busy.current = true; setSubmitting(true); setError('');
    try {
      const saved = await confirmPurchase(comprador, revision);
      setParams({ pedido: saved.id }, { replace: true });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No pudimos guardar la compra. Revisá el espacio disponible y volvé a intentar.'); }
    finally { busy.current = false; setSubmitting(false); }
  }

  return <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6">
    <Link to="/#tiendas" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-charcoal-500 dark:text-sand-300"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Seguir explorando</Link>
    <div className="mb-8"><p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-terracotta dark:text-terracotta-300">Feria Imperio · Tu pedido</p><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{order && comprador ? 'Compra realizada' : 'Finalizá tu compra'}</h1><p className="mt-3 text-sm text-charcoal-500 dark:text-sand-300">{order ? 'Gracias por apoyar a nuestros feriantes. Completá el pago a cada tienda por transferencia.' : 'Revisá tus productos y confirmá tu pedido con los datos de tu cuenta.'}</p></div>
    {!comprador ? <section className={`${checkoutCard} space-y-4`}><h2 className="text-lg font-bold">Ingresá con tu cuenta de cliente</h2><p className="text-sm">Usaremos los datos de tu cuenta para completar la compra.</p><button className={checkoutButton} onClick={() => openLogin('comprador')}>Ingresar como cliente</button></section>
      : loading ? <p role="status" className={checkoutCard}>Cargando tu compra…</p>
      : order ? <OrderConfirmation order={order} />
      : orderId ? <section className={`${checkoutCard} space-y-4`}><p role="alert">{error}</p><button className={checkoutButton} onClick={() => setRetry((value) => value + 1)}>Reintentar</button><Link className="ml-4 text-sm font-bold underline" to="/checkout">Volver al carrito</Link></section>
      : items.length === 0 ? <section className={`${checkoutCard} space-y-4`}><ShoppingBag aria-hidden="true" className="h-10 w-10 text-terracotta" /><h2 className="text-xl font-bold">Tu carrito está vacío</h2><Link to="/#tiendas" className={checkoutButton}>Explorar tiendas</Link></section>
      : <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]"><div className="space-y-5"><section className={checkoutCard}><h2 className="mb-3 font-extrabold">Datos del cliente</h2><p className="text-sm font-bold">{comprador.nombre}</p><p className="mt-1 break-words text-sm">{comprador.email}</p>{comprador.telefono && <p className="mt-1 text-sm">{comprador.telefono}</p>}{comprador.ubicacion && <p className="mt-1 text-sm text-charcoal-500 dark:text-sand-300">{comprador.ubicacion}</p>}</section>{grupos.map((group) => <OrderProducts key={group.tienda.id} group={group} />)}</div>
        <aside className={`${checkoutCard} space-y-5 lg:sticky lg:top-24`}><h2 className="text-lg font-extrabold">Resumen de compra</h2><p className="text-sm text-charcoal-500 dark:text-sand-300">{items.reduce((sum, item) => sum + item.cantidad, 0)} productos · {grupos.length} {grupos.length === 1 ? 'tienda' : 'tiendas'}</p><div className="flex justify-between gap-3 text-xl font-extrabold"><span>Total</span><span className="text-terracotta dark:text-terracotta-300">{formatARS(total)}</span></div><p className="text-xs text-charcoal-500 dark:text-sand-300">Después de confirmar, verás los datos para transferir a cada tienda y cargar tus comprobantes. No se realiza ningún débito automático.</p><button className={`${checkoutButton} w-full`} disabled={submitting || !!error} onClick={() => void finalize()}>{submitting ? 'Confirmando…' : 'Finalizar compra'}</button><p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>{error && <button className="text-sm font-bold underline" onClick={() => setRetry((value) => value + 1)}>Revisar y reintentar</button>}</aside>
      </div>}
  </main>;
}
