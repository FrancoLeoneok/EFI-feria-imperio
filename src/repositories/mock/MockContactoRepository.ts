import { ConsultaContacto } from '../../types';
import { IContactoRepository, ResumenEnvioContacto } from '../interfaces/IContactoRepository';

export class MockContactoRepository implements IContactoRepository {
  private STORAGE_KEY = 'feria_imperio_consultas';

  private async delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async enviarConsulta(consulta: ConsultaContacto): Promise<ResumenEnvioContacto> {
    await this.delay();

    // Validación básica de campos requeridos
    if (!consulta.nombreCompleto || !consulta.whatsapp || !consulta.email || !consulta.instagram || !consulta.facebook) {
      return {
        success: false,
        mensaje: 'Por favor complete todos los campos obligatorios del formulario.',
      };
    }

    const nuevaConsulta: ConsultaContacto = {
      ...consulta,
      id: `con-${Date.now()}`,
      fechaEnvio: new Date().toISOString(),
    };

    // Guardado local para trazabilidad en demostración
    try {
      const anteriores = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      anteriores.push(nuevaConsulta);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(anteriores));
    } catch {
      // Ignorar fallos de cuota de storage
    }

    return {
      success: true,
      mensaje: '¡Consulta recibida con éxito! La organización de Feria Imperio se pondrá en contacto a la brevedad.',
      idReferencia: nuevaConsulta.id,
    };
  }
}
