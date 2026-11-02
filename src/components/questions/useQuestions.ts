import { useCallback, useEffect, useState } from 'react';
import { listQuestions, PreguntaProducto, QUESTIONS_CHANGED } from '../../repositories/questions';

export function useQuestions() {
  const [questions, setQuestions] = useState<PreguntaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    let generation = 0;
    const refresh = async () => {
      const request = ++generation;
      try {
        const result = await listQuestions();
        if (active && request === generation) { setQuestions(result); setError(''); }
      } catch {
        if (active && request === generation) setError('No pudimos cargar las preguntas.');
      } finally {
        if (active && request === generation) setLoading(false);
      }
    };
    const channel = new BroadcastChannel(QUESTIONS_CHANGED);
    channel.onmessage = () => { void refresh(); };
    window.addEventListener(QUESTIONS_CHANGED, refresh);
    void refresh();
    return () => { active = false; channel.close(); window.removeEventListener(QUESTIONS_CHANGED, refresh); };
  }, [revision]);
  return { questions, loading, error, retry };
}
