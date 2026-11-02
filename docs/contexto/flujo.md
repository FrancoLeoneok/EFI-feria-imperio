# Flujos de usuario y casos de uso - Feria Imperio

Actualizado: 2026-11-02. Recorridos de demostración local, sin ventas bancarias ni comunicaciones reales.

## Visitante y catálogo

1. En / explora portada, paseos y directorio; busca por texto y filtra rubro/paseo. La búsqueda normaliza tildes y mayúsculas.
2. Abre /tienda/:id para ver responsable, biografía, ubicación y catálogo con búsqueda interna.
3. Abre /producto/:id para consultar galería, descripción, especificaciones, precio al comprador, disponibilidad y preguntas locales.
4. Agrega productos disponibles al carrito sin necesitar sesión. Ajusta cantidades o quita artículos; confirmar exige comprador.
5. Rutas/entidades inexistentes presentan recuperación. Guías y privacidad abren desde el footer. Los enlaces a paseos/postulación se ocultan para compradores.

## Ingreso de demostración

LoginModal permite seleccionar rol y modo de ingreso/registro. Feriantes tienen puestos demo (por ejemplo fer-01, clave feria123) y acceso rápido. Compradores tienen perfiles demo (clave comprador123), ingreso y registro simulado. La sesión persiste localmente.

El comprador ve una portada centrada en catálogo, alterna productos/tiendas y no ve hero, paseos ni convocatoria. El feriante accede a Mi Taller y a su puesto público desde su menú. Cerrar sesión cambia la experiencia según el rol.

El registro no crea cuenta en un servidor. Un comprador nuevo puede recibir otro ID al volver a ingresar y perder acceso a pedidos anteriores: ver errores-conocidos.md. Perfiles mock estables permiten repetir la demo.

## Carrito y pedido

1. CartDrawer muestra artículos, cantidades y total con recargo de plataforma de 10 % sobre precio base.
2. El usuario abre /checkout; debe iniciar sesión como comprador antes de confirmar.
3. confirmPurchase valida revisión del carrito, sesión, cantidades, precios y disponibilidad actual. Si cambian datos, informa el error para revisar el resumen.
4. Guarda en IndexedDB un pedido agrupado por tienda con instantáneas de precios e imágenes. Comprador/revisión determinan un ID para evitar duplicar esa confirmación.
5. Después de guardar, limpia el carrito si no cambió su revisión; muestra el pedido pendiente.
6. /checkout?pedido=... recupera el pedido en el mismo origen/navegador con la identidad correspondiente.

## Transferencia y comprobantes ficticios

Se muestran instrucciones de demostración desde platformPayment.ts. El comprador adjunta imágenes y las guarda localmente; puede recargar el pedido para consultarlas. No se acredita pago: estadoPago permanece pendiente. No hay integración bancaria ni liquidación automática.

## Mi Taller y ventas

/admin limita su interfaz al feriante identificado; no es administración general. Permite crear/editar productos (precio base, descripción, fotos, disponibilidad y destacado), eliminarlos, responder preguntas y revisar ventas de su tienda.

Productos se guardan en IndexedDB; disponibilidad manual tiene store persistente. Borrar productos iniciales puede revertirse al recargar.

StoreSales muestra los grupos del pedido de la tienda, comprador, artículos e importes, y permite ampliar comprobantes locales. Para recorrer ambos roles, cambiar de comprador a feriante en el mismo navegador. Otro dispositivo no verá esas ventas.

## Preguntas

Las preguntas son públicas dentro de los datos del navegador. Comprador identificado pregunta (1 a 1000 caracteres); feriante dueño responde desde su taller (1 a 2000). El repositorio impide responder otra tienda o sobrescribir una respuesta. Eventos locales/BroadcastChannel actualizan pestañas del mismo origen.

## Contacto y postulación

ContactForm solicita nombre, emprendimiento, correo, Instagram, Facebook, rubro y mensaje. Guarda consulta local sin envío a la organización ni alta/aprobación de tienda. El éxito actual puede ser engañoso y el repositorio oculta fallos de almacenamiento.

PostulacionStand y MockPostulacionRepository modelan reserva/pago simulado de stand físico; no hay recorrido activo de interfaz conectado.

## Criterios comunes

Representar carga, vacío, error y éxito donde corresponda; revisar navegación, teclado y tema. Consultar flujo-de-trabajo.md para verificaciones y errores.md para evidencia histórica. La existencia de un componente no sustituye una prueba de su recorrido.
