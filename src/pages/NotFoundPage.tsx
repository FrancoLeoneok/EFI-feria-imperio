import { ArrowLeft, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-20">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-terracotta-200 bg-terracotta-50 text-terracotta-700 dark:border-terracotta-800 dark:bg-terracotta-900/30 dark:text-terracotta-300">
      <Store className="h-8 w-8" aria-hidden="true" />
    </div>
    <p className="mb-4 text-7xl font-extrabold tracking-tight text-terracotta dark:text-terracotta-300 sm:text-8xl">
      404
    </p>
    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-charcoal-900 dark:text-white sm:text-4xl">
      Página no encontrada
    </h1>
    <p className="mb-8 max-w-md text-sm leading-relaxed text-charcoal-600 dark:text-sand-300 sm:text-base">
      Parece que este camino no lleva a la feria. La página que buscás no existe o cambió de dirección.
    </p>
    <Link
      to="/"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-terracotta-600 px-6 py-3 font-bold text-white transition-colors hover:bg-terracotta-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-sand dark:focus-visible:ring-offset-charcoal"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Volver al inicio
    </Link>
  </main>
);
