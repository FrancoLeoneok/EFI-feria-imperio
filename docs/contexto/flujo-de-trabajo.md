# Flujo de trabajo y Definition of Done - Feria Imperio

Actualizado: 2026-11-02.

## Cómo abordar cambios

1. Leer README y contexto, contrastando con código e historial. arquitectura describe implementación; flujo, recorridos; convenciones, reglas; decisiones, historial; errores, arreglos; errores-conocidos, pendientes; glosario, vocabulario.
2. Delimitar objetivo y aceptación. Consultar docs/intake/checkout-transferencia, ventas-tiendas y preguntas-productos cuando corresponda. Mantener el alcance académico local salvo pedido que lo cambie.
3. Revisar modelos/contratos y efectos sobre persistencia, roles, precios e historial antes de implementar.
4. Utilizar repositorios/stores existentes, estados asíncronos aplicables y errores visibles.
5. Verificar lo afectado y actualizar contexto con evidencia real. Documentar un pendiente no lo resuelve.

## Comandos y scripts

- npm ci: instalar dependencias del lockfile cuando haga falta.
- npm run dev: servidor Vite; usar URL/puerto informados.
- npm run build: TypeScript y build de producción.
- npm run preview: revisar compilación estática.

No hay npm test ni Playwright declarado en package.json. Scripts .mjs importan Playwright del entorno o desde URL de módulo recibida por argumento y utilizan Chrome. Revisar cada cabecera y parámetros; algunos importan /src/ y requieren servidor de desarrollo, no preview/producción.

En scripts/: verify-checkout, verify-store-sales, verify-platform-pricing, verify-cart-photos, verify-product-detail, verify-product-edit, verify-product-upload, verify-product-questions, verify-login-reopen, verify-responsive-navigation, verify-guides y verify-audit-fixes. audit-production y audit-production-extra registran recorridos amplios; capture-guides genera capturas. Ver errores-conocidos por el fixture duplicado de subida.

## Definition of Done

- [ ] Comportamiento solicitado implementado con alcance/límites explicados.
- [ ] Tipos/build correctos al cambiar código y verificaciones adecuadas. Para documentación, comprobar fuentes, rutas y consistencia sin atribuir pruebas no ejecutadas.
- [ ] Carga, vacío, error recuperable y éxito donde corresponda.
- [ ] Rol correcto en ingreso, taller, preguntas y confirmación, sin presentar controles locales como seguridad real.
- [ ] Precios coherentes, recargo único de 10 %, redondeo y conservación del historial.
- [ ] Persistencia confirmada antes del éxito/vaciado; considerar cuota, recarga, sesión y pestañas según el cambio.
- [ ] Responsive, teclado, foco, etiquetas e imágenes revisados en vistas afectadas.
- [ ] Contexto actualizado sin borrar historia ni mezclar propuestas con implementación.

## Revisión de interfaz y resultados

Comprobar móvil (incluyendo 320/360 px), tablet y escritorio según el cambio. No imponer grilla única: revisar cada componente. Alternar tema; comprobar menú móvil, búsqueda, anclas desde rutas internas, galería, modales y drawer sin desbordamiento/solapamiento.

Para compras: visitante/comprador, agotados, cantidades, recarga, multitienda, comprobantes y vista de feriante en el mismo navegador. No efectuar transferencias ni mensajes externos para verificar una demo.

Indicar comandos realmente ejecutados y resultados. Separar evidencia histórica de pruebas actuales. Usar errores.md para correcciones y errores-conocidos.md para pendientes/límites. Recomendaciones de auditoría no autorizan automáticamente ampliar alcance.
