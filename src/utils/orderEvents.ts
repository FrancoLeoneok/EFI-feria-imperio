const eventName = 'feria-orders-changed';
const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(eventName);

channel?.addEventListener('message', () => window.dispatchEvent(new Event(eventName)));

export function notifyOrdersChanged() {
  window.dispatchEvent(new Event(eventName));
  channel?.postMessage('changed');
}

export function subscribeOrdersChanged(refresh: () => void): () => void {
  window.addEventListener(eventName, refresh);
  window.addEventListener('focus', refresh);
  return () => {
    window.removeEventListener(eventName, refresh);
    window.removeEventListener('focus', refresh);
  };
}
