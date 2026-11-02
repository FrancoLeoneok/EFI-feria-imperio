# Historial de incidencias y correcciones - Feria Imperio

Actualizado: 2026-11-02. Pendientes y límites actuales: [errores-conocidos.md](errores-conocidos.md).

## Base histórica

- **ERR-001 · 2026-10-15:** configuración del contexto y reglas; no fue un fallo de ejecución.
- **ERR-002 · 2026-10-15:** documentación inicial de arquitectura y alcance.
- **ERR-003 · 2026-10-15:** transición de maquetas a Vite + React + TypeScript, repositorios y Zustand. Las maquetas permanecen como referencias.

## Correcciones incorporadas al 1 de noviembre

- **ERR-004 · Rutas directas en despliegue:** rewrite SPA en vercel.json. Referencia: 14968f4.
- **ERR-005 · Fotos grandes en carrito:** evitar duplicar data URL/galerías en localStorage; recuperar fotos del catálogo en IndexedDB y conservarlas en pedidos. Fuentes: useCartStore, CartProductImage y verify-cart-photos.mjs.
- **ERR-006 · Reapertura del ingreso:** flujo revisado en a043acc; script verify-login-reopen.mjs.
- **ERR-007 · Agregado de agotados:** ProductCard/useCartStore bloquean agregado sin disponibilidad efectiva; catálogo considera overrides y checkout vuelve a validar.
- **ERR-008 · Búsqueda superpuesta:** controles limpiar/enviar separados para evitar que Buscar intercepte el clic.
- **ERR-009 · Footer desde páginas internas:** enlaces llevan a destinos de portada correspondientes.
- **ERR-010 · Enlaces sin sección para compradores:** ocultar Paseos de Ferias y Postular mi Puesto cuando ese rol no dispone de sus secciones.

ERR-007 a ERR-010 corresponden a hallazgos 4 a 7 de la auditoría y correcciones de e5b72b9, con regresión documentada mediante verify-audit-fixes.mjs y checkout.

## Evidencia histórica

La [auditoría de 2026-11-01](../auditoria-funcional-2026-11-01.md) registra build satisfactorio y diez scripts locales aprobados: checkout, ventas, edición, preguntas, navegación responsive, precios, detalle, fotos de carrito, reapertura de ingreso y guías. También registra fallo del fixture duplicado de verify-product-upload.

Estos resultados pertenecen a aquella revisión; no implican pruebas nuevas, cobertura total, dispositivos físicos ni equivalencia comprobada entre despliegue y último commit local. Esta actualización documental no modifica la aplicación.
