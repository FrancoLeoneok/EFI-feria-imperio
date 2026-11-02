# PRD — Ventas y datos de transferencia

## Problema y usuario
Cada feriante necesita consultar las compras de su tienda y configurar los datos para recibir transferencias.

## Objetivos y alcance
- Sección Ventas en el panel de la tienda autenticada.
- Mostrar fecha, pedido, nombre y correo del cliente, productos, cantidades, subtotal de esa tienda y comprobantes disponibles.
- Actualizar las ventas al confirmar compras o guardar comprobantes en otra pestaña del mismo navegador.
- Botón Cargar/editar CVU o alias con guardado persistente.
- Generar para todas las tiendas un alias inicial derivado de su nombre, sin tildes y con puntos entre palabras; ejemplo el.gaucho.tradicion.

## Supuestos y restricciones
Conservar el estilo existente y la arquitectura local. Los alias generados son de demostración, no cuentas bancarias registradas; identificarlos como tales en el panel y checkout. El feriante puede reemplazarlos por su alias real. No generar CVU ficticios. No agregar acreditación de pagos ni gestión logística.

## Éxito
Una compra aparece en el panel de cada tienda involucrada, mostrando solo su parte. Los datos bancarios editados persisten y se usan en compras posteriores.
