import { useEffect, useId, useState } from 'react';
import { CreditCard, Pencil } from 'lucide-react';
import { Feriante } from '../../types';
import { readStorePayment, saveStorePayment, StorePayment } from '../../repositories/storePayments';
import { useAuthStore } from '../../store/useAuthStore';

const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-white hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:opacity-60';
const inputClass = 'mt-2 block min-h-11 w-full rounded-xl border border-sand-300 bg-sand-100 px-3 text-sm text-charcoal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:border-charcoal-600 dark:bg-charcoal-700 dark:text-white';

function PaymentForm({ tienda, initial, onSaved, onCancel }: {
  tienda: Feriante; initial: StorePayment; onSaved: (payment: StorePayment) => void; onCancel: () => void;
}) {
  const id = useId();
  const [cvu, setCvu] = useState(initial.cvu);
  const [alias, setAlias] = useState(initial.alias);
  const [error, setError] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (useAuthStore.getState().currentFeriante?.id !== tienda.id) {
      setError('Ingresá con la cuenta de esta tienda para guardar sus datos.');
      return;
    }
    try { onSaved(saveStorePayment(tienda, cvu, alias)); }
    catch (cause) {
      setError(cause instanceof DOMException ? 'No pudimos guardar los datos. Revisá el almacenamiento del navegador y reintentá.' : cause instanceof Error ? cause.message : 'No pudimos guardar los datos.');
    }
  }

  return <form onSubmit={submit} className="mt-5 space-y-4" aria-label="Editar datos de transferencia">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-bold" htmlFor={`${id}-cvu`}>CVU
        <input id={`${id}-cvu`} value={cvu} onChange={(event) => setCvu(event.target.value)} inputMode="numeric" maxLength={22} className={inputClass} aria-describedby={`${id}-help ${id}-error`} />
      </label>
      <label className="text-sm font-bold" htmlFor={`${id}-alias`}>Alias
        <input id={`${id}-alias`} value={alias} onChange={(event) => setAlias(event.target.value)} maxLength={20} autoCapitalize="none" spellCheck={false} className={inputClass} aria-describedby={`${id}-help ${id}-error`} />
      </label>
    </div>
    <p id={`${id}-help`} className="text-xs text-charcoal-500 dark:text-sand-300">Ingresá al menos uno. CVU: 22 dígitos. Alias: de 6 a 20 letras, números, puntos o guiones. Usá los datos que ya tenés registrados en tu billetera o banco.</p>
    <p id={`${id}-error`} role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>
    <div className="flex flex-wrap gap-3"><button className={buttonClass} type="submit">Guardar datos de transferencia</button><button type="button" onClick={onCancel} className="min-h-11 rounded-xl px-4 text-sm font-bold hover:bg-sand-200 dark:hover:bg-charcoal-700">Cancelar</button></div>
  </form>;
}

export function StorePaymentSettings({ tienda }: { tienda: Feriante }) {
  const [payment, setPayment] = useState<StorePayment>();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    function refresh() {
      try { setPayment(readStorePayment(tienda)); setError(''); }
      catch { setError('No pudimos leer los datos de transferencia. Volvé a intentar.'); }
    }
    const sync = (event: StorageEvent) => {
      if (event.key === null || event.key === `feria-imperio-payment-${tienda.id}`) refresh();
    };
    refresh();
    window.addEventListener('storage', sync);
    window.addEventListener('feria-payment-changed', refresh);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('feria-payment-changed', refresh);
    };
  }, [tienda]);

  return <section aria-labelledby="payment-settings-title" className="mb-8 rounded-3xl border border-sand-300 bg-white p-5 shadow-card sm:p-6 dark:border-charcoal-700 dark:bg-charcoal-800">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 id="payment-settings-title" className="flex items-center gap-2 text-lg font-extrabold"><CreditCard aria-hidden="true" className="h-5 w-5 text-terracotta" />Datos de transferencia</h2><p className="mt-2 text-xs text-charcoal-500 dark:text-sand-300">Se muestran al cliente después de confirmar su compra.</p></div>
      {!editing && payment && <button className={buttonClass} onClick={() => { setEditing(true); setMessage(''); }}><Pencil aria-hidden="true" className="h-4 w-4" />Cargar/editar CVU o alias</button>}
    </div>
    {payment && <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs font-bold text-charcoal-500 dark:text-sand-300">CVU</dt><dd className="mt-1 select-all break-all font-semibold">{payment.cvu || 'Sin cargar'}</dd></div><div><dt className="text-xs font-bold text-charcoal-500 dark:text-sand-300">Alias</dt><dd className="mt-1 select-all break-all font-semibold">{payment.alias || 'Sin cargar'}</dd></div></dl>}
    {payment?.aliasDemostracion && <p className="mt-3 text-xs text-terracotta dark:text-terracotta-300">Alias de demostración generado con el nombre de tu tienda. Reemplazalo por tu alias real para recibir transferencias; este formulario no registra alias bancarios.</p>}
    {editing && payment && <PaymentForm tienda={tienda} initial={payment} onSaved={(next) => { setPayment(next); setEditing(false); setMessage('Datos de transferencia guardados. Se usarán en las compras nuevas.'); }} onCancel={() => setEditing(false)} />}
    <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
    {error && <button className="min-h-11 text-sm font-bold underline" onClick={() => { try { setPayment(readStorePayment(tienda)); setError(''); } catch { /* Keep the read error visible. */ } }}>Reintentar</button>}
    <p role="status" className="mt-2 text-sm text-forest dark:text-forest-300">{message}</p>
  </section>;
}
