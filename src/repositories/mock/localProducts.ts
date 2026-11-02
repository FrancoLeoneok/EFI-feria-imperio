import { Producto } from '../../types';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('feria-imperio-products', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('products', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readLocalProducts(): Promise<Producto[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('products', 'readonly');
    const request = transaction.objectStore('products').getAll();
    transaction.oncomplete = () => { database.close(); resolve(request.result as Producto[]); };
    transaction.onabort = () => { database.close(); reject(transaction.error); };
  });
}

export async function saveLocalProduct(producto: Producto): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('products', 'readwrite');
    transaction.objectStore('products').put(producto);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onabort = () => { database.close(); reject(transaction.error); };
  });
}

export async function deleteLocalProduct(id: string): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('products', 'readwrite');
    transaction.objectStore('products').delete(id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onabort = () => { database.close(); reject(transaction.error); };
  });
}
