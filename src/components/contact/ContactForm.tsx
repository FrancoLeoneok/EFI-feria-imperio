import { useState } from 'react';
import { Send, Loader2, Sparkles, Instagram, Facebook } from 'lucide-react';
import { ConsultaContacto } from '../../types';
import { contactoRepository } from '../../repositories';

interface ContactFormProps {
  onSuccessToast: (title: string, message: string) => void;
  onErrorToast: (title: string, message: string) => void;
}

export const ContactForm = ({ onSuccessToast, onErrorToast }: ContactFormProps) => {
  const [formData, setFormData] = useState<ConsultaContacto>({
    nombreCompleto: '',
    nombreEmprendimiento: '',
    email: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    rubro: 'artesanias',
    mensaje: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await contactoRepository.enviarConsulta(formData);
      if (response.success) {
        onSuccessToast('¡Solicitud Enviada!', response.mensaje);
        setFormData({
          nombreCompleto: '',
          nombreEmprendimiento: '',
          email: '',
          whatsapp: '',
          instagram: '',
          facebook: '',
          rubro: 'artesanias',
          mensaje: '',
        });
      } else {
        onErrorToast('Error en el formulario', response.mensaje);
      }
    } catch {
      onErrorToast('Error', 'No se pudo enviar el formulario. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-16 sm:py-24 border-t border-sand-300 dark:border-charcoal-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-charcoal-700 rounded-3xl p-6 sm:p-12 border border-sand-300 dark:border-charcoal-600 shadow-xl">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convocatoria Abierta</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 dark:text-white">
              ¿Sos Feriante de Río Cuarto?
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 mt-2">
              Sumá tu puesto al catálogo digital unificado o envianos tu consulta sobre las próximas ediciones de la feria.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  required
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Ej: Marcelo Gómez"
                  className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
                />
              </div>

              {/* Nombre del Emprendimiento */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                  Nombre de tu Emprendimiento / Puesto *
                </label>
                <input
                  type="text"
                  name="nombreEmprendimiento"
                  required
                  value={formData.nombreEmprendimiento}
                  onChange={handleChange}
                  placeholder="Ej: Cerámica del Chocancharava"
                  className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
                />
              </div>

              {/* Teléfono / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                  WhatsApp (para coordinar) *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Ej: 358 1234567"
                  className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                  <Instagram className="w-3.5 h-3.5 text-terracotta" />
                  <span>Instagram *</span>
                </label>
                <input
                  type="url"
                  name="instagram"
                  required
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://www.instagram.com/tu_cuenta/"
                  className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                  <Facebook className="w-3.5 h-3.5 text-terracotta" />
                  <span>Facebook *</span>
                </label>
                <input
                  type="url"
                  name="facebook"
                  required
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://www.facebook.com/tu_cuenta/"
                  className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Rubro Selector */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                Rubro Principal de Producción *
              </label>
              <select
                name="rubro"
                value={formData.rubro}
                onChange={handleChange}
                className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all"
              >
                <option value="artesanias">Artesanías Generales</option>
                <option value="ceramica">Cerámica y Alfarería</option>
                <option value="gastronomia">Gastronomía y Conservas</option>
                <option value="marroquineria">Marroquinería y Cuero</option>
                <option value="madera">Madera y Tornería</option>
                <option value="indumentaria">Indumentaria y Textil</option>
              </select>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 dark:text-sand-200 mb-1.5">
                Mensaje o Descripción de tus creaciones
              </label>
              <textarea
                name="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Contanos qué productos elaborás, si ya participás en Parque Sarmiento o Paseo del Andino, o cualquier consulta..."
                className="w-full bg-sand-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-sand-500 px-4 py-3 rounded-2xl text-sm border border-sand-300 dark:border-charcoal-600 focus:border-terracotta focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando postulación...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta / Postulación</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
