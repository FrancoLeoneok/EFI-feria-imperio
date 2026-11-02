import { useAuthStore } from '../../store/useAuthStore';
import { askQuestion } from '../../repositories/questions';
import { useQuestions } from './useQuestions';
import { QuestionForm } from './QuestionForm';
import { QuestionEntry } from './QuestionEntry';

export function ProductQuestions({ productoId, onLogin }: { productoId: string; onLogin: () => void }) {
  const { questions, loading, error, retry } = useQuestions();
  const { isAuthenticated, userRole } = useAuthStore();
  const items = questions.filter((question) => question.productoId === productoId);
  return <section aria-label="Preguntas y respuestas" className="space-y-5 border-t border-sand-200 pt-6 text-charcoal-800 dark:border-charcoal-600 dark:text-sand-100">
    <h3 className="text-lg font-extrabold">Preguntas y respuestas</h3>
    {isAuthenticated && userRole === 'comprador' ? <QuestionForm key={productoId} label="¿Qué querés saber sobre este producto?" button="Enviar pregunta" maxLength={1000} onSubmit={(text) => askQuestion(productoId, text)} />
      : !isAuthenticated ? <button type="button" onClick={onLogin} className="min-h-11 rounded-xl border border-forest px-4 text-sm font-bold text-forest dark:border-forest-300 dark:text-forest-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest">Iniciá sesión para preguntar</button>
      : <p className="text-sm">Para hacer una pregunta, ingresá con tu cuenta de comprador. Respondé las consultas de tu tienda desde el panel de feriante.</p>}
    {loading && <p role="status">Cargando preguntas…</p>}
    {error ? <div role="alert"><p>{error}</p><button type="button" onClick={retry} className="min-h-11 underline">Reintentar</button></div>
      : !loading && items.length === 0 ? <p className="text-sm text-charcoal-500 dark:text-sand-400">Todavía no hay preguntas. ¡Hacé la primera!</p>
      : <ul className="space-y-5">{items.map((question) => <li key={question.id}><QuestionEntry question={question} /></li>)}</ul>}
  </section>;
}
