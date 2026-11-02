import { Store } from 'lucide-react';
import { OrderGroup } from '../../repositories/localOrders';
import { formatARS } from '../../utils/formatters';

export const checkoutCard = 'rounded-2xl border border-sand-300 bg-white p-5 sm:p-6 dark:border-charcoal-600 dark:bg-charcoal-700/40';
export const checkoutButton = 'inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-5 py-3 text-sm font-bold text-white hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta';

export function OrderProducts({ group }: { group: OrderGroup }) {
  return <section className={checkoutCard} aria-label={`Productos de ${group.tienda.nombreComercio}`}>
    <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold"><Store aria-hidden="true" className="h-5 w-5 shrink-0 text-forest dark:text-forest-300" />{group.tienda.nombreComercio}</h2>
    <ul className="divide-y divide-sand-200 dark:divide-charcoal-600">
      {group.items.map(({ producto, cantidad }) => <li key={producto.id} className="flex items-center gap-3 py-4">
        <img src={producto.imagenUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1"><h3 className="break-words text-sm font-bold">{producto.titulo}</h3><p className="mt-1 text-xs text-charcoal-500 dark:text-sand-400">{cantidad} × {formatARS(producto.precio)}</p></div>
        <p className="text-sm font-bold">{formatARS(producto.precio * cantidad)}</p>
      </li>)}
    </ul>
    <div className="mt-2 flex justify-between gap-3 border-t border-sand-300 pt-4 text-sm font-bold dark:border-charcoal-600"><span>Subtotal de la tienda</span><span>{formatARS(group.subtotal)}</span></div>
  </section>;
}
