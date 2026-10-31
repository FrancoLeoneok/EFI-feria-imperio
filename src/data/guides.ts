export type GuideTab = 'usuario' | 'feriante';

export const guides = {
  usuario: {
    title: 'Guía de usuario',
    introduction:
      'Descubrí los puestos y prepará tu visita a la feria. Podés explorar y armar tu lista sin iniciar sesión.',
    steps: [
      {
        title: 'Encontrá tu próximo puesto favorito',
        description:
          'Usá el buscador para encontrar puestos, rubros o artículos. En el directorio podés filtrar por paseo y rubro. Activá “Finde Confirmado” para ver quiénes estarán en la feria y entrá con “Ver Tienda & Catálogo”.',
        image: 'cliente-explorar',
        alt: 'Directorio de puestos con un cuadro y una flecha sobre el filtro Finde Confirmado.',
      },
      {
        title: 'Explorá los productos y armá tu lista',
        description:
          'Dentro de cada tienda podés consultar sus productos, precios y disponibilidad. Tocá un producto para ver sus detalles o el botón “Agregar” con el signo + para sumarlo a tu lista de feria.',
        image: 'cliente-producto',
        alt: 'Catálogo de una tienda con el botón de agregar a la lista enmarcado y señalado con una flecha.',
      },
      {
        title: 'Revisá tu presupuesto antes de ir',
        description:
          'La lista se abre al sumar un producto. Si iniciaste sesión como cliente, también podés abrirla desde “Mi Lista de Compras” en el menú de tu cuenta. Usá + y − para ajustar cantidades o el cesto para quitar un producto. El total es estimado: la compra la coordinás directamente con cada feriante.',
        image: 'cliente-lista',
        alt: 'Lista de feria abierta, con sus controles de cantidad enmarcados y el total estimado visible.',
      },
    ],
  },
  feriante: {
    title: 'Guía de feriante',
    introduction:
      'Conocé las herramientas de Mi Taller para gestionar el catálogo de tu puesto.',
    steps: [
      {
        title: 'Conocé tu taller y tu tienda pública',
        description:
          'Desde el menú de tu cuenta entrá a “Mi Taller”. Allí encontrás el resumen de tu catálogo. “Ver Mi Tienda” abre la página que ven tus clientes: copiá su enlace desde el navegador para compartirlo.',
        image: 'feriante-taller',
        alt: 'Panel Mi Taller con un cuadro y una flecha sobre el enlace Ver Mi Tienda.',
      },
      {
        title: 'Indicá la disponibilidad de tus productos',
        description:
          'En el inventario, tocá el estado de disponibilidad para alternar entre “En Stock” y “Bajo Pedido”. Elegí la opción que corresponda a cada producto.',
        image: 'feriante-stock',
        alt: 'Inventario del taller con el botón En Stock enmarcado y señalado con una flecha.',
      },
      {
        title: 'Editá un precio desde el inventario',
        description:
          'Tocá el lápiz junto al precio, ingresá el nuevo valor en pesos argentinos y confirmá con el ícono de guardar. Si preferís conservar el valor anterior, tocá la X para cancelar.',
        image: 'feriante-precio',
        alt: 'Editor de precio abierto, con el campo y los botones de guardar y cancelar dentro de un cuadro.',
      },
      {
        title: 'Cargá una nueva creación',
        description:
          'Tocá “Agregar Nuevo Producto” y completá su nombre, precio, rubro y descripción. Podés agregar un enlace a su imagen. Revisá los datos y confirmá con “Publicar en Mi Tienda”.',
        image: 'feriante-producto',
        alt: 'Panel de inventario con el botón Agregar Nuevo Producto enmarcado y señalado.',
      },
    ],
  },
};
