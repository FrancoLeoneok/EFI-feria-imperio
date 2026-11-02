# Feria Imperio | Catálogo digital de feriantes

Prototipo frontend académico para visibilizar a feriantes y emprendedores de Río Cuarto, Córdoba, con catálogo digital y un flujo de compra de demostración.

[Ver demostración en Vercel](https://feria-imperio.vercel.app/)

## Sobre el proyecto

Feria Imperio reúne a emprendedores del Paseo del Andino y del Parque Sarmiento. Permite explorar tiendas y productos, realizar preguntas, armar un carrito y generar pedidos de demostración. Cada feriante dispone de un taller para administrar sus productos, responder consultas y visualizar los pedidos de su tienda.

La aplicación utiliza datos de ejemplo y persistencia local en el navegador. No incorpora backend, autenticación de servidor ni pagos reales. Los datos generados en un navegador no se comparten con otros dispositivos ni se envían a la organización.

Los rubros del catálogo son **artesanías, cerámica, gastronomía, marroquinería, madera e indumentaria**.

## Funcionalidades actuales

### Catálogo y navegación

- Directorio de tiendas con búsqueda por texto y filtros por rubro y paseo ferial.
- Ficha de cada tienda con banner, biografía, responsable, ubicación y catálogo con búsqueda interna.
- Catálogo de productos con búsqueda y filtro por rubro.
- Página individual de producto con galería, descripción, especificaciones, precio y disponibilidad.
- Vista inicial adaptada al rol: el comprador puede alternar entre productos y tiendas.
- Información estática de los paseos, enlaces a Google Maps y redes institucionales.
- Diseño responsive, tema claro/oscuro, guías de uso, notificaciones y aviso de privacidad.

### Compradores

- Inicio de sesión y registro de demostración.
- Carrito persistente con productos de diferentes tiendas, cantidades y total.
- Checkout de demostración que requiere una sesión de comprador para confirmar.
- Pedido con productos agrupados por tienda y conservación de los precios e imágenes del momento de la compra.
- Instrucciones de transferencia ficticias y carga local de imágenes de comprobantes.
- Recuperación del pedido mediante su enlace en el mismo navegador y con la sesión correspondiente.
- Preguntas públicas por producto, con respuestas del feriante, dentro de los datos del navegador.

### Feriantes: Mi Taller

- Acceso de demostración a los puestos de ejemplo.
- Alta y edición de productos, precios, descripciones, imágenes, disponibilidad y marca de destacado.
- Eliminación de productos, con la limitación de los productos iniciales descrita más abajo.
- Gestión de preguntas de los productos de la tienda.
- Consulta de pedidos de la propia tienda y ampliación de sus comprobantes locales.

El formulario de consulta/postulación de tienda guarda la solicitud localmente. No crea un feriante, aprueba una tienda ni envía correos o notificaciones a la organización.

## Precios y pagos de demostración

El precio almacenado del producto es el precio base del feriante. La aplicación añade un **10 % de recargo de plataforma** al calcular el precio al comprador y los totales del pedido. La regla se centraliza en `src/utils/pricing.ts`.

La configuración de transferencia está en `src/config/platformPayment.ts`: contiene un alias de ejemplo, CVU vacío y `demostracion: true`. **No se debe transferir dinero a partir de estos datos.**

Confirmar un pedido o adjuntar un comprobante no acredita un pago. El estado permanece pendiente; no hay integración bancaria, validación del pago ni liquidación a vendedores.

## Tecnologías

- **React 18 y TypeScript:** interfaz y modelos tipados.
- **Vite 6:** desarrollo y compilación de producción.
- **Tailwind CSS 3, PostCSS y Autoprefixer:** estilos y diseño responsive.
- **React Router DOM 7:** navegación SPA mediante rutas dinámicas.
- **Zustand 5:** sesión, carrito y disponibilidad, con persistencia local.
- **IndexedDB y localStorage:** almacenamiento del navegador.
- **Lucide React:** iconos; **clsx y tailwind-merge:** composición de clases.
- **Google Fonts:** Plus Jakarta Sans.

Las familias de versiones corresponden a `package.json`; `package-lock.json` fija las versiones resueltas. La paleta terracota, verde bosque, arena y carbón se define en `tailwind.config.js`.

Python, FastAPI, SQLite, SQLModel, Alembic y Docker no forman parte de la implementación actual. Son alternativas planteadas para una evolución posterior.

## Ejecutar localmente

Requisitos: Git, Node.js compatible con Vite 6 y npm.

```bash
git clone https://github.com/FrancoLeoneok/EFI-feria-imperio.git
cd EFI-feria-imperio
npm ci
npm run dev
```

Abrir la dirección que indique Vite, normalmente `http://localhost:5173`. Si el puerto está ocupado, Vite puede seleccionar otro.

No se requieren variables de entorno, credenciales de servicios externos ni una base de datos de servidor para ejecutar la demostración.

### Compilación y vista previa

```bash
npm run build
npm run preview
```

`build` ejecuta la comprobación de TypeScript y genera los archivos estáticos en `dist/`. `preview` permite revisar esa compilación localmente.

El despliegue del frontend está preparado para Vercel. `vercel.json` redirige las rutas a `index.html` para permitir el acceso directo a tiendas, productos y checkout. Publicar la aplicación no centraliza los datos guardados en cada navegador.

## Accesos de prueba

El modal de ingreso ofrece perfiles de demostración para explorar los roles.

- **Feriante:** se puede ingresar con un puesto de ejemplo, como `fer-01`, y la clave `feria123`.
- **Comprador:** se puede usar un perfil de ejemplo con la clave `comprador123`, o completar el registro simulado.

El registro del comprador genera una sesión local, sin crear una cuenta en un servidor. Estos accesos sirven para probar la interfaz y no constituyen autenticación real.

## Arquitectura y rutas

Las páginas y componentes consultan repositorios para separar la interfaz del acceso a datos. `src/repositories/index.ts` expone implementaciones mock de productos, feriantes, contacto y postulaciones. Los productos combinan datos iniciales con modificaciones locales. Pedidos y preguntas disponen de módulos de persistencia propios.

Los hooks de React administran estado de componentes; Zustand gestiona sesión, carrito y disponibilidad. Los tipos compartidos están en `src/types/index.ts`, y los módulos de pedidos y preguntas también declaran sus propios modelos.

Rutas activas:

- `/`: directorio y catálogo.
- `/tienda/:id`: ficha de tienda.
- `/producto/:id`: detalle y preguntas de producto.
- `/admin`: Mi Taller del feriante; no es administración general de la plataforma.
- `/checkout`: resumen de compra; `?pedido=...` permite recuperar un pedido local.
- Cualquier otra ruta muestra una página de recuperación.

```text
src/
├── components/
│   ├── admin/          # Ventas de la tienda
│   ├── auth/           # Ingreso y registro de demostración
│   ├── cart/           # Carrito, pedido y comprobantes
│   ├── catalog/        # Tarjetas, galerías y formularios de producto
│   ├── common/         # Tema, guías, privacidad y notificaciones
│   ├── contact/        # Consulta/postulación local
│   ├── ferias/         # Información de los paseos
│   ├── layout/         # Navegación, banner y pie
│   ├── questions/      # Preguntas y respuestas
│   └── stores/         # Directorio de tiendas
├── config/             # Datos de pago de demostración
├── data/               # Catálogo inicial y guías
├── pages/              # Inicio, tienda, producto, taller y checkout
├── repositories/       # Contratos, mocks y persistencia local
├── store/              # Stores de Zustand
├── types/              # Modelos compartidos
├── utils/              # Precios, formatos y eventos de pedidos
├── App.tsx             # Rutas y componentes globales
├── main.tsx            # Entrada de la aplicación
└── index.css           # Tailwind y estilos base
```

También se incluyen `public/` para recursos estáticos, `scripts/` para verificaciones y `docs/` para documentación. Los archivos JSX y las maquetas HTML de la raíz son referencias previas; la aplicación activa se inicia desde `src/main.tsx`.

## Persistencia y límites

- **localStorage:** sesión, carrito, disponibilidad manual, tema y consultas del formulario.
- **IndexedDB:** productos creados/editados, pedidos con imágenes de comprobantes y preguntas/respuestas.
- **Datos iniciales:** tiendas y productos de ejemplo definidos en `src/data/mockData.ts`.

Los datos dependen del navegador y del origen de la aplicación. Localhost y el sitio publicado tienen almacenamientos separados. Borrar los datos del sitio puede eliminar el contenido local. Cambiar de rol en el mismo navegador permite recorrer la demostración de comprador y feriante; abrir otro dispositivo no comparte esas operaciones.

Limitaciones conocidas:

- Los productos iniciales eliminados pueden reaparecer al recargar, porque su eliminación no queda registrada permanentemente sobre el catálogo de ejemplo.
- La disponibilidad es un indicador manual; no hay unidades de stock ni descuento automático por compra.
- El formulario de contacto no confirma recepción por una organización real y su repositorio puede devolver éxito aunque falle el almacenamiento local.
- La información de presencia y próxima feria es estática, sin una agenda administrable. El banner contiene una fecha sin año que debe revisarse antes de usarla como información real.
- Existe un repositorio mock para postular y simular el pago de un stand físico, pero ese flujo no está conectado a la interfaz actual.
- No hay administrador general, aprobación de emprendedores, suscripciones, cupos comerciales por plan, reseñas, chatbot, WhatsApp integrado, seguimiento de envíos ni mapas en vivo.

La evolución a un servicio operativo requiere backend, persistencia compartida, autenticación y permisos de servidor, recepción efectiva de postulaciones e integración de pagos.

## Verificación y documentación

`npm run build` comprueba tipos y compilación. `scripts/` contiene verificaciones de recorridos como checkout, ventas, productos, preguntas y navegación; no hay un comando `npm test` configurado. Consultar cada script antes de ejecutarlo para conocer sus dependencias, URL objetivo y requisitos de navegador.

Documentación disponible:

- [Contexto y arquitectura](docs/contexto/arquitectura.md).
- [Auditoría funcional del 1 de noviembre de 2026](docs/auditoria-funcional-2026-11-01.md): resultados y limitaciones de esa revisión; no implica que todos los hallazgos sigan vigentes.
- [Revisión del documento académico](docs/revision-documento-academico-2026-11-01.md): diferencias entre la propuesta escrita y la implementación revisada.
- [Especificaciones de funcionalidades](docs/intake/): checkout por transferencia, ventas por tienda y preguntas por producto.

## 🤝 Colaboradores

Participantes del Trabajo

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/FornaJoa" title="Perfil de Joaquin Fornasari en GitHub">
        <img src="https://avatars.githubusercontent.com/u/163206353?v=4" width="100" alt="Foto de Joaquin Fornasari en GitHub"/><br>
        <sub>
          <b>Joaquin Fornasari</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/FrancoLeoneok" title="Perfil de Franco Leone en GitHub">
        <img src="https://avatars.githubusercontent.com/u/178578464?v=4" width="100" alt="Foto de Franco Leone en GitHub"/><br>
        <sub>
          <b>Franco Leone</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AlejoAlaminos" title="Perfil de Alejo Alaminos en GitHub">
        <img src="https://avatars.githubusercontent.com/u/164796037?v=4" width="100" alt="Foto de Alejo Alaminos en GitHub"/><br>
        <sub>
          <b>Alejo Alaminos</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/nicoquiroga20-lang" title="Perfil de Nicolas Quiroga en GitHub">
        <img src="https://avatars.githubusercontent.com/u/232619836?v=4" width="100" alt="Foto de Nicolas Quiroga en GitHub"/><br>
        <sub>
          <b>Nicolas Quiroga</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## 📝 Licencia

- Este proyecto fue desarrollado exclusivamente con fines educativos y de aprendizaje como parte de la **EFI (Examen Final Integrador) de Programación 2**, enfocado en la aplicación e integración de los conocimientos de la materia mediante el desarrollo de Feria Imperio. Queda libre su consulta, uso e inspiración como material de referencia y estudio académico.
