import { FormEvent, useId, useRef, useState } from 'react';

export function QuestionForm({ label, button, maxLength, onSubmit }: {
  label: string; button: string; maxLength: number; onSubmit: (text: string) => Promise<void>;
}) {
  const id = useId();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const submitting = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || !text.trim()) return;
    submitting.current = true;
    setBusy(true);
    setMessage('');
    try {
      await onSubmit(text);
      setText('');
      setMessage('Se publicó correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos guardar. Intentá nuevamente.');
    } finally { submitting.current = false; setBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-3">
    <label htmlFor={id} className="block text-sm font-bold">{label}</label>
    <textarea id={id} value={text} onChange={(event) => setText(event.target.value)} required maxLength={maxLength} disabled={busy} rows={3}
      aria-describedby={`${id}-help ${id}-status`}
      className="block w-full resize-y rounded-xl border border-sand-300 bg-white p-3 text-sm text-charcoal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest dark:border-charcoal-600 dark:bg-charcoal-900 dark:text-sand-100" />
    <p id={`${id}-help`} className="text-xs text-charcoal-500 dark:text-sand-400">El texto será público. No incluyas datos de contacto. {text.length}/{maxLength}</p>
    <button type="submit" disabled={busy || !text.trim()} className="min-h-11 rounded-xl bg-forest px-4 py-2 text-sm font-bold text-white hover:bg-forest-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-50">{busy ? 'Publicando…' : button}</button>
    <p id={`${id}-status`} role="status" className="text-sm">{message}</p>
  </form>;
}
