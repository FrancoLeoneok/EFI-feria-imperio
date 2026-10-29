# Glosario de Dominio, UI y Siglas - Feria Imperio

## 1. Términos del Dominio Ferial (Negocio)
- **Feria Imperio**: Portal y catálogo web de artesanos y emprendedores de Río Cuarto (Córdoba).
- **Feriante / Artesano**: Persona física o taller que elabora y comercializa creaciones en la feria.
- **Gazebo / Puesto**: Espacio físico numerado (`puestoNumero`) en el predio ferial, reflejado digitalmente en la tarjeta de tienda.
- **Paseos de Ferias**: Polos feriales de la ciudad:
  - *Paseo del Andino*
  - *Parque Sarmiento*
- **Rubro**: Clasificación productiva (`artesanias`, `ceramica`, `gastronomia`, `marroquineria`, `madera`, `indumentaria`).
- **Finde Confirmado**: Distintivo (`findeConfirmado: boolean`) que certifica la asistencia presencial del feriante en la próxima edición.
- **Presupuesto Simulado**: Lista de compra no vinculante que el usuario arma localmente antes de contactar al artesano vía WhatsApp.
- **Disponibilidad**: Estado del producto: *En Stock* (entrega inmediata) o *Bajo Pedido* (elaboración artesanal previa).

---

## 2. Entidades de Interfaz de Usuario (UI)
- **`NavBar`**: Cabecera fija con logotipo, buscador de feriantes, selector de tema oscuro y acceso al panel de vendedor.
- **`HeroBanner`**: Bloque promocional superior con fecha próxima, ubicación del paseo y botón directo a puestos.
- **`CategoryFilter`**: Barra de botones (pills) para filtrar dinámicamente por rubro y predio ferial.
- **`StoreCard`**: Tarjeta de resumen de tienda ferial con fotos de portada, avatar, rubro, puesto y botón "Ver Tienda".
- **`StoreGrid`**: Contenedor en grilla responsiva de puestos que gestiona los 4 estados de UI.
- **`ProductCard`**: Tarjeta individual de producto con precio en ARS, disponibilidad y botones de WhatsApp y carrito.
- **`ProductGrid`**: Grilla de productos del catálogo exclusivo de una tienda.
- **`ProductModal`**: Ventana modal con ficha ampliada y especificaciones artesanales.
- **`CartDrawer`**: Panel deslizable lateral que lista productos seleccionados, subtotales y botón de consulta por WhatsApp.
- **`FeriasSection`**: Sección informativa sobre los predios feriales oficiales (Andino y Sarmiento).
- **`ContactForm`**: Formulario de postulación de "Convocatoria Abierta" para nuevos feriantes interesados en registrarse, que solicita datos de contacto, rubro y enlaces obligatorios a redes sociales (Instagram y Facebook con URLs de ejemplo).
- **`FloatingWhatsApp`**: Botón flotante de contacto rápido ubicado en la esquina inferior derecha.
- **`ThemeToggle`**: Botón para alternar entre modo claro y modo oscuro.
- **`Toast`**: Notificación flotante temporal de confirmación o alerta.

---

## 3. Siglas y Convenciones Internas
- **ARS**: Pesos Argentinos (moneda utilizada en el catálogo).
- **SPA**: Single Page Application (aplicación web de una sola página gestionada con `react-router-dom`).
- **ADR**: Architecture Decision Record (registro formal de decisiones de diseño de software).
- **SDD**: Spec-Driven Development (desarrollo guiado por especificaciones).
- **DoD**: Definition of Done (criterios innegociables para dar por finalizada una tarea).
- **UIStatus**: Tipo unión (`'idle' | 'loading' | 'success' | 'empty' | 'error'`) para controlar la experiencia de carga asíncrona.
- **CTA**: Call To Action (llamada a la acción, ej: "Consultar por WhatsApp", "Ver Tienda").
