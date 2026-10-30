/**
 * Utilidades de formateo para Feria Imperio
 */

/**
 * Formatea un monto numérico a formato de moneda Pesos Argentinos ($ ARS).
 * Ejemplo: 15000 -> "$ 15.000 ARS"
 */
export function formatARS(precio: number): string {
  const formateado = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(precio);
  return `$ ${formateado} ARS`;
}

/**
 * Normaliza un texto para búsquedas insensibles a mayúsculas, minúsculas y tildes/acentos.
 * Ejemplo: "Cerámica" -> "ceramica"
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

