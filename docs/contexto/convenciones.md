# Convenciones de desarrollo - Feria Imperio

Actualizado: 2026-11-02.

## Código y datos

- React con TypeScript estricto; componentes PascalCase.tsx, hooks/stores con prefijo use y archivos camelCase.ts. Evitar any arbitrario.
- Tipos compartidos en src/types/index.ts; modelos específicos de pedidos/preguntas en sus módulos. Contratos de repositorio con prefijo I.
- Acceder a catálogo y feriantes mediante src/repositories/index.ts; pedidos, checkout y preguntas mediante sus módulos. Evitar almacenamiento ad hoc desde componentes.
- Hooks para estado de componente; Zustand para sesión, carrito y disponibilidad. Persistir datos necesarios, no estados transitorios de modales o carga.
- Reutilizar formatARS y normalizeSearchText de src/utils/formatters.ts. La existencia de buildWhatsAppLink no implica un recorrido WhatsApp integrado en la interfaz actual.

## Estilos y accesibilidad

Tailwind CSS v3, sin Bootstrap ni sintaxis de Tailwind v4. Tokens terracotta, forest, sand y charcoal en tailwind.config.js; modo oscuro con dark:. CSS base en src/index.css.

Diseño mobile-first: sm 640, md 768, lg 1024 y xl 1280 px. Preferir anchos fluidos y contenedores máximos; evitar w-screen y anchos rígidos desbordados.

Usar HTML semántico según función: header, nav, main, section, article, aside y footer. Etiquetar imágenes/controles, comprobar teclado, foco visible, cierre y retorno de foco en diálogos. Contraste y áreas táctiles deben verificarse: las clases utilitarias no certifican accesibilidad.

## Estados de interfaz

Representar carga, vacío, error recuperable y éxito en operaciones asíncronas; UIStatus también incluye idle. No anunciar éxito antes de finalizar la persistencia. Diferenciar simulación local de recepción por servidor; el formulario de contacto todavía presenta una excepción conocida.

## Invariantes funcionales

- Producto.precio contiene precio base. Aplicar el recargo de 10 % mediante customerPrice en src/utils/pricing.ts; no volver a aplicarlo al precio final de un pedido histórico.
- Conservar instantáneas del pedido; guardar antes de limpiar el carrito. Respetar revisión/idempotencia y cambios de sesión al confirmar.
- Disponibilidad efectiva: override de useStockStore si existe, o enStock del producto. Bloquear agregado y validar de nuevo en checkout.
- No duplicar fotos data URL y galerías en localStorage del carrito; mantener imágenes en IndexedDB.
- Filtrar ventas por feriante y recuperar pedidos por comprador. Son controles de demostración en cliente, no seguridad de servidor.
- Solo comprador identificado pregunta y confirma; solo el feriante dueño responde preguntas de su tienda. Respuesta única validada en repositorio.
- No presentar comprobantes como pagos acreditados ni datos bancarios de ejemplo como operativos.

## Alcance

Mantener el alcance académico local acordado. Evaluar con el usuario cambios de dependencias, servicios o arquitectura cuando excedan su pedido. Una actualización documental o un arreglo puntual no implica migrar a backend.
