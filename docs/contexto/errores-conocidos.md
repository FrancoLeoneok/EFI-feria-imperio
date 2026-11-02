# Errores conocidos y limitaciones vigentes - Feria Imperio

Actualizado: 2026-11-02 mediante lectura del código. No es una nueva reproducción de navegador. Evidencia histórica: [auditoría del 1 de noviembre](../auditoria-funcional-2026-11-01.md). Sus hallazgos 4 a 7 ya tienen correcciones: ver errores.md.

## Fallos pendientes

- **EC-001 · Identidad de compradores registrados:** registrarComprador y el ingreso de compradores no mock generan IDs con Date.now(). Volver a ingresar con el mismo correo puede cambiar identidad e impedir recuperar pedidos anteriores. No se conserva/verifica la contraseña registrada. Fuente: src/store/useAuthStore.ts. Los perfiles mock estables permiten repetir la demo, sin resolver este fallo.
- **EC-002 · Contacto anuncia recepción sin entrega:** MockContactoRepository guarda solo en feria_imperio_consultas y oculta errores de almacenamiento antes de devolver éxito. No envía a la organización; con cuota agotada puede perder los datos. Fuente: src/repositories/mock/MockContactoRepository.ts.
- **EC-003 · Productos iniciales borrados reaparecen:** delete elimina de IndexedDB y del array de instancia, pero al recargar se reconstruye desde PRODUCTOS_MOCK. Falta persistir la eliminación del dato inicial. Fuentes: MockProductoRepository y localProducts.
- **EC-004 · Acceso al carrito de visitante:** la auditoría detectó que al cerrar el drawer falta acceso visible para reabrirlo sin agregar otro artículo o iniciar sesión. La navegación mantiene el acceso condicionado al comprador; revisar antes de dar por resuelto.
- **EC-005 · Fixture de galería duplicado:** verify-product-upload usa logo.png y favicon.png; la auditoría encontró contenidos idénticos. La galería deduplica, por lo que esperar otra foto bloquea el script. Es un problema del fixture documentado, no evidencia de galería rota.

## Límites de demostración

- Sesiones y roles confiados al cliente, con perfiles/claves de prueba; no hay autenticación de servidor.
- Persistencia por navegador y origen. Otro dispositivo no comparte productos, preguntas, ventas ni comprobantes. Borrar datos del sitio puede perderlos.
- Transferencia ficticia: alias de ejemplo, CVU vacío y demostracion: true. Los pedidos siguen pendientes aun con comprobante.
- Stock booleano manual, sin unidades ni descuento automático tras comprar.
- Presencia y próxima feria estáticas; el banner contiene fecha sin año que debe revisarse para uso real.
- Postulación/pago simulado de stand tiene modelo/repositorio, pero no recorrido activo de interfaz.

Estos límites no autorizan por sí solos a incorporar backend o pagos reales.

## Riesgos de interfaz a comprobar

El tema se aplica desde un efecto de ThemeToggle: no afirmar ausencia total de parpadeo antes del primer pintado. Alt y proporciones de imágenes no aseguran disponibilidad de recursos externos ni fallback universal. Overflow oculto puede esconder contenido desbordado.

Revisar anclas desde páginas internas, capas de modales/drawer/toast, teclado y retorno de foco. No hay certificación general WCAG ni verificación actual de Safari/Firefox. En Windows evitar 100vw para contenedores completos y mantener fin de línea consistente; usar / en imports.
