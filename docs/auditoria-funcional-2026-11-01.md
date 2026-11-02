# Auditoría funcional de Feria Imperio

Fecha: 1 de noviembre de 2026, Argentina. Código local revisado: commit `a02b723`. Web: https://feria-imperio.vercel.app/.

Actualización de alcance: el usuario confirmó que se trata de un trabajo integrador sin base de datos, con datos de prueba. La autenticación simulada y el almacenamiento local son decisiones del proyecto; no se solicita reemplazarlos. Solo se autorizaron correcciones de los puntos 4, 5, 6 y 7. Ya se aplicaron en el código local: bloqueo de agregado sin stock y disponibilidad reactiva, controles de búsqueda separados, destinos del footer desde páginas internas y ocultamiento de “Paseos de Ferias”/“Postular mi Puesto” para compradores. Build y pruebas de regresión de estos cambios y checkout satisfactorios. El resto del documento conserva la evidencia de la revisión inicial; no representa una lista de cambios pendientes autorizados.

Se revisaron rutas, autenticación, catálogo, carrito, compra, comprobantes, ventas, stock, edición, eliminación, preguntas y postulaciones. Se hicieron interacciones reales de interfaz en Chrome con sesiones de prueba independientes, escritorio y viewport móvil. No se transfirió dinero ni se contactó a terceros. No se modificó código de la aplicación ni se desplegaron cambios.

## Resultado

La compra simulada funciona dentro del mismo navegador. Hay errores funcionales reproducidos y dependencias de demostración que impiden operar como comercio real entre usuarios de diferentes dispositivos. Las limitaciones locales están señaladas en algunas pantallas: se distinguen aquí de fallos de botones o persistencia.

## Hallazgos prioritarios

### 1. Alta: al volver a ingresar, un comprador registrado obtiene otra identidad

