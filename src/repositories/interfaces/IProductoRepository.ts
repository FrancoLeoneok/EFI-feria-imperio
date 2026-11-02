import { FiltrosCatalogo, Producto, Rubro } from '../../types';

export interface IProductoRepository {
  create(producto: Producto): Promise<void>;
  update(producto: Producto): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Producto[]>;
  getById(id: string): Promise<Producto | null>;
  getByRubro(rubro: Rubro): Promise<Producto[]>;
  getByFeriante(ferianteId: string): Promise<Producto[]>;
  filtrar(filtros: FiltrosCatalogo): Promise<Producto[]>;
}
