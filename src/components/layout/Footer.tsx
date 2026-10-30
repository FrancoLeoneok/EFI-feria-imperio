import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { PrivacyModal } from '../common/PrivacyModal';
import { GuidesModal } from '../common/GuidesModal';
import { GuideTab } from '../../data/guides';
import { useAuthStore } from '../../store/useAuthStore';

export const Footer = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [openGuide, setOpenGuide] = useState<GuideTab | null>(null);
  const isFerianteView = useAuthStore(
    (state) =>
      state.isAuthenticated &&
      state.userRole === 'feriante' &&
      state.currentFeriante !== null,
  );
  const availableGuide: GuideTab = isFerianteView ? 'feriante' : 'usuario';

  return (
    <footer className="bg-sand-200/80 dark:bg-charcoal-900 border-t border-sand-300 dark:border-charcoal-700 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-xl text-terracotta tracking-tight">
                Feria Imperio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 dark:text-sand-300 max-w-sm leading-relaxed">
              Catálogo digital unificado para los artesanos y emprendedores de
              Río Cuarto. Conectando la economía social del Paseo del Andino y
              Parque Sarmiento con la comunidad los 365 días del año.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Feria-Imperio/61594981670684/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta dark:hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
                aria-label="Facebook de Feria Imperio"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/feriaimperiook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta dark:hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
                aria-label="Instagram de Feria Imperio"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCJZIqkTsPtEZb9kZ7VBsL8w"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-charcoal-700 text-charcoal-600 dark:text-sand-200 hover:text-terracotta dark:hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"
                aria-label="YouTube de Feria Imperio"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
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
                <a
                  href="#inicio"
                  className="hover:text-terracotta transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#catalogo"
                  className="hover:text-terracotta transition-colors"
                >
                  Catálogo Digital
                </a>
              </li>
              <li>
                <a
                  href="#ferias"
                  className="hover:text-terracotta transition-colors"
                >
                  Paseos de Ferias
                </a>
              </li>
              <li>
                <a
                  href="/#contacto"
                  className="hover:text-terracotta transition-colors"
                >
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
                  onClick={() => setOpenGuide(availableGuide)}
                  className="hover:text-terracotta transition-colors text-left"
                >
                  {isFerianteView ? 'Guía de feriante' : 'Guía de cliente'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Ferias */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Ferias
            </h4>
            <ul className="space-y-3 text-xs text-charcoal-600 dark:text-sand-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                <span>
                  <strong>Paseo del Andino:</strong> Bv. Ameghino & Rieles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                <span>
                  <strong>Parque Sarmiento:</strong> Banda Norte
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sand-300 dark:border-charcoal-700 flex justify-center text-center">
          <a
            href="https://www.vertextech.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs text-charcoal-500 dark:text-sand-400 hover:text-terracotta dark:hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            aria-label="Copyright © -2026- Vertex Solutions S.A.S. (abre en nueva pestaña)"
          >
            Copyright © -2026- Vertex Solutions S.A.S.
          </a>
        </div>
      </div>

      {/* Modal de Políticas de Privacidad */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Modal de Guías (Usuario y Feriante) */}
      {openGuide === availableGuide && (
        <GuidesModal
          key={availableGuide}
          guide={availableGuide}
          onClose={() => setOpenGuide(null)}
        />
      )}
    </footer>
  );
};
