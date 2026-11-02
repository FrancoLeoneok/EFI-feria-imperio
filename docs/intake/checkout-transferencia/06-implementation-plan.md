# Plan — Compra por transferencia

## Orden y criterios de aceptación
1. Extender src/types/index.ts y crear store de pedidos con persistencia: instantáneas, pertenencia al comprador, guardado controlado y prevención de duplicados.
2. Incorporar botón Comprar en src/components/cart/CartDrawer.tsx y ruta /checkout en src/App.tsx: apertura en otra pestaña y carrito sincronizado.
3. Crear página de checkout: datos de cuenta, resumen diferenciado por tienda, cantidades, subtotales, total y Finalizar compra; estados de sesión y carrito vacío.
4. Crear confirmación persistente: Compra realizada y pago pendiente, importe y CVU/alias por tienda; aviso explícito cuando falten datos bancarios.
5. Adaptar el patrón de carga de imágenes para comprobantes: selección y arrastre, validación, miniaturas, guardado por tienda y errores de cuota.
6. Verificar compilación y recorrido completo con una y varias tiendas, recarga, dos pestañas, ausencia de sesión, doble clic, archivo inválido y fallo de almacenamiento. Revisar móvil, modo oscuro y teclado.

## Qué no hacer ahora
No agregar pasarela, datos bancarios inventados, backend nuevo, acreditación automática ni cambios visuales ajenos al flujo.

## Aprobación y decisiones de implementación
Propuesta aprobada por el usuario con APPROVED. Ejecución en esta sesión, sin delegación.

La persistencia de pedidos y comprobantes se implementa en IndexedDB, siguiendo localProducts.ts. Evita la cuota reducida de localStorage para imágenes y permite una transacción atómica que evita pedidos duplicados entre pestañas. El carrito conserva Zustand/localStorage con una revisión por cambio y sincronización mediante storage.

Archivos: src/repositories/localOrders.ts (agrupación, pedidos y adjuntos), src/components/cart/OrderProducts.tsx (detalle), src/components/cart/TransferPayment.tsx (pago y comprobantes), src/pages/CheckoutPage.tsx (orquestación), src/App.tsx (ruta), src/store/useCartStore.ts (revisión y sincronización), src/types/index.ts (datos bancarios opcionales), src/components/catalog/ProductImageUpload.tsx (etiquetas reutilizables e identificadores únicos).

Verificación automatizada: scripts/verify-checkout.mjs prepara sesión y productos de dos tiendas, abre el checkout desde el botón real, confirma, verifica carrito sincronizado y recarga, adjunta una imagen, comprueba rechazo de formatos inválidos, valida duplicados, permisos y error de almacenamiento. Ejecutar junto con npm run build y react-doctor.

La orquestación de confirmación queda separada en src/repositories/checkout.ts y la presentación del pedido realizado en src/components/cart/OrderConfirmation.tsx.

## Validación realizada
- npm run build: correcto.
- scripts/verify-checkout.mjs: apertura real de otra pestaña, resumen de dos tiendas, móvil y modo oscuro, confirmación, sincronización, comprobantes persistentes, formato inválido, duplicados, propiedad del pedido, visualización de CVU/alias con datos de prueba, fallo de almacenamiento sin vaciar carrito y cierre de sesión: correcto.
- scripts/verify-product-upload.mjs: regresión del componente compartido, carga múltiple, arrastre, publicación, galería, recarga, stock y borrado: correcto.
- React Doctor sobre cambios rastreados: sin hallazgos, 81/100. El análisis completo detecta advertencias generales del proyecto; no se modifica código ajeno al alcance. El editor de comprobantes conserva borradores locales intencionalmente.
