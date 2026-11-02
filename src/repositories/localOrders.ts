import { CartItem } from '../store/useCartStore';
import { Feriante, UsuarioComprador } from '../types';
import { notifyOrdersChanged } from '../utils/orderEvents';

export interface OrderGroup {
  tienda: Pick<Feriante, 'id' | 'nombreComercio' | 'cvu' | 'alias' | 'aliasDemostracion'>;
  items: CartItem[];
  subtotal: number;
  comprobantes: string[];
}

export interface Order {
  id: string;
  fecha: string;
  comprador: UsuarioComprador;
  grupos: OrderGroup[];
  total: number;
  estadoPago: 'pendiente';
}

export function groupItems(items: CartItem[], tiendas: Feriante[]): OrderGroup[] {
  const groups = new Map<string, OrderGroup>();
  for (const item of items) {
    let group = groups.get(item.producto.ferianteId);
    if (!group) {
      const tienda = tiendas.find(({ id }) => id === item.producto.ferianteId);
      group = {
        tienda: { id: item.producto.ferianteId, nombreComercio: tienda?.nombreComercio ?? item.producto.ferianteNombre, cvu: tienda?.cvu, alias: tienda?.alias, aliasDemostracion: tienda?.aliasDemostracion },
        items: [], subtotal: 0, comprobantes: [],
      };
      groups.set(group.tienda.id, group);
    }
    group.items.push(item);
    group.subtotal += item.producto.precio * item.cantidad;
  }
  return [...groups.values()];
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('feria-imperio-orders', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('orders', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// One readwrite transaction serializes duplicate confirmations across tabs.
async function transact<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore, result: (value: T) => void) => void): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    let result: T;
    const tx = database.transaction('orders', mode);
    tx.oncomplete = () => {
      database.close();
      resolve(result);
      if (mode === 'readwrite') notifyOrdersChanged();
    };
    tx.onabort = () => { database.close(); reject(tx.error ?? new Error('No pudimos guardar los cambios.')); };
    action(tx.objectStore('orders'), (value) => { result = value; });
  });
}

export function readOrder(id: string, compradorId: string): Promise<Order | undefined> {
  return transact('readonly', (store, done) => {
    const request = store.get(id);
    request.onsuccess = () => {
      const order = request.result as Order | undefined;
      done(order?.comprador.id === compradorId ? order : undefined);
    };
  });
}

export function createOrder(order: Order): Promise<Order> {
  return transact('readwrite', (store, done) => {
    const request = store.get(order.id);
    request.onsuccess = () => {
      const existing = request.result as Order | undefined;
      if (existing) { done(existing); return; }
      store.add(order);
      done(order);
    };
  });
}

export function saveReceipts(id: string, compradorId: string, tiendaId: string, images: string[]): Promise<Order> {
  return transact('readwrite', (store, done) => {
    const request = store.get(id);
    request.onsuccess = () => {
      const order = request.result as Order | undefined;
      if (!order || order.comprador.id !== compradorId) { store.transaction.abort(); return; }
      const updated = { ...order, grupos: order.grupos.map((group) => group.tienda.id === tiendaId ? { ...group, comprobantes: images } : group) };
      store.put(updated);
      done(updated);
    };
  });
}

export interface StoreSale {
  pedidoId: string;
  fecha: string;
  comprador: Pick<UsuarioComprador, 'nombre' | 'email' | 'telefono'>;
  grupo: OrderGroup;
}

export function readStoreSales(ferianteId: string): Promise<StoreSale[]> {
  return transact('readonly', (store, done) => {
    const request = store.openCursor();
    const sales: StoreSale[] = [];
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) {
        done(sales.sort((a, b) => b.fecha.localeCompare(a.fecha)));
        return;
      }
      const order = cursor.value as Order;
      const grupo = order.grupos.find(({ tienda }) => tienda.id === ferianteId);
      if (grupo) sales.push({
        pedidoId: order.id, fecha: order.fecha,
        comprador: { nombre: order.comprador.nombre, email: order.comprador.email, telefono: order.comprador.telefono },
        grupo,
      });
      cursor.continue();
    };
  });
}
