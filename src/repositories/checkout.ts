import { useAuthStore } from '../store/useAuthStore';
import { CartItem, useCartStore } from '../store/useCartStore';
import { useStockStore } from '../store/useStockStore';
import { UsuarioComprador } from '../types';
import { ferianteRepository, productoRepository } from './index';
import { createOrder, groupItems } from './localOrders';
import { PLATFORM_PAYMENT } from '../config/platformPayment';
import { roundMoney } from '../utils/pricing';

const changedCartMessage = 'El carrito cambió en otra pestaña. Revisá el resumen y volvé a confirmar.';

export async function confirmPurchase(comprador: UsuarioComprador, expectedRevision: string) {
  await useCartStore.persist.rehydrate();
  const cart = useCartStore.getState();
  const snapshot = structuredClone({ items: cart.items, revision: cart.revision });
  if (snapshot.revision !== expectedRevision) throw new Error(changedCartMessage);
  if (snapshot.items.length === 0) throw new Error('El carrito está vacío.');

  const [products, stores] = await Promise.all([productoRepository.getAll(), ferianteRepository.getAll()]);
  await useStockStore.persist.rehydrate();
  const stock = useStockStore.getState().disponibilidad;
  const purchaseItems: CartItem[] = [];
  for (const item of snapshot.items) {
    const product = products.find(({ id }) => id === item.producto.id);
    if (!product || !(stock[product.id] ?? product.enStock)) {
      throw new Error(`${item.producto.titulo} ya no está disponible. Quitalo del carrito para continuar.`);
    }
    if (product.precio !== item.producto.precio || product.ferianteId !== item.producto.ferianteId) {
      throw new Error(`Cambió la información de ${item.producto.titulo}. Quitalo del carrito y agregalo nuevamente.`);
    }
    if (!Number.isInteger(item.cantidad) || item.cantidad < 1 || !Number.isFinite(product.precio) || product.precio < 0) {
      throw new Error('Revisá las cantidades y precios del carrito.');
    }
    // Orders use IndexedDB, so their historical snapshot can retain the photos.
    purchaseItems.push({
      ...item,
      producto: { ...item.producto, imagenUrl: product.imagenUrl, imagenes: product.imagenes },
    });
  }

  await useCartStore.persist.rehydrate();
  await useAuthStore.persist.rehydrate();
  if (useAuthStore.getState().currentComprador?.id !== comprador.id) throw new Error('La sesión cambió. Ingresá con tu cuenta para continuar.');
  if (useCartStore.getState().revision !== snapshot.revision) throw new Error(changedCartMessage);
  const groups = groupItems(purchaseItems, stores);
  const order = await createOrder({
    id: `${comprador.id}-${snapshot.revision}`,
    comprador: structuredClone(comprador),
    fecha: new Date().toISOString(),
    grupos: groups,
    total: roundMoney(groups.reduce((sum, group) => sum + group.subtotal, 0)),
    estadoPago: 'pendiente',
    pago: { ...PLATFORM_PAYMENT },
    comprobantes: [],
  });

  // The order is durable before clearing the cart. Preserve any newer cart.
  try {
    await useCartStore.persist.rehydrate();
    if (useCartStore.getState().revision === snapshot.revision) useCartStore.getState().clearCart();
  } catch { /* The saved order remains available if localStorage is full. */ }
  return order;
}
