# Datos — Compra por transferencia

## Persistencia actual
Sin backend conectado: repositorios mock y Zustand/localStorage. Implementar sobre esa arquitectura y explicitar su alcance de demostración.

## Entidades propuestas
- Feriante: agregar cvu y alias opcionales.
- Pedido: id, fecha, compradorId, instantánea de datos del comprador, grupos por tienda, total y estado de pago pendiente.
- Grupo de tienda: ferianteId, nombre, datos bancarios disponibles, productos con precio y cantidad congelados, subtotal y comprobantes.
- Comprobante: imagen validada, nombre y fecha de carga, asociado a un pedido y tienda.

## Auth y acceso
Solo una sesión de comprador puede confirmar. La interfaz permite consultar y adjuntar comprobantes únicamente a pedidos del comprador actual. Estas restricciones locales no sustituyen permisos de servidor.

## Storage y concurrencia
Pedidos y comprobantes en IndexedDB; carrito y sesión mantienen Zustand/localStorage. Errores controlados, sincronización del carrito entre pestañas y transacción atómica para evitar duplicados. No crear tablas, APIs, RLS ni servicios externos. Reusar el límite de 5 MB y formatos JPG, PNG o WebP de imágenes de producto, manejando la cuota de almacenamiento.
