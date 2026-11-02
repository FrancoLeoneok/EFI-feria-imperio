import { useState } from 'react';
import { OrderGroup, saveReceipts } from '../../repositories/localOrders';
import { ProductImageUpload } from '../catalog/ProductImageUpload';
import { formatARS } from '../../utils/formatters';
import { checkoutButton, checkoutCard } from './OrderProducts';

export function TransferPayment({ group, orderId, compradorId }: { group: OrderGroup; orderId: string; compradorId: string }) {
  // Edits stay local until saved; the parent keys this editor by order and store.
  const [draftImages, setDraftImages] = useState<string[] | null>(null);
  const images = draftImages ?? group.comprobantes;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function save() {
    setSaving(true); setError(''); setMessage('');
    try {
      await saveReceipts(orderId, compradorId, group.tienda.id, images);
      setMessage('Comprobantes guardados. El pago queda pendiente de verificación por la tienda.');
    } catch { setError('No pudimos guardar los comprobantes. Revisá el espacio disponible y volvé a intentar.'); }
    finally { setSaving(false); }
  }
  return <section className={`${checkoutCard} space-y-4`} aria-label={`Transferencia a ${group.tienda.nombreComercio}`}>
    <div><h2 className="font-extrabold">{group.tienda.nombreComercio}</h2><p className="mt-1 text-sm text-charcoal-500 dark:text-sand-300">Importe a transferir <strong className="text-terracotta dark:text-terracotta-300">{formatARS(group.subtotal)}</strong></p></div>
    {group.tienda.cvu || group.tienda.alias ? <dl className="rounded-xl bg-sand-200 p-4 text-sm dark:bg-charcoal-800">
      {group.tienda.cvu && <div><dt className="font-bold">CVU</dt><dd className="select-all break-all">{group.tienda.cvu}</dd></div>}
      {group.tienda.alias && <div className="mt-2"><dt className="font-bold">Alias</dt><dd className="select-all break-all">{group.tienda.alias}</dd></div>}
    </dl> : <p className="rounded-xl bg-sand-200 p-4 text-sm dark:bg-charcoal-800">Esta tienda todavía no informó su CVU o alias. <a className="font-bold underline" href={`/tienda/${group.tienda.id}`}>Visitá su tienda</a> para coordinar la transferencia.</p>}
    {group.tienda.aliasDemostracion && <p className="text-sm text-terracotta dark:text-terracotta-300">El alias mostrado es de demostración. Coordiná con la tienda sus datos reales antes de transferir.</p>}
    <fieldset disabled={saving} className="min-w-0"><ProductImageUpload variant="receipt" images={images} onChange={(next) => { setDraftImages(next); setMessage(''); }} onLoadingChange={setLoading} label={`Comprobantes para ${group.tienda.nombreComercio}`} /></fieldset>
    <button type="button" disabled={loading || saving} onClick={() => void save()} className={checkoutButton}>{saving ? 'Guardando…' : 'Guardar comprobantes'}</button>
    <p role="status" className="text-sm text-forest dark:text-forest-300">{message}</p>
    <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>
  </section>;
}
