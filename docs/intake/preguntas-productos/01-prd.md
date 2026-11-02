# PRD — Preguntas por producto

## Problema
Los clientes necesitan consultar detalles del producto y el feriante necesita identificar consultas sin responder.

## Usuarios y objetivos
Compradores con sesión publican preguntas. Todos los visitantes leen preguntas y respuestas. Solo el feriante propietario de la tienda responde.

## Alcance
Sección de preguntas en el detalle de cada producto y sección Preguntas en el panel del feriante, con contador de pendientes. Una respuesta por pregunta. Al responder, la consulta sale de pendientes y el contador disminuye; el historial público permanece.
Fuera de alcance: chat, archivos adjuntos, correos, moderación, edición y eliminación de consultas.

## Historias
- Como visitante, puedo leer consultas públicas del producto sin iniciar sesión.
- Como comprador autenticado, puedo preguntar sobre ese producto.
- Como feriante, veo únicamente consultas de mi tienda y puedo responderlas.

## Criterios de éxito
Consulta publicada visible en el producto correcto; respuesta visible para todos; otra tienda no puede responder; aviso de pendientes actualizado al guardar exitosamente.

## Restricciones y supuestos
La app actual es una demostración sin servidor. El almacenamiento local no comparte datos entre dispositivos ni ofrece seguridad real. Primera entrega propuesta: flujo funcional local y contrato preparado para backend. La publicación compartida requiere backend y autenticación reales.
