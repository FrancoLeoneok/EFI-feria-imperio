# TRD — Preguntas por producto

## Stack y arquitectura
React 18, TypeScript, Vite, Tailwind y Zustand. Repositorios mock, sesiones demo y persistencia local existentes.

## Diseño técnico
Agregar tipo PreguntaProducto y repositorio con lectura por producto, lectura por feriante, creación y respuesta. Componentes separados para preguntas públicas y bandeja del feriante. Mantener estado reactivo compartido para actualizar listas y contadores sin recargar.

## Requisitos no funcionales
Controles con etiquetas, navegación por teclado, mensajes de estado accesibles, diseño adaptable y compatibilidad con tema claro/oscuro. Texto tratado como texto, sin HTML.

## Integraciones y entorno
Reutilizar sesión, producto y feriante existentes. Sin nuevas dependencias ni secretos para la versión local.

## Límite técnico
Los controles de sesión y propiedad locales son demostrativos. Para uso público entre personas, implementar API y persistencia central con validación de identidad y propiedad en el servidor.
