import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { guides, GuideTab } from '../../data/guides';

interface GuidesModalProps {
  guide: GuideTab;
  onClose: () => void;
}

export const GuidesModal = ({ guide, onClose }: GuidesModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const content = guides[guide];
  const step = content.steps[stepIndex];
  const image = `/guides/${step.image}.png`;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  const goToStep = (index: number) => {
    setStepIndex(Math.max(0, Math.min(content.steps.length - 1, index)));
    setImageFailed(false);
    contentRef.current?.scrollTo({ top: 0 });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="guides-modal-title"
      aria-describedby="guides-modal-introduction"
      className="m-auto w-[calc(100%-2rem)] max-w-4xl max-h-[90dvh] overflow-hidden rounded-3xl border border-sand-300 bg-white p-0 text-charcoal-900 shadow-2xl backdrop:bg-charcoal-900/70 dark:border-charcoal-700 dark:bg-charcoal-800 dark:text-sand-100"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), a[href]',
            ),
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          goToStep(stepIndex + (event.key === 'ArrowRight' ? 1 : -1));
        }
      }}
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-sand-300 px-5 py-4 dark:border-charcoal-700 sm:px-7 sm:py-5">
          <div>
            <h2
              id="guides-modal-title"
              className="text-xl font-extrabold sm:text-2xl"
            >
              {content.title}
            </h2>
            <p
              id="guides-modal-introduction"
              className="mt-2 max-w-prose text-sm leading-relaxed text-charcoal-600 dark:text-sand-300"
            >
              {content.introduction}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover:bg-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:hover:bg-charcoal-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div
          ref={contentRef}
          className="min-h-0 overflow-y-auto px-5 py-5 sm:px-7"
          role="region"
          aria-roledescription="carrusel"
          aria-label={content.title}
        >
          <div aria-live="polite" aria-atomic="true">
            <p className="text-sm font-semibold text-forest dark:text-forest-300">
              Paso {stepIndex + 1} de {content.steps.length}
            </p>
            <h3 className="mt-2 text-lg font-bold sm:text-xl">{step.title}</h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-charcoal-600 dark:text-sand-300">
              {step.description}
            </p>
          </div>
          <figure className="mt-5">
            {imageFailed ? (
              <div
                role="status"
                className="rounded-2xl border border-sand-300 p-6 text-sm dark:border-charcoal-600"
              >
                No pudimos cargar la captura. Podés seguir las instrucciones de
                este paso.
              </div>
            ) : (
              <a
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ampliar captura (abre en una pestaña nueva)"
                className="block overflow-hidden rounded-2xl border border-sand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:border-charcoal-600"
              >
                <img
                  key={image}
                  src={image}
                  alt={step.alt}
                  width={1200}
                  height={750}
                  onError={() => setImageFailed(true)}
                  className="h-auto w-full object-contain sm:max-h-[40dvh]"
                />
              </a>
            )}
            <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-charcoal-500 dark:text-sand-400">
              <span>Los cuadros y las flechas señalan dónde actuar.</span>
              {!imageFailed && (
                <a
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-semibold text-terracotta-700 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta dark:text-terracotta-300"
                >
                  <Expand className="h-4 w-4" aria-hidden="true" />
                  Ampliar captura
                  <span className="sr-only"> (abre en una pestaña nueva)</span>
                </a>
              )}
            </figcaption>
          </figure>
        </div>

        <nav
          aria-label="Pasos de la guía"
          className="grid shrink-0 grid-cols-2 items-center gap-2 border-t border-sand-300 bg-sand-100 px-4 py-3 dark:border-charcoal-700 dark:bg-charcoal-900 sm:grid-cols-[1fr_auto_1fr] sm:px-7"
        >
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => goToStep(stepIndex - 1)}
            className="order-2 inline-flex min-h-11 items-center justify-self-start gap-1 rounded-xl px-3 text-sm font-bold hover:bg-sand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-charcoal-700 sm:order-1"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>
          <div
            className="order-1 col-span-2 flex justify-self-center sm:order-2 sm:col-span-1"
            aria-label="Elegir un paso"
          >
            {content.steps.map((item, index) => (
              <button
                key={item.image}
                type="button"
                onClick={() => goToStep(index)}
                aria-label={`Paso ${index + 1}: ${item.title}`}
                aria-current={stepIndex === index ? 'step' : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
              >
                <span
                  className={`h-2.5 rounded-full ${stepIndex === index ? 'w-5 bg-terracotta' : 'w-2.5 bg-sand-400 dark:bg-charcoal-400'}`}
                />
              </button>
            ))}
          </div>
          {stepIndex === content.steps.length - 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="order-3 min-h-11 justify-self-end rounded-xl bg-terracotta-700 px-4 text-sm font-bold text-white hover:bg-terracotta-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Finalizar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToStep(stepIndex + 1)}
              className="order-3 inline-flex min-h-11 items-center justify-self-end gap-1 rounded-xl bg-terracotta-700 px-3 text-sm font-bold text-white hover:bg-terracotta-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </nav>
      </div>
    </dialog>
  );
};