- Reproducción: crear una cuenta con `qa.auditoria@example.com`, cerrar sesión e ingresar con ese mismo correo.
- Resultado: el registro generó `comp-1793585914026` y el ingreso posterior generó `comp-1793585922178`. El nombre pasó de “QA Auditoría” al correo. Se aceptó también una contraseña distinta de la registrada.
- Impacto: los pedidos vinculados al ID anterior dejan de ser accesibles para esa nueva sesión, incluso en el mismo navegador. La contraseña de registro no se conserva ni se verifica.
- Causa: `registrarComprador` ignora `_contrasenia` y guarda solamente la sesión; `loginComprador` busca cuentas mock y crea un ID con `Date.now()` para cualquier usuario restante. La condición de contraseña permite cualquier valor de cuatro o más caracteres.
- Código: [useAuthStore.ts:145](../src/store/useAuthStore.ts#L145), [useAuthStore.ts:215](../src/store/useAuthStore.ts#L215), [localOrders.ts:71](../src/repositories/localOrders.ts#L71).
- Corrección propuesta: cuentas persistentes con ID estable y autenticación real; conservar el vínculo comprador-pedido. No basta con cambiar la interfaz del formulario.

### 2. Alta: una postulación dice “enviada” aunque nunca llega a la organización

- Reproducción: completar el formulario con datos de prueba y enviar.
- Resultado: aparece “¡Solicitud Enviada!”; no se emite ninguna petición de envío. Los datos quedan en `feria_imperio_consultas` del navegador.
- Segunda reproducción: simular que falla `localStorage.setItem` únicamente para esa clave. La página igualmente anuncia éxito y el formulario se vacía; no queda registro guardado.
- Impacto: el usuario cree que la organización recibió su postulación; con almacenamiento lleno puede perderse por completo.
- Causa: el repositorio activo es `MockContactoRepository`, persiste localmente y oculta las excepciones antes de devolver `success: true`.
- Código: [MockContactoRepository.ts:26](../src/repositories/mock/MockContactoRepository.ts#L26), [index.ts:17](../src/repositories/index.ts#L17), [ContactForm.tsx:43](../src/components/contact/ContactForm.tsx#L43).
- Corrección propuesta: envío a un servicio persistente y confirmación de recepción antes de limpiar el formulario; propagar errores. Mientras siga siendo demo, indicarlo antes de enviar.

### 3. Alta: los productos iniciales eliminados vuelven al recargar

- Reproducción: ingresar como feriante `fer-01`, eliminar “Mate Imperial Cincelado en Alpaca” y aceptar la confirmación. Recargar `/admin`.
- Resultado: el producto desaparece inicialmente y reaparece al recargar.
- Causa: `delete()` borra de IndexedDB y del array de la instancia; la siguiente carga reconstruye ese array desde `PRODUCTOS_MOCK`. No hay una marca persistente de eliminación de productos iniciales.
- Código: [MockProductoRepository.ts:8](../src/repositories/mock/MockProductoRepository.ts#L8), [MockProductoRepository.ts:18](../src/repositories/mock/MockProductoRepository.ts#L18), [localProducts.ts:36](../src/repositories/mock/localProducts.ts#L36).
- Evidencia: [producto reaparecido](../state/audit-2026-11-01/deleted-product-reappears.png).
- Corrección propuesta: persistir eliminaciones de los productos iniciales o unificar el catálogo en una fuente persistente. Verificar también desde otra pestaña y después de recargar.

### 4. Media: “Agregar” permite sumar productos agotados desde las tarjetas

- Reproducción: ingresar como comprador y localizar “Tabla para Asado en Algarrobo Macizo”, publicada con `enStock: false`, en el catálogo general. Tocar “Agregar”.
- Causa: `ProductCard` deshabilita el botón únicamente para `preview`; no comprueba disponibilidad. El catálogo general tampoco aplica los overrides de `useStockStore` al renderizar las tarjetas.
- El detalle individual y la confirmación de checkout sí validan stock: la compra final se bloqueó correctamente al marcar el mate como agotado.
- Impacto: se puede armar un carrito que recién al confirmar resulta imposible de comprar; hay estados contradictorios entre catálogo, detalle y taller.
- Código: [ProductCard.tsx:108](../src/components/catalog/ProductCard.tsx#L108), [HomePage.tsx:64](../src/pages/HomePage.tsx#L64), [checkout.ts:30](../src/repositories/checkout.ts#L30).
- Corrección propuesta: usar el mismo estado efectivo de disponibilidad en todas las vistas y bloquear el agregado también en el store.

### 5. Media: la cruz para limpiar búsqueda queda debajo de “Buscar”

- Reproducción: en escritorio de 1366 px, escribir cualquier búsqueda e intentar hacer clic en la cruz del campo superior.
- Resultado: Playwright detecta que el botón “Buscar” intercepta el puntero en el centro de la cruz. El botón “Limpiar búsqueda” del resumen inferior constituye una alternativa.
- Causa: posiciones absolutas `right-20` y `right-1.5`, combinadas con el ancho del botón Buscar.
- Código: [NavBar.tsx:132](../src/components/layout/NavBar.tsx#L132), [NavBar.tsx:146](../src/components/layout/NavBar.tsx#L146).
- Evidencia: [búsqueda](../state/audit-2026-11-01/search-clear-overlap.png).
- Corrección propuesta: reservar un espacio independiente para limpiar y otro para enviar; verificar clic real a distintos anchos.

### 6. Media: Inicio y Paseos de Ferias no navegan desde páginas internas

- Reproducción: abrir `/producto/prd-01` y tocar los enlaces del pie “Inicio” y “Paseos de Ferias”.
- Resultado: quedan `/producto/prd-01#inicio` y `/producto/prd-01#ferias`. Ninguno de esos destinos existe en la página de producto.
- Causa: `href="#inicio"` y `href="#ferias"` conservan la ruta actual.
- Código: [Footer.tsx:97](../src/components/layout/Footer.tsx#L97), [Footer.tsx:113](../src/components/layout/Footer.tsx#L113).
- Corrección propuesta: navegar al inicio con el hash correspondiente y asegurar que el destino exista para el rol activo.

### 7. Media: “Postular mi Puesto” lleva a una sección inexistente para compradores

- Reproducción: mantener una sesión de comprador, entrar a un producto y tocar “Postular mi Puesto” en el pie.
- Resultado: navega a `/#contacto`, pero no se renderiza ningún `#contacto`. También se omite `#ferias` para compradores.
- Causa: `HomePage` oculta formulario y paseos con `!esCliente`, mientras el pie sigue ofreciendo los enlaces.
- Código: [HomePage.tsx:301](../src/pages/HomePage.tsx#L301), [Footer.tsx:121](../src/components/layout/Footer.tsx#L121).
- Corrección propuesta: mantener accesibles estas secciones o darles rutas propias compatibles con cualquier rol.

### 8. Media: el visitante pierde el acceso visible al carrito al cerrarlo

- Reproducción: sin iniciar sesión, abrir un producto, agregarlo y cerrar el panel. Revisar la cabecera de escritorio y el menú móvil.
- Resultado: hay productos persistidos, pero no aparece ningún botón “Mi carrito”. Para reabrirlo hay que agregar otro artículo, ingresar o conocer `/checkout`.
- Causa: la navegación muestra el carrito exclusivamente al comprador autenticado, aunque el agregado funciona para visitantes.
- Código: [NavBar.tsx](../src/components/layout/NavBar.tsx), [ProductDetailPage.tsx:110](../src/pages/ProductDetailPage.tsx#L110).
- Evidencia: [menú de visitante sin carrito](../state/audit-2026-11-01/guest-menu-no-cart.png).
- Corrección propuesta: acceso al carrito para visitantes y solicitud de ingreso al confirmar.

## Límites de demostración que bloquean ventas reales

Estos comportamientos son explícitos en el código o en la interfaz. Si el objetivo es una demo local, constituyen alcance pendiente; si el objetivo es recibir ventas reales, deben resolverse antes de habilitarlas.

1. **Pedidos, comprobantes y ventas no se comparten entre dispositivos.** Se compró como María, se subió un comprobante y se abrió correctamente desde el taller en el mismo contexto. En un contexto independiente, la misma María no encontró el pedido y el mismo feriante vio cero ventas. La fuente es IndexedDB del navegador, sin backend. Productos y preguntas también usan almacenamiento local. Evidencia: [compra](../state/audit-2026-11-01/purchase-receipt.png), [comprobante del vendedor](../state/audit-2026-11-01/vendor-receipt.png), [otro navegador sin ventas](../state/audit-2026-11-01/independent-vendor-no-sales.png). Código: [localOrders.ts:48](../src/repositories/localOrders.ts#L48).
2. **El acceso de feriantes es de demostración.** Una clave compartida permite entrar a cualquier puesto conocido; la sesión se confía a localStorage. Los perfiles rápidos de compradores son públicos. No es autenticación apta para operaciones reales. Código: [useAuthStore.ts:81](../src/store/useAuthStore.ts#L81).
3. **El alias de pago es de ejemplo.** `demostracion: true`, alias `feria.imperio` y CVU vacío. La interfaz avisa que no se debe transferir. Se verificó la simulación de pedido y la gestión de imágenes; no una transferencia ni acreditación bancaria. El modelo mantiene `estadoPago: 'pendiente'`. Código: [platformPayment.ts:9](../src/config/platformPayment.ts#L9).

## Pruebas satisfactorias

- Build de producción: `npm run build`, TypeScript y Vite correctos.
- Web publicada: seis tiendas iniciales; filtro de paseo a tres; búsqueda y ausencia de resultados; tienda y detalle por URL directa; rutas y entidades inexistentes con pantallas de recuperación.
- Compra real de interfaz de prueba: mate $16.500 + mermelada $3.520 = **$20.020 ARS**, dos tiendas, comisión incorporada una vez; abrir checkout en otra pestaña; confirmar y vaciar carrito.
- Comprobantes: rechazo de `.txt`, carga de PNG de prueba, guardado, persistencia al recargar y ampliación desde ventas del feriante del mismo navegador.
- Preguntas y respuestas: envío como comprador, respuesta como feriante y visualización pública del producto, esperando confirmación efectiva antes de cambiar de sesión.
- Stock: detalle agotado deshabilita agregado; checkout rechaza un artículo que quedó sin stock.
- Privacidad y guías abren; navegación móvil y modo oscuro sin desbordamiento en el recorrido probado.
- **10 scripts existentes pasaron en local**: `verify-checkout`, `verify-store-sales`, `verify-product-edit`, `verify-product-questions`, `verify-responsive-navigation`, `verify-platform-pricing`, `verify-product-detail`, `verify-cart-photos`, `verify-login-reopen` y `verify-guides`.
- Entre esos scripts se comprobaron cantidades, redondeo decimal, aislamiento por tienda, duplicados de pedidos, errores de almacenamiento, cambios de sesión, historial de respuestas, fotos grandes, anchos de 320 a 1440 px y teclado de guías/comprobantes.

## Prueba existente que no pasó: fixture duplicado en subida

`verify-product-upload.mjs` publicó el producto, pero se detuvo esperando “Ver foto 2”. Usa `public/logo.png` y `public/favicon.png`, que tienen el mismo SHA-256: `59CE9CB3BE1CD9F4072F7661970E1B8D66785DB478E3E5F67457D3061D449179`. El detalle elimina imágenes repetidas mediante `Set`, por lo que muestra una foto. No se contabiliza este fallo del fixture como una galería rota. La edición con fotos y la galería con imágenes distintas están cubiertas por scripts que sí pasaron. Conviene reemplazar uno de los fixtures por una imagen diferente.

## Evidencia y repetición

- Resultados de la web: [results.json](../state/audit-2026-11-01/results.json).
- Casos adicionales: [extra-results.json](../state/audit-2026-11-01/extra-results.json).
- Scripts agregados para reproducir la auditoría: [audit-production.mjs](../scripts/audit-production.mjs) y [audit-production-extra.mjs](../scripts/audit-production-extra.mjs). Reciben opcionalmente una URL de módulo Playwright; por defecto intentan importar `playwright`.
- Las compras y mutaciones de la web se hicieron en contextos efímeros de Chrome; los datos se alojaron en esos navegadores de prueba. La imagen adjunta fue el logo del proyecto como comprobante ficticio.
- No hubo excepciones JavaScript no controladas en la pasada principal de producción. No se verificó la disponibilidad remota de cada perfil social o Google Maps, ni Safari/Firefox, dispositivos físicos o cobros reales. Los enlaces externos se inspeccionaron como destinos, sin enviar mensajes.
- No se verificó que Vercel corresponda exactamente al commit local; los fallos anteriores se contrastaron con conductas de la web y causas del código disponible.

Orden recomendado: persistencia y autenticación de usuarios/pedidos; recepción de postulaciones; borrado persistente; stock; navegación, búsqueda y acceso de visitantes al carrito.
