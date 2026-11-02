export type GuideTab = 'usuario' | 'feriante';

export const guides = {
  usuario: {
    title: 'Guía de usuario',
    introduction:
      'Encontrá productos, armá tu carrito y seguí los pasos para comprar. Iniciá sesión al confirmar el pedido.',
    steps: [
      {
        title: 'Encontrá tu próximo puesto favorito',
        description:
          'Buscá puestos o artículos y filtrá por paseo y rubro. Tocá “Ver Tienda & Catálogo” para entrar a un puesto.',
        image: 'cliente-explorar',
        alt: 'Directorio actual con flechas y cuadros sobre el selector de paseo y el enlace al catálogo de una tienda.',
      },
      {
        title: 'Agregá productos al carrito',
        description:
          'Consultá los productos de la tienda. Tocá uno para ver sus detalles o “Agregar” para sumarlo al carrito.',
        image: 'cliente-producto',
        alt: 'Catálogo actual con una flecha y un recuadro sobre el botón Agregar al carrito.',
      },
      {
        title: 'Revisá las cantidades y el total',
        description:
          'Usá + y − para cambiar cantidades y el cesto para quitar productos. Revisá el total y tocá “Comprar”. Los precios incluyen la comisión del 10%.',
        image: 'cliente-lista',
        alt: 'Carrito actual con indicaciones numeradas sobre los controles de cantidad y el enlace Comprar.',
      },
      {
        title: 'Confirmá tu pedido',
        description:
          'Iniciá sesión como cliente. Revisá los productos, los datos de tu cuenta y el total; después tocá “Finalizar compra”.',
        image: 'cliente-confirmar',
        alt: 'Resumen de compra con una flecha y un cuadro sobre el botón Finalizar compra.',
      },
      {
        title: 'Transferí y adjuntá el comprobante',
        description:
          'Transferí el total a la cuenta de Feria Imperio cuando sus datos estén confirmados. Adjuntá la imagen y tocá “Guardar comprobantes”. Si aparece un alias de ejemplo, esperá los datos reales antes de pagar.',
        image: 'cliente-pago',
        alt: 'Pantalla de pago único con flechas y cuadros sobre los datos de la cuenta y Guardar comprobantes; también se ve el área para adjuntar imágenes.',
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
          'Entrá a “Mi Taller” desde tu cuenta. Tocá “Ver Mi Tienda” y copiá el enlace del navegador para compartir tu catálogo.',
        image: 'feriante-taller',
        alt: 'Panel Mi Taller con un cuadro y una flecha sobre el enlace Ver Mi Tienda.',
      },
      {
        title: 'Indicá la disponibilidad de tus productos',
        description:
          'Tocá el estado del producto para alternar entre “En Stock” y “Bajo Pedido”.',
        image: 'feriante-stock',
        alt: 'Inventario del taller con el botón En Stock enmarcado y señalado con una flecha.',
      },
      {
        title: 'Editá un precio desde el inventario',
        description:
          'Tocá el lápiz, ingresá tu precio base y guardá. “Cliente” muestra el precio final con el 10% de comisión. La X cancela el cambio.',
        image: 'feriante-precio',
        alt: 'Editor de precio abierto, con el campo y los botones de guardar y cancelar dentro de un cuadro.',
      },
      {
        title: 'Cargá una nueva creación',
        description:
          'Desde el inventario, tocá “Agregar Nuevo Producto” para abrir el formulario de carga.',
        image: 'feriante-producto',
        alt: 'Panel de inventario con el botón Agregar Nuevo Producto enmarcado y señalado.',
      },
      {
        title: 'Completá la información del producto',
        description:
          'Escribí el título, precio base, rubro y descripción. Revisá la comisión y el precio final al cliente; agregá fotos y los datos de tu creación.',
        image: 'feriante-formulario',
        alt: 'Formulario de producto con flechas y recuadros sobre el título y la explicación del precio base y la comisión.',
      },
      {
        title: 'Revisá y publicá tu creación',
        description:
          'Revisá la vista previa y tocá “Publicar en mi tienda”. El producto aparecerá en tu inventario y en el catálogo público.',
        image: 'feriante-publicar',
        alt: 'Vista previa del formulario con una flecha y un cuadro sobre el botón Publicar en mi tienda.',
      },
    ],
  },
};
