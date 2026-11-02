# Datos — Ventas y datos de transferencia

## Persistencia
Sin backend nuevo. Mantener IndexedDB para pedidos y configuración local persistente para datos bancarios por feriante.

## Modelos
- Datos de transferencia: ferianteId, cvu opcional, alias opcional y marca de alias de demostración.
- Feriante: resolver configuración guardada; si no existe, generar alias estable desde nombreComercio.
- Grupo del pedido: conservar instantánea de los datos bancarios y su marca de demostración al confirmar.
- Venta consultada: pedidoId, fecha, datos necesarios del cliente y solo el grupo correspondiente al feriante consultado.

## Validación y acceso
CVU: 22 dígitos si se informa. Alias: caracteres y longitud compatibles con el formulario; al menos un dato de transferencia. Solo la tienda autenticada puede editar sus propios datos desde el panel. Los permisos locales son controles de interfaz, no seguridad de servidor.

## Concurrencia
Notificar cambios de pedidos/comprobantes entre pestañas. Editar datos bancarios no reescribe instrucciones de pedidos históricos. No generar CVU ni presentar alias derivados del nombre como cuentas bancarias registradas.
