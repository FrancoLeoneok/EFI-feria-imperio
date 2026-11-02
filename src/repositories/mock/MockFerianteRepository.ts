import { FERIANTES_MOCK, PRODUCTOS_MOCK, RUBROS_DATA } from '../../data/mockData';
import { Feriante, UbicacionFeria } from '../../types';
import { IFerianteRepository, FiltrosFeriante } from '../interfaces/IFerianteRepository';
import { normalizeSearchText } from '../../utils/formatters';
import { withStorePayment } from '../storePayments';

export class MockFerianteRepository implements IFerianteRepository {
  private feriantes: Feriante[] = [...FERIANTES_MOCK];

  private async delay(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAll(): Promise<Feriante[]> {
    await this.delay();
    return this.feriantes.map(withStorePayment);
  }

  async getById(id: string): Promise<Feriante | null> {
    await this.delay();
    const feriante = this.feriantes.find((f) => f.id === id);
    return feriante ? withStorePayment(feriante) : null;
  }

  async getByUbicacion(ubicacion: UbicacionFeria): Promise<Feriante[]> {
    await this.delay();
    return this.feriantes.map(withStorePayment).filter(
      (f) => f.ubicacionFeria === ubicacion || f.ubicacionFeria === 'ambos'
    );
  }

  async getConfirmados(): Promise<Feriante[]> {
    await this.delay();
    return this.feriantes.map(withStorePayment).filter((f) => f.findeConfirmado);
  }

  async filtrar(filtros: FiltrosFeriante): Promise<Feriante[]> {
    await this.delay();
    let lista = this.feriantes.map(withStorePayment);

    if (filtros.rubro && filtros.rubro !== 'todos') {
      lista = lista.filter((f) => f.rubroPrincipal === filtros.rubro);
    }

    if (filtros.ubicacion && filtros.ubicacion !== 'todas') {
      lista = lista.filter(
        (f) => f.ubicacionFeria === filtros.ubicacion || f.ubicacionFeria === 'ambos'
      );
    }

    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const q = normalizeSearchText(filtros.busqueda);
      lista = lista.filter((f) => {
        // 1. Nombre de puesto / comercio
        const matchComercio = normalizeSearchText(f.nombreComercio).includes(q);
        // 2. Nombre del artesano responsable
        const matchResponsable = normalizeSearchText(f.nombreResponsable).includes(q);
        // 3. Número o sector del puesto físico
        const matchPuesto = normalizeSearchText(f.puestoNumero).includes(q);
        // 4. Bio / descripción de la tienda
        const matchBio = normalizeSearchText(f.bio).includes(q);
        // 5. Rubro principal (identificador o etiqueta con tildes)
        const matchRubro =
          normalizeSearchText(f.rubroPrincipal).includes(q) ||
          RUBROS_DATA.some(
            (r) => r.id === f.rubroPrincipal && normalizeSearchText(r.label).includes(q)
          );
        // 6. Artículos y creaciones del puesto
        const matchProductos = PRODUCTOS_MOCK.some(
          (p) =>
            p.ferianteId === f.id &&
            (normalizeSearchText(p.titulo).includes(q) ||
              normalizeSearchText(p.descripcion).includes(q) ||
              normalizeSearchText(p.rubro).includes(q) ||
              Object.values(p.especificaciones || {}).some((spec) =>
                normalizeSearchText(spec).includes(q)
              ))
        );

        return (
          matchComercio ||
          matchResponsable ||
          matchPuesto ||
          matchBio ||
          matchRubro ||
          matchProductos
        );
      });
    }

    return lista;
  }
}
