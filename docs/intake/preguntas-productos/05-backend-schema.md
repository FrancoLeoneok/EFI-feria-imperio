# Backend — Preguntas por producto

## Modelo propuesto
PreguntaProducto: id, productoId, ferianteId, compradorId, nombreComprador, pregunta, creadaEn, respuesta nullable, respondidaEn nullable. Relación con producto y propietario de su tienda. El identificador de tienda se deriva del producto, no del formulario.

## Auth y permisos
Lectura pública de pregunta, nombre público y respuesta. Creación con sesión de comprador; autor derivado de la sesión. Respuesta permitida únicamente cuando el feriante autenticado posee el producto. Revalidar permisos en cada operación de escritura.

## Contrato de repositorio
listarPorProducto(productoId), listarPorFerianteActual(), preguntar(productoId, texto), responder(preguntaId, texto). Evitar aceptar identidad del autor o propietario desde el formulario.

## Validaciones y concurrencia
Texto recortado de 1 a 1000 caracteres para pregunta y de 1 a 2000 para respuesta. Una respuesta por pregunta; transición de pendiente a respondida condicionada a que siga sin responder. Contador derivado de consultas sin respuesta.

## Persistencia actual y futura
Primera versión propuesta usa almacenamiento local, consistente con la app demo. No hay API, base de datos ni RLS hoy. Para datos realmente compartidos se necesita servidor con autenticación verificada, almacenamiento central y autorización en servidor; los filtros del cliente no son controles de seguridad.

## Fuera de alcance
Sin storage de archivos, jobs, notificaciones externas ni infraestructura realtime en esta entrega.
