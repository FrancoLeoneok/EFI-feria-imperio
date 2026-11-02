# TRD — Ventas y datos de transferencia

## Stack y arquitectura
React, TypeScript, Tailwind, Zustand y repositorios locales existentes. Pedidos en IndexedDB; configuración de transferencia persistente por feriante, integrada en el repositorio de tiendas.

## Cambios
Agregar consulta de ventas por feriante al repositorio de pedidos, devolviendo exclusivamente el grupo de esa tienda y los datos necesarios del comprador. Notificar cambios de pedidos y comprobantes a la pestaña actual y otras pestañas; recargar también al recuperar foco.

Separar componentes de ventas y edición de transferencia de AdminPage. Resolver los datos bancarios actualizados desde el repositorio, evitando depender de una sesión que conserve una instantánea antigua.

## Calidad
Permisos de interfaz para feriante autenticado, aislamiento por tienda, errores de lectura/escritura visibles, formulario accesible, estados vacío/carga/error, diseño móvil y oscuro. Sin dependencias ni secretos nuevos.

## Límite
La persistencia local no permite ventas compartidas entre dispositivos o navegadores y no sustituye autorización de servidor.
