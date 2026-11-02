# TRD — Compra por transferencia

## Stack y arquitectura
React 18, TypeScript, React Router, Tailwind y Zustand con persistencia local, siguiendo la aplicación actual.

## Cambios propuestos
- Ruta /checkout y vista de pedido confirmado.
- Botón en CartDrawer que abre una nueva pestaña.
- Repositorio IndexedDB de pedidos con instantáneas del cliente, productos, precios y tiendas; mantiene el patrón usado para imágenes de productos.
- Campos opcionales cvu y alias en Feriante.
- Carga de comprobantes con el patrón visual y validaciones de ProductImageUpload.

## Requisitos no funcionales
Diseño adaptable, modo claro y oscuro, controles accesibles, errores visibles, persistencia con manejo de falta de espacio y sincronización entre pestañas. Evitar confirmaciones duplicadas y no vaciar el carrito si falla el guardado.

## Integraciones y secretos
Repositorios y sesión existentes; sin nuevas dependencias ni secretos.

## Fuera de alcance técnico
Servidor, autenticación real, conciliación bancaria, notificaciones y gestión logística.
