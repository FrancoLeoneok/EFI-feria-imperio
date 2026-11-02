import { PreguntaProducto } from '../../repositories/questions';

export function QuestionEntry({ question }: { question: PreguntaProducto }) {
  return <div className="space-y-2 break-words text-sm">
    <p className="text-xs text-charcoal-500 dark:text-sand-400">{question.nombreComprador} · <time dateTime={question.creadaEn}>{new Date(question.creadaEn).toLocaleDateString('es-AR')}</time></p>
    <p className="whitespace-pre-wrap">{question.pregunta}</p>
    {question.respuesta !== null ? <div className="border-l-2 border-forest pl-3">
      <p className="font-bold text-forest dark:text-forest-300">Respuesta de la tienda</p>
      <p className="whitespace-pre-wrap">{question.respuesta}</p>
    </div> : <p className="text-xs text-charcoal-500 dark:text-sand-400">Sin responder todavía</p>}
  </div>;
}
