import { Feriante } from '../types';

export interface StorePayment {
  cvu: string;
  alias: string;
  aliasDemostracion: boolean;
}

const key = (id: string) => `feria-imperio-payment-${id}`;

export function generateStoreAlias(nombre: string): string {
  const slug = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
  return (slug.length < 6 ? `tienda.${slug}` : slug).slice(0, 20).replace(/\.$/, '');
}

export function readStorePayment(tienda: Feriante): StorePayment {
  const saved = localStorage.getItem(key(tienda.id));
  if (saved) {
    const value = JSON.parse(saved) as StorePayment;
    if (typeof value.cvu !== 'string' || typeof value.alias !== 'string' || typeof value.aliasDemostracion !== 'boolean') {
      throw new Error('Los datos de transferencia guardados no se pueden leer.');
    }
    return value;
  }
  return {
    cvu: tienda.cvu ?? '',
    alias: tienda.alias ?? generateStoreAlias(tienda.nombreComercio),
    aliasDemostracion: tienda.alias ? tienda.aliasDemostracion ?? false : true,
  };
}

export function withStorePayment(tienda: Feriante): Feriante {
  return { ...tienda, ...readStorePayment(tienda) };
}

export function saveStorePayment(tienda: Feriante, cvuValue: string, aliasValue: string): StorePayment {
  const cvu = cvuValue.trim();
  const alias = aliasValue.trim().toLowerCase();
  if (!cvu && !alias) throw new Error('Ingresá un CVU o un alias para recibir transferencias.');
  if (cvu && !/^\d{22}$/.test(cvu)) throw new Error('El CVU debe tener exactamente 22 dígitos.');
  if (alias && !/^[a-z0-9.-]{6,20}$/.test(alias)) throw new Error('El alias debe tener entre 6 y 20 caracteres: letras, números, puntos o guiones.');
  const value = { cvu, alias, aliasDemostracion: alias === generateStoreAlias(tienda.nombreComercio) };
  localStorage.setItem(key(tienda.id), JSON.stringify(value));
  window.dispatchEvent(new Event('feria-payment-changed'));
  return value;
}
