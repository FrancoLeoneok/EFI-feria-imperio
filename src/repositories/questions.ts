import { useAuthStore } from '../store/useAuthStore';
import { productoRepository } from './index';

export interface PreguntaProducto {
  id: string;
  productoId: string;
  productoTitulo: string;
  ferianteId: string;
  compradorId: string;
  nombreComprador: string;
  pregunta: string;
  creadaEn: string;
  respuesta: string | null;
  respondidaEn: string | null;
}

export const QUESTIONS_CHANGED = 'feria-questions-changed';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('feria-imperio-questions', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('questions', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('No pudimos abrir las preguntas. Intentá nuevamente.'));
  });
}

function validateText(value: string, max: number): string {
  const text = value.trim();
  if (!text || text.length > max) throw new Error(`Escribí entre 1 y ${max} caracteres.`);
  return text;
}

function announceChange() {
  window.dispatchEvent(new Event(QUESTIONS_CHANGED));
  const channel = new BroadcastChannel(QUESTIONS_CHANGED);
  channel.postMessage('changed');
  channel.close();
}

export async function listQuestions(): Promise<PreguntaProducto[]> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('questions', 'readonly');
    const request = transaction.objectStore('questions').getAll();
    transaction.oncomplete = () => {
      database.close();
      resolve((request.result as PreguntaProducto[]).sort((a, b) => b.creadaEn.localeCompare(a.creadaEn)));
    };
    transaction.onabort = () => { database.close(); reject(new Error('No pudimos cargar las preguntas.')); };
  });
}

export async function askQuestion(productoId: string, value: string): Promise<void> {
  const pregunta = validateText(value, 1000);
  const producto = await productoRepository.getById(productoId);
  if (!producto) throw new Error('El producto ya no está disponible.');
  const session = useAuthStore.getState();
  if (!session.isAuthenticated || session.userRole !== 'comprador' || !session.currentComprador) {
    throw new Error('Iniciá sesión como comprador para preguntar.');
  }
  const database = await openDatabase();
  const current = useAuthStore.getState();
  if (!current.isAuthenticated || current.userRole !== 'comprador' || current.currentComprador?.id !== session.currentComprador.id) {
    database.close();
    throw new Error('Tu sesión cambió. Volvé a intentar.');
  }
  const question: PreguntaProducto = {
    id: crypto.randomUUID(), productoId, productoTitulo: producto.titulo,
    ferianteId: producto.ferianteId, compradorId: session.currentComprador.id,
    nombreComprador: session.currentComprador.nombre, pregunta,
    creadaEn: new Date().toISOString(), respuesta: null, respondidaEn: null,
  };
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction('questions', 'readwrite');
    transaction.objectStore('questions').add(question);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onabort = () => { database.close(); reject(new Error('No pudimos guardar la pregunta. Intentá nuevamente.')); };
  });
  announceChange();
}

export async function answerQuestion(id: string, value: string): Promise<void> {
  const respuesta = validateText(value, 2000);
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    let failure = 'No pudimos guardar la respuesta. Intentá nuevamente.';
    const transaction = database.transaction('questions', 'readwrite');
    const store = transaction.objectStore('questions');
    const request = store.get(id);
    request.onsuccess = () => {
      const question = request.result as PreguntaProducto | undefined;
      const session = useAuthStore.getState();
      if (!question || !session.isAuthenticated || session.userRole !== 'feriante' || session.currentFeriante?.id !== question.ferianteId) {
        failure = 'Solo el feriante de esta tienda puede responder.';
        transaction.abort();
      } else if (question.respuesta !== null) {
        failure = 'Esta pregunta ya fue respondida.';
        transaction.abort();
      } else {
        store.put({ ...question, respuesta, respondidaEn: new Date().toISOString() });
      }
    };
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onabort = () => { database.close(); reject(new Error(failure)); };
  });
  announceChange();
}
