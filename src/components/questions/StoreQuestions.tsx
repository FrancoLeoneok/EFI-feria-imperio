import { useState } from 'react';
import { answerQuestion } from '../../repositories/questions';
import { useQuestions } from './useQuestions';
import { QuestionEntry } from './QuestionEntry';
import { QuestionForm } from './QuestionForm';

export function StoreQuestions({ ferianteId }: { ferianteId: string }) {
  const { questions, loading, error, retry } = useQuestions();
  const [answered, setAnswered] = useState(false);
  const own = questions.filter((question) => question.ferianteId === ferianteId);
  const pending = own.filter((question) => question.respuesta === null).length;
  const items = own.filter((question) => (question.respuesta !== null) === answered);
  return <section aria-label="Preguntas" className="my-8 space-y-5 rounded-2xl border border-sand-200 bg-white p-4 text-charcoal-800 sm:p-6 dark:border-charcoal-700 dark:bg-charcoal-800 dark:text-sand-100">
    <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-extrabold">Preguntas</h2>
      {pending > 0 && <span role="status" className="rounded-full bg-forest px-3 py-1 text-xs font-bold text-white">{pending} {pending === 1 ? 'pregunta pendiente' : 'preguntas pendientes'}</span>}
    </div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar preguntas">
      {[false, true].map((value) => <button key={String(value)} type="button" aria-pressed={answered === value} onClick={() => setAnswered(value)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest ${answered === value ? 'border-forest bg-forest text-white' : 'border-sand-300 dark:border-charcoal-600'}`}>{value ? 'Respondidas' : 'Pendientes'}</button>)}
    </div>
    {loading && <p role="status">Cargando preguntas…</p>}
    {error ? <div role="alert"><p>{error}</p><button type="button" onClick={retry} className="min-h-11 underline">Reintentar</button></div>
      : !loading && items.length === 0 ? <p className="text-sm">{answered ? 'Todavía no respondiste preguntas.' : 'No tenés preguntas pendientes.'}</p>
      : <ul className="space-y-4">{items.map((question) => <li key={question.id} className="space-y-4 rounded-xl border border-sand-200 p-4 dark:border-charcoal-600">
        <h3 className="break-words font-bold">{question.productoTitulo}</h3>
        <QuestionEntry question={question} />
        {question.respuesta === null && <QuestionForm label={`Respuesta para ${question.nombreComprador}`} button="Publicar respuesta" maxLength={2000} onSubmit={(text) => answerQuestion(question.id, text)} />}
      </li>)}</ul>}
  </section>;
}
