import { useState } from 'react';
import { MessageCircle, Instagram, MapPin, ExternalLink } from 'lucide-react';
import { PrivacyModal } from '../common/PrivacyModal';
import { GuidesModal, GuideTab } from '../common/GuidesModal';

export const Footer = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
  const [guidesTab, setGuidesTab] = useState<GuideTab>('usuario');

  const handleOpenGuides = (tab: GuideTab) => {
    setGuidesTab(tab);
    setIsGuidesModalOpen(true);
  };

  return (
    <footer className="bg-sand-200/80 dark:bg-charcoal-900 border-t border-sand-300 dark:border-charcoal-700 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white shadow-md border border-sand-300 dark:border-charcoal-700 p-0.5 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Feria Imperio"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-xl text-terracotta tracking-tight">
                Feria Imperio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 max-w-sm leading-relaxed">
              Catálogo digital unificado para los artesanos y emprendedores de Río Cuarto. Conectando la economía social del Paseo del Andino y Parque Sarmiento con la comunidad los 365 días del año.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/feriaimperiook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
                aria-label="Instagram de Feria Imperio"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5493584112233"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-whatsapp flex items-center justify-center shadow-xs transition-colors"
                aria-label="WhatsApp Institucional"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600 dark:text-sand-300">
              <li>
                <a href="#inicio" className="hover:text-terracotta transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-terracotta transition-colors">
                  Catálogo Digital
                </a>
              </li>
              <li>
                <a href="#ferias" className="hover:text-terracotta transition-colors">
                  Paseos de Ferias
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-terracotta transition-colors">
                  Postular mi Puesto
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:text-terracotta transition-colors text-left"
                >
                  Políticas de Privacidad
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Guías */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Guías
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600 dark:text-sand-300">
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenGuides('usuario')}
                  className="hover:text-terracotta transition-colors text-left"
                >
                  Guía de Usuario
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenGuides('feriante')}
                  className="hover:text-terracotta transition-colors text-left"
                >
                  Guía de Feriante
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Espacios Feriales */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Polos Feriales
            </h4>
            <ul className="space-y-3 text-xs text-charcoal-600 dark:text-sand-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                <span>
                  <strong>Paseo del Andino:</strong> Bv. Ameghino & Rieles (Sáb, Dom y Feriados 16 a 22 hs)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                <span>
                  <strong>Parque Sarmiento:</strong> Banda Norte (Sáb y Dom 15:30 a 21:30 hs)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sand-300 dark:border-charcoal-700 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-charcoal-500 dark:text-sand-400">
          <p>Copyright © -2026- Vertex Solutions S.A.S.</p>

          {/* Quiénes somos - Enlace a Vertex Tech */}
          <div className="flex items-center gap-2">
            <span className="text-charcoal-600 dark:text-sand-300 font-medium">Quiénes somos</span>
            <a
              href="https://www.vertextech.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 border border-sand-300 dark:border-charcoal-600 hover:border-terracotta dark:hover:border-terracotta text-charcoal-800 dark:text-sand-200 hover:text-terracotta shadow-xs hover:shadow transition-all group"
              aria-label="Ir al sitio de Vertex Tech (abre en nueva pestaña)"
              title="Ir a Vertex Tech"
            >
              <img
                src="/vertex-logo.png"
                alt="Logo Vertex Tech"
                className="h-4 w-auto object-contain transition-transform group-hover:scale-110"
              />
              <span className="font-semibold text-xs text-charcoal-900 dark:text-white group-hover:text-terracotta transition-colors">
                Vertex
              </span>
              <ExternalLink className="w-3 h-3 text-charcoal-400 dark:text-sand-400 group-hover:text-terracotta" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta dark:hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta dark:hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta dark:hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de Políticas de Privacidad */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Modal de Guías (Usuario y Feriante) */}
      <GuidesModal
        isOpen={isGuidesModalOpen}
        initialTab={guidesTab}
        onClose={() => setIsGuidesModalOpen(false)}
      />
    </footer>
  );
};
