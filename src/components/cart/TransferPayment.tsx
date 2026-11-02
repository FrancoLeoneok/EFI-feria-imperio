import { useState } from 'react';
import { Order, saveReceipts } from '../../repositories/localOrders';
import { PLATFORM_PAYMENT } from '../../config/platformPayment';
import { ProductImageUpload } from '../catalog/ProductImageUpload';
import { formatARS } from '../../utils/formatters';
import { checkoutButton, checkoutCard } from './OrderProducts';

export function TransferPayment({ order }: { order: Order }) {
  const payment = order.pago ?? PLATFORM_PAYMENT;
  // Preserve legacy receipts without changing the totals of historical orders.
  const savedImages = order.comprobantes ?? [...new Set(order.grupos.flatMap((group) => group.comprobantes))];
  const [draftImages, setDraftImages] = useState<string[] | null>(null);
  const images = draftImages ?? savedImages;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function save() {
    setSaving(true); setError(''); setMessage('');
    try {
      await saveReceipts(order.id, order.comprador.id, images);
      setMessage('Comprobantes guardados. El pago queda pendiente de verificación por Feria Imperio.');
    } catch { setError('No pudimos guardar los comprobantes. Revisá el espacio disponible y volvé a intentar.'); }
    finally { setSaving(false); }
  }
  return <section className={`${checkoutCard} space-y-4`} aria-label="Transferencia a Feria Imperio">
    <div><h2 className="font-extrabold">Pago único a Feria Imperio</h2><p className="mt-1 text-sm text-charcoal-500 dark:text-sand-300">Total del pedido a transferir <strong className="text-terracotta dark:text-terracotta-300">{formatARS(order.total)}</strong></p><p className="mt-2 text-xs text-charcoal-500 dark:text-sand-300">Incluye los productos de todas las tiendas.{order.grupos.every((group) => group.items.every(({ producto }) => producto.precioBase !== undefined)) && ' La comisión del 10% ya está incorporada en sus precios.'}</p></div>
    <dl className="space-y-2 rounded-xl bg-sand-200 p-4 text-sm dark:bg-charcoal-800">
      <div><dt className="font-bold">Destinatario</dt><dd>{payment.titular}</dd></div>
      {payment.cvu && <div><dt className="font-bold">CVU</dt><dd className="select-all break-all">{payment.cvu}</dd></div>}
      <div><dt className="font-bold">Alias</dt><dd className="select-all break-all">{payment.alias}</dd></div>
    </dl>
    {payment.demostracion && <p className="text-sm text-terracotta dark:text-terracotta-300">Alias de ejemplo: todavía no está confirmado para recibir pagos. No transfieras hasta que Feria Imperio publique sus datos bancarios reales.</p>}
    <fieldset disabled={saving} className="min-w-0"><ProductImageUpload variant="receipt" images={images} onChange={(next) => { setDraftImages(next); setMessage(''); }} onLoadingChange={setLoading} label="Comprobantes del pago a Feria Imperio" /></fieldset>
    <button type="button" disabled={loading || saving} onClick={() => void save()} className={checkoutButton}>{saving ? 'Guardando…' : 'Guardar comprobantes'}</button>
    <p role="status" className="text-sm text-forest dark:text-forest-300">{message}</p>
    <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>
  </section>;
}
