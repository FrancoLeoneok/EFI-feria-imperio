# Glosario de dominio, UI y siglas - Feria Imperio

Actualizado: 2026-11-02.

## Dominio

- **Feria Imperio:** prototipo académico de catálogo y compra simulada local de Río Cuarto, Córdoba.
- **Feriante / artesano:** responsable de tienda; rol feriante en sesión demo.
- **Comprador / cliente:** rol comprador; confirma pedidos y publica preguntas.
- **Gazebo / puesto:** espacio físico identificado por puestoNumero; tienda digital en /tienda/:id.
- **Paseos:** Paseo del Andino y Parque Sarmiento; UbicacionFeria también admite ambos.
- **Rubro:** artesanias, ceramica, gastronomia, marroquineria, madera o indumentaria.
- **Finde confirmado:** dato estático findeConfirmado, no agenda administrable.
- **Producto:** pieza con precio base, fotos, especificaciones y disponibilidad; ruta /producto/:id.
- **Disponibilidad efectiva:** override del store de stock, si existe, o enStock del producto; no representa unidades.
- **Precio base:** Producto.precio, importe del feriante sin recargo.
- **Precio al comprador:** customerPrice aplica 10 % y redondeo; COMMISSION_PERCENT define la regla.
- **Carrito / lista:** selección persistente multitienda con cantidades; evolucionó del presupuesto inicial al checkout simulado.
- **Revisión del carrito:** identificador que cambia con artículos/cantidades y detecta modificaciones durante confirmación.
- **Pedido (Order):** instantánea local de comprador, grupos, importes y comprobantes; no acredita pago.
- **Grupo (OrderGroup):** artículos/subtotal de una tienda en pedido multitienda.
- **Venta (StoreSale):** proyección del grupo de pedido para su feriante; no implica cobro.
- **Comprobante:** imagen local adjunta al pedido; el pago sigue pendiente.
- **PreguntaProducto:** pregunta local asociada a producto/comprador/feriante con respuesta única opcional.
- **ConsultaContacto:** solicitud local; no crea cuenta/tienda ni comunica a la organización.
- **PostulacionStand:** reserva física con pago simulado, sin recorrido de interfaz activo.

## Interfaz

- **NavBar:** marca, búsqueda, tema, ingreso y menú por rol.
- **HeroBanner / FeriasSection:** portada e información estática, omitidas para comprador autenticado.
- **CategoryFilter / StoreGrid / StoreCard:** filtros y directorio de tiendas.
- **ProductGrid / ProductCard:** catálogo y acceso a producto; agregado sujeto a disponibilidad.
- **ProductDetailPage / ProductGallery:** ficha y galería individual. ProductModal existe como componente, pero no sustituye la ruta.
- **ProductFormDialog / ProductImageUpload:** alta/edición y fotos del taller.
- **LoginModal:** ingreso, perfiles y registro de demostración.
- **CartDrawer / CheckoutPage / OrderConfirmation:** selección, confirmación y recuperación del pedido.
- **TransferPayment / OrderProducts / CartProductImage:** transferencia ficticia, artículos históricos y fotos del carrito.
- **StoreSales:** pedidos de la tienda y comprobantes ampliables.
- **ProductQuestions / StoreQuestions:** preguntas públicas locales y gestión de respuestas.
- **ContactForm:** consulta/postulación local.
- **GuidesModal / PrivacyModal:** guías y aviso de privacidad.
- **ThemeToggle / Toast:** tema y notificación temporal. FloatingWhatsApp no está activo en el código actual.

## Tecnología y proceso

- **ARS:** pesos argentinos.
- **SPA:** aplicación de navegación cliente; el hosting debe resolver rutas al HTML de entrada.
- **Repository / mock:** separación de acceso a datos e interfaz; aquí con implementaciones simuladas/locales.
- **localStorage:** almacenamiento por origen para sesión, carrito, stock, tema y contacto.
- **IndexedDB:** base de datos del navegador para productos, pedidos, preguntas e imágenes locales.
- **BroadcastChannel / storage:** comunicación entre contextos del mismo origen; no entre dispositivos.
- **ADR:** registro histórico de decisiones, que pueden evolucionar en registros posteriores.
- **SDD:** desarrollo guiado por especificaciones.
- **DoD:** criterios para terminar una tarea.
- **UIStatus:** idle, loading, success, empty o error.
- **CTA:** acción propuesta por un control.
- **Idempotencia de confirmación:** repetir comprador/revisión recupera el pedido existente en lugar de duplicarlo.
