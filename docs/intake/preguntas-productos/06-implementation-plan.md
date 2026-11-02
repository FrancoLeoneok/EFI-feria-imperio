# Plan — Preguntas por producto

## Orden de implementación
1. Agregar modelo en src/types/index.ts y contrato de repositorio de preguntas; persistencia local y estado compartido siguiendo patrones existentes.
2. Crear bloque público de preguntas e integrarlo en src/components/catalog/ProductModal.tsx.
3. Crear bandeja de preguntas e integrarla en src/pages/AdminPage.tsx con contador de pendientes propio de la tienda.
4. Verificar flujo y documentar limitaciones de la demo.

## Criterios de hecho
Visitante lee; comprador con sesión pregunta; solo propietario responde; la respuesta queda publicada; el aviso baja únicamente al guardar con éxito; recarga conserva datos locales. Consultas de distintas tiendas y productos permanecen separadas.

## Verificación
Ejecutar npm run build. Verificar en navegador: visitante, comprador, propietario y otro feriante; pregunta vacía, texto largo, respuesta duplicada, recarga, pendientes cero, navegación móvil y teclado. Comprobar que no se publican correos del cliente. En una futura API repetir autorización mediante llamadas directas y desde dos dispositivos.

## Qué no hacer ahora
No modificar cambios existentes ajenos a esta funcionalidad; no agregar chat ni notificaciones externas. No presentar la demo local como publicación compartida o autenticación segura.

## Decisión pendiente de aprobación
Implementar primero el flujo local compatible con la arquitectura actual o ampliar alcance a backend real para compartir preguntas entre usuarios y dispositivos.
