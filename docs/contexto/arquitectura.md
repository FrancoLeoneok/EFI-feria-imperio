# Arquitectura del sistema - Feria Imperio

Actualizado: 2026-11-02. Contrastado con código local hasta `7a72d7e`.

## Alcance y stack

Prototipo académico de catálogo y compra simulada para feriantes de Río Cuarto. Funciona en el navegador sin backend ni base de datos de servidor; sí utiliza IndexedDB local. No hay pagos ni autenticación reales.

React 18.3, TypeScript 5.7 estricto, Vite 6.1, React Router DOM 7 y Zustand 5. Estilos con Tailwind CSS 3.4, PostCSS y Autoprefixer; tokens en tailwind.config.js, estilos base en src/index.css y modo oscuro por clase. Lucide React, clsx, tailwind-merge y Plus Jakarta Sans completan la interfaz. package.json declara versiones y package-lock.json fija las resueltas.

## Organización

- src/App.tsx: rutas, búsqueda compartida, layout, carrito, ingreso y toast globales.
- src/pages/: HomePage, StoreDetailPage, ProductDetailPage, AdminPage, CheckoutPage y NotFoundPage.
- src/components/: layout, auth, stores, catalog, cart, admin, questions, contact, ferias y common. Incluye galerías/formularios de producto, ventas, guías y privacidad. No hay FloatingWhatsApp activo.
- src/types/index.ts: modelos compartidos. Pedidos y preguntas declaran modelos específicos en sus repositorios.
- src/repositories/interfaces/ y mock/: contratos e implementaciones simuladas. index.ts exporta productos, feriantes, contacto y postulaciones.
- src/repositories/mock/localProducts.ts: productos locales. MockProductoRepository combina registros locales con PRODUCTOS_MOCK, priorizando los locales por ID.
- src/repositories/checkout.ts: confirmación; localOrders.ts: pedidos, comprobantes y ventas; questions.ts: preguntas y respuestas.
- src/store/: useAuthStore, useCartStore y useStockStore.
- src/utils/: formatos/búsqueda, precios y eventos de pedidos. src/config/platformPayment.ts: transferencia ficticia.
- src/data/: catálogo inicial y guías. public/: recursos estáticos.
- scripts/: auditorías y verificaciones. docs/intake/: especificaciones de checkout, ventas y preguntas. README.md: ejecución y alcance.
- Maquetas HTML/JSX de la raíz: referencias anteriores. Entrada activa: src/main.tsx.

## Rutas

- /: directorio y catálogo adaptados al rol.
- /tienda/:id: ficha y catálogo de tienda.
- /producto/:id: galería, ficha, compra y preguntas.
- /admin: Mi Taller del feriante identificado; no administración general.
- /checkout: resumen/confirmación; ?pedido=... recupera un pedido local del comprador correspondiente.
- Cualquier otra ruta: recuperación mediante NotFoundPage.

vercel.json resuelve rutas SPA a index.html; publicar no centraliza datos.

## Persistencia y flujo de datos

- localStorage: feria_imperio_auth, feria_imperio_cart, feria-imperio-stock, feria_theme y feria_imperio_consultas.
- IndexedDB: feria-imperio-products/products, feria-imperio-orders/orders y feria-imperio-questions/questions.
- Carrito: cantidades y revisión; excluye galerías y portadas data URL de localStorage para no duplicar fotos grandes. Recupera imágenes del catálogo local.
- Pedidos: instantánea histórica de comprador, productos, imágenes, importes finales, grupos por tienda, pago ficticio y comprobantes. Persisten antes de vaciar el carrito.
- Eventos storage sincronizan carrito/stock entre pestañas; pedidos/preguntas tienen eventos propios y BroadcastChannel donde corresponde. No sincronizan dispositivos.

## Compra y límites

Producto.precio es el precio base. customerPrice en src/utils/pricing.ts añade 10 % con redondeo a centavos. El pedido conserva precio final y precioBase en registros nuevos; el historial no se recalcula con precios actuales.

Confirmar rehidrata sesión, carrito y stock y valida cantidades, precio, disponibilidad y revisión. El ID comprador/revisión evita duplicar esa confirmación. Después de guardar se limpia el carrito si no cambió. El pago permanece pendiente incluso con comprobante.

No hay API remota, permisos de servidor, recepción real de postulaciones, integración bancaria, liquidaciones, stock por unidades, envíos ni agenda administrable. Datos aislados por navegador/origen: localhost y Vercel no comparten almacenamiento. Borrar productos iniciales no persiste su eliminación tras recargar.

Hay README y scripts de navegador, pero no npm test ni runner declarado. FastAPI, SQLite, SQLModel, Alembic y Docker son propuestas futuras, no implementación actual.
