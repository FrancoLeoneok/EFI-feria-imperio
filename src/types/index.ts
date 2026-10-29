/**
 * Modelos de Dominio - Feria Imperio
 * Definiciones de tipos estrictas para el ecosistema de feriantes y catálogo digital.
 */

export type Rubro =
  | 'artesanias'
  | 'ceramica'
  | 'gastronomia'
  | 'marroquineria'
  | 'madera'
  | 'indumentaria';

export interface RubroInfo {
  id: Rubro;
  label: string;
  icon: string;
  description: string;
}

export type UbicacionFeria = 'parque_sarmiento' | 'paseo_andino' | 'ambos';

export interface Feriante {
  id: string;
  nombreComercio: string;
  nombreResponsable: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  rubroPrincipal: Rubro;
  ubicacionFeria: UbicacionFeria;
  puestoNumero: string;
  findeConfirmado: boolean;
  whatsapp: string; // Formato internacional, ej: "5493581234567"
  instagram?: string;
}

export interface UsuarioComprador {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  avatarUrl: string;
  ubicacion?: string;
  rol: 'comprador';
}

export type RolUsuario = 'feriante' | 'comprador';

export interface Producto {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number; // En Pesos Argentinos ($ ARS)
  rubro: Rubro;
  ferianteId: string;
  ferianteNombre: string;
  imagenUrl: string;
  enStock: boolean;
  destacado: boolean;
  especificaciones?: Record<string, string>;
}

export interface ConsultaContacto {
  id?: string;
  nombreCompleto: string;
  nombreEmprendimiento: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  rubro: Rubro;
  mensaje: string;
  fechaEnvio?: string;
}

export interface FiltrosCatalogo {
  busqueda: string;
  rubro: Rubro | 'todos';
  soloDisponibles: boolean;
  orden: 'destacados' | 'precio_menor' | 'precio_mayor';
}

/**
 * Modelo de Postulación a la Feria Física (Reserva de Stand con Luz y Wi-Fi)
 */
export interface PostulacionStand {
  id: string;
  nombreCompleto: string;
  nombreEmprendimiento: string;
  telefono: string;
  email: string;
  rubro: Rubro;
  descripcion: string;
  ubicacionPreferencia: UbicacionFeria;
  serviciosIncluidos: string[];
  costoStand: number; // Por defecto $45.000 ARS
  estadoPago: 'pendiente' | 'pagado';
  linkPagoSimulado: string;
  fechaCreacion: string;
}

/**
 * Estados estandarizados de UI (4 Estados) para componentes con carga asíncrona
 */
export type UIStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

