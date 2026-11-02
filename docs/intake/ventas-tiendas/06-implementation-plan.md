# Plan — Ventas y datos de transferencia

## Tareas y aceptación
1. Crear persistencia de datos de transferencia y generador de alias desde nombreComercio; integrar todas las consultas del repositorio de feriantes. Verificar que todas las tiendas tengan alias inicial estable y distinto.
2. Extender los tipos del grupo del pedido y checkout para identificar alias de demostración, preservar instantáneas y usar configuración bancaria actualizada.
3. Ampliar localOrders con consulta de ventas por feriante y notificaciones de creación/adjuntos. Verificar aislamiento de grupos y comprobantes en compras de varias tiendas.
4. Crear componentes de Ventas y Datos de transferencia e integrarlos en AdminPage bajo la identidad autenticada. Incluir estados de carga, vacío, error y guardado.
5. Verificar flujo compra→venta→comprobante en distintas pestañas; edición y recarga de CVU/alias; datos actualizados en compras nuevas y datos anteriores conservados en pedidos históricos. Probar acceso comprador, dos tiendas, móvil y modo oscuro.
6. Ejecutar npm run build, prueba automatizada específica, regresión del checkout y revisión React.

## Fuera de alcance
Backend compartido, acreditación bancaria, registro real de los alias generados, devoluciones y logística.

## Aprobación
Usuario aprobó con APPROVED. Ejecución en esta sesión, sin delegación.

## Archivos y responsabilidades
- src/repositories/storePayments.ts: alias inicial, validación y persistencia por tienda.
- src/repositories/mock/MockFerianteRepository.ts: resolver datos actuales en todas las consultas.
- src/repositories/localOrders.ts: consulta proyectada de ventas y avisos de cambios.
- src/utils/orderEvents.ts: avisos entre pestañas y en la pestaña actual.
- src/components/admin/StorePaymentSettings.tsx: formulario de transferencia y estado de guardado.
- src/components/admin/StoreSales.tsx: ventas de la tienda activa y visualización de adjuntos.
- src/pages/AdminPage.tsx: integración y acceso exclusivo del feriante autenticado.
- src/types/index.ts y src/components/cart/TransferPayment.tsx: marca de alias de demostración en la instantánea y en checkout.
- scripts/verify-store-sales.mjs: pruebas del recorrido y aislamiento entre tiendas.

## Verificación realizada
- npm run build: compilación correcta.
- verify-store-sales.mjs: alias iniciales distintos para las seis tiendas; acceso comprador restringido; edición, validación y persistencia bancaria; fallo de almacenamiento conserva el borrador; compra real de dos tiendas; ventas y adjuntos actualizados entre pestañas; productos y comprobantes aislados por tienda; apertura y cierre por teclado del comprobante; datos históricos conservados; móvil y modo oscuro: correcto.
- verify-checkout.mjs: regresión del flujo completo, duplicados, persistencia y fallos de almacenamiento: correcto.
- verify-product-edit.mjs: regresión de edición, fotos, persistencia, stock y detalle público: correcto.
- React Doctor sobre cambios rastreados: sin hallazgos, 82/100. Análisis completo revisado para incluir archivos nuevos; contiene problemas generales preexistentes. La advertencia de autofocus del formulario se corrigió. La clave compuesta con índice de miniaturas es deliberada: la lista es de solo lectura, admite archivos idénticos y no mantiene estado por elemento.
- Revisión visual de capturas de escritorio y móvil oscuro: las secciones nuevas mantienen el estilo del panel.

## Alcance de datos
Las ventas se comparten entre pestañas del mismo navegador mediante IndexedDB y BroadcastChannel, con recarga al recuperar foco. No hay sincronización entre navegadores ni dispositivos. La generación de alias es determinista en el repositorio; no registra cuentas bancarias reales.
