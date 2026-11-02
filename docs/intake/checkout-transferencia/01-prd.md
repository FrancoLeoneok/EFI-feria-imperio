# PRD — Compra por transferencia

## Problema
El carrito permite reunir productos, pero no completar una compra.

## Usuario / buyer
Cliente con cuenta de comprador y productos de una o varias tiendas.

## Objetivos y métricas de éxito
- Abrir el checkout desde un botón Comprar en el carrito, en otra pestaña.
- Usar los datos existentes del cliente sin pedirlos de nuevo.
- Mostrar productos, cantidades, subtotales por tienda y total general.
- Finalizar una compra una sola vez y mostrar Compra realizada.
- Mostrar datos de transferencia y permitir adjuntar comprobantes por tienda.

## Alcance
Checkout, confirmación, persistencia local de pedidos y comprobantes. Sin pasarela bancaria ni validación automática de transferencias.

## Historias
Como comprador quiero revisar mi pedido por tienda, confirmarlo y cargar el comprobante de cada transferencia.

## Restricciones y supuestos
Mantener el estilo existente. El proyecto usa autenticación y repositorios de demostración; los pedidos serán locales al navegador. No hay CVU ni alias en el modelo actual: nunca inventar datos bancarios reales; mostrar un aviso cuando falten. Confirmar el pedido no implica que el pago esté acreditado.
