# Preguntas por producto Implementation Plan

**Goal:** Implementar el flujo local aprobado de preguntas públicas y respuestas del propietario.
**Architecture:** Repositorio IndexedDB con transacciones para evitar respuestas duplicadas, validación de sesión y propiedad, y eventos locales para refrescar vistas. Componentes independientes para producto y panel.
**Tech Stack:** React, TypeScript, IndexedDB, Tailwind.
**Spec:** docs/intake/preguntas-productos/01-prd.md y documentos 02–06 del mismo directorio.

## Restricciones
Sin dependencias nuevas. No tocar cambios ajenos. Persistencia solo en navegador. Pregunta hasta 1000 caracteres y respuesta hasta 2000. Una respuesta por pregunta.

## Tareas
- [x] Crear modelo, repositorio y hook de lectura; verificar permisos y transiciones.
- [x] Crear formulario compartido, listado público y bandeja privada; integrar en ProductModal y AdminPage. Ampliar captura de foco del modal para incluir campos y permitir abrir login.
- [x] Ejecutar build, verificación de flujo en navegador y React Doctor; revisar diff.

## Verificación
Probar visitante, comprador, propietario y otra tienda. Verificar recarga, texto vacío, duplicados y contador tras responder. Reportar limitaciones reales del entorno.


## Resultado
Build correcto. Prueba Chrome móvil aprobada: permisos, validación, contador, historial, persistencia, lectura pública y envío mediante formulario. React Doctor: sin hallazgos en el alcance de cambios rastreados (71/100 global informado); no constituye una revisión de archivos nuevos no rastreados. Sin backend compartido, según alcance aprobado.
