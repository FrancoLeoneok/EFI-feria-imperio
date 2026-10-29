# Feria Imperio | Catálogo Digital de Feriantes

Feriantes y emprendedores de Río Cuarto, Córdoba.

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white)

> Proyecto de catálogo digital para dar visibilidad a los puestos del Paseo del Andino y del Parque Sarmiento, conocer sus productos y facilitar el contacto directo por WhatsApp.

## 🌐 Sitio web

El proyecto está desplegado en **Vercel**:

👉 [Visitar Feria Imperio](https://feria-imperio.vercel.app/)

## 📚 Sobre el proyecto

**Feria Imperio** reúne en una misma aplicación a artesanos y emprendedores locales. Cada puesto cuenta con una tienda que presenta su historia, responsable, ubicación y catálogo de productos con precios en pesos argentinos.

La propuesta permite explorar la feria antes de visitarla, armar una lista con un presupuesto estimado y coordinar consultas o retiros por WhatsApp. Incluye seis rubros: **artesanías, cerámica, gastronomía, marroquinería, madera e indumentaria**.

La versión actual es una **demostración frontend** con datos simulados: seis feriantes, ocho productos y tres perfiles de compradores de ejemplo.

## ✨ Funcionalidades

- **Directorio de puestos:** búsqueda por nombre, responsable o biografía; filtros por rubro, paseo ferial y presencia confirmada para el fin de semana.
- **Tiendas individuales:** perfil del emprendedor, catálogo, búsqueda interna de productos y enlaces a WhatsApp e Instagram cuando están disponibles.
- **Detalle de productos:** imagen, descripción, precio, disponibilidad y especificaciones.
- **Mi Lista de Feria:** agregar productos, modificar cantidades, quitar artículos y calcular el total estimado. Genera un mensaje consolidado para consultar por WhatsApp al contacto de la feria.
- **Accesos de demostración:** inicio de sesión como comprador o feriante y registro simulado de compradores.
- **Mi Taller:** panel del feriante con creación y eliminación de productos, edición de precios y cambio de disponibilidad dentro de la vista.
- **Información de las ferias:** ubicaciones y enlaces a Google Maps.
- **Postulación de emprendimientos:** formulario con datos de contacto, rubro y enlaces obligatorios a Instagram y Facebook.
- **Postulación de stands:** modal accesible desde el banner y el botón «Postular mi emprendimiento», con elección de paseo, resumen del stand, pago simulado y confirmación. La demostración contempla un costo de $45.000 ARS e incluye un espacio de 3 × 3 metros, electricidad y Wi-Fi.
- **Banner y redes institucionales:** portada promocional, enlaces a Facebook, Instagram, YouTube y WhatsApp, y enlace a Vertex Tech en el pie de página.
- **Interfaz adaptable:** navegación móvil, tema claro y oscuro, notificaciones, guías de uso y modal de privacidad.

## 🛠️ Tecnologías utilizadas

- **React 18 y TypeScript:** componentes y modelos de dominio tipados.
- **Vite 6:** servidor de desarrollo y compilación para producción.
- **Tailwind CSS 3, PostCSS y Autoprefixer:** estilos utilitarios y diseño responsive.
- **React Router DOM 7:** navegación entre las páginas de la aplicación.
- **Zustand 5:** estado global y persistencia local de la sesión y la lista de productos.
- **Lucide React:** iconos de la interfaz.
- **Google Fonts:** tipografía Plus Jakarta Sans.

La identidad visual utiliza tonos terracota, verde bosque, arena y carbón, definidos en `tailwind.config.js`.

## 🧩 Arquitectura

La aplicación utiliza el **patrón Repository** para separar las consultas de datos de los componentes visuales:

1. Las páginas y componentes consultan las instancias exportadas en `src/repositories/index.ts`.
2. Las interfaces definen los contratos de productos, feriantes, consultas de contacto y postulaciones de stands.
3. Las implementaciones `mock` trabajan con datos locales y demoras artificiales para simular consultas asíncronas.
4. Los stores de Zustand administran la sesión, la lista de productos y los pasos de la postulación de stands.

Los modelos compartidos están en `src/types/index.ts`; el formato de precios y la construcción de enlaces a WhatsApp se centralizan en `src/utils/formatters.ts`.

## 📁 Estructura

```text
EFI-feria-imperio/
├── public/                     # Logos, favicon y banners
├── src/
│   ├── components/
│   │   ├── auth/               # Modal de ingreso y registro
│   │   ├── cart/               # Mi Lista de Feria
│   │   ├── catalog/            # Categorías, tarjetas y detalle de productos
│   │   ├── common/             # Tema, notificaciones, guías y privacidad
│   │   ├── contact/            # Formulario de postulación
│   │   ├── ferias/             # Información de los paseos feriales
│   │   ├── layout/             # Navegación, banner y pie de página
│   │   ├── stand/              # Modal de postulación y pago simulado
│   │   └── stores/             # Tarjetas y grilla de tiendas
│   ├── data/mockData.ts        # Feriantes, productos y compradores de ejemplo
│   ├── pages/                  # Inicio, tienda y panel del feriante
│   ├── repositories/
│   │   ├── interfaces/         # Contratos de acceso a datos
│   │   └── mock/               # Implementaciones simuladas
│   ├── store/                  # Sesión, lista de productos y postulación de stands
│   ├── types/                  # Tipos del dominio
│   ├── utils/                  # Formateadores y enlaces a WhatsApp
│   ├── App.tsx                # Rutas y componentes globales
│   ├── main.tsx               # Entrada de React
│   └── index.css              # Directivas Tailwind y estilos base
├── docs/contexto/              # Documentación de arquitectura y decisiones
├── Index.jsx                   # Prototipo previo
├── DetalleTienda.jsx            # Prototipo previo
├── PanelAdmin.jsx              # Prototipo previo
├── legacy_index.html           # Maqueta HTML previa
├── detalle_tienda.html          # Maqueta HTML previa
├── panel_admin.html             # Maqueta HTML previa
├── index.html                  # Entrada HTML de la aplicación actual
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── README.md
```

La aplicación actual se ejecuta desde `src/main.tsx`. Los prototipos JSX y las maquetas HTML de la raíz se conservan como referencias previas.

## 💾 Datos y alcance de la demostración

- **Catálogo inicial:** se define en `src/data/mockData.ts` y se consulta mediante repositorios simulados. No hay API ni base de datos remota.
- **Ediciones en Mi Taller:** solo modifican el estado local de la página. No actualizan el repositorio ni el catálogo público y se pierden al recargar o volver a montar la vista.
- **Lista de productos:** se conserva en el navegador con la clave `feria_imperio_cart`.
- **Sesión:** se conserva con la clave `feria_imperio_auth`.
- **Tema visual:** se guarda con la clave `feria_theme`.
- **Consultas y postulaciones del formulario de contacto:** se guardan localmente con la clave `feria_imperio_consultas`; el formulario no envía correos ni notifica a una organización real.
- **Postulaciones de stands:** se guardan localmente con la clave `feria_imperio_postulaciones_stand`. El enlace y la acreditación del pago son simulados; no se realiza ningún cobro ni reserva real.
- **Autenticación y registro:** se simulan en el cliente. El registro de compradores genera una sesión local, sin crear una cuenta en un servidor.
- **Compras:** no se procesan pagos ni se generan órdenes de compra. WhatsApp abre un mensaje preparado para que la persona revise y envíe la consulta.

Los datos de demostración, precios, contactos y confirmaciones de presencia no provienen de una agenda o inventario actualizado en tiempo real. La información local depende del navegador y puede perderse al borrar sus datos.

## 🤝 Colaboradores

Participantes del proyecto:

- [Joaquin Fornasari](https://github.com/FornaJoa)
- [Franco Leone](https://github.com/FrancoLeoneok)
- [Alejo Alaminos](https://github.com/AlejoAlaminos)
- [Nicolás Quiroga](https://github.com/nicoquiroga20-lang)

## 📝 Licencia

El repositorio no incluye actualmente un archivo `LICENSE`. No se declara una licencia de uso o redistribución en este README.
