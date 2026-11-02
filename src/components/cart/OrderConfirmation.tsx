import { CheckCircle2 } from 'lucide-react';
import { Order } from '../../repositories/localOrders';
import { formatARS } from '../../utils/formatters';
import { checkoutCard, OrderProducts } from './OrderProducts';
import { TransferPayment } from './TransferPayment';

export function OrderConfirmation({ order }: { order: Order }) {
  return <div className="space-y-6">
        <section className={`${checkoutCard} space-y-3`}><CheckCircle2 aria-hidden="true" className="h-10 w-10 text-forest dark:text-forest-300" /><h2 className="text-xl font-extrabold">¡Gracias, {order.comprador.nombre}!</h2><p className="break-all text-xs text-charcoal-500 dark:text-sand-300">Pedido {order.id} · {new Date(order.fecha).toLocaleString('es-AR')}</p><p className="text-sm">{order.comprador.email}</p><p className="font-bold">Total: {formatARS(order.total)}</p><p className="text-sm font-bold text-terracotta dark:text-terracotta-300">Pago pendiente de transferencia</p><p className="text-xs text-charcoal-500 dark:text-sand-300">Guardá el enlace de esta página para volver a adjuntar tus comprobantes. Este pedido y sus archivos se guardan únicamente en este navegador.</p></section>
        <div className="grid items-start gap-6 lg:grid-cols-2"><div className="space-y-6">{order.grupos.map((group) => <OrderProducts key={group.tienda.id} group={group} />)}</div><div className="space-y-6"><h2 className="text-xl font-extrabold">Transferencias y comprobantes</h2>{order.grupos.map((group) => <TransferPayment key={`${order.id}-${group.tienda.id}`} group={group} orderId={order.id} compradorId={order.comprador.id} />)}</div></div>
      </div>;
}
