import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5182';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
try {
  await page.goto(baseURL);
  // Valid PNG with trailing padding, below the uploader's 5 MB file limit.
  const image = `data:image/png;base64,${Buffer.concat([await readFile('public/favicon.png'), Buffer.alloc(3 * 1024 * 1024)]).toString('base64')}`;
  const result = await page.evaluate(async (image) => {
    const { PRODUCTOS_MOCK, COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { useCartStore } = await import('/src/store/useCartStore.ts');
    const { productoRepository } = await import('/src/repositories/index.ts');
    const mate = { ...PRODUCTOS_MOCK[0], imagenUrl: image, imagenes: [image] };
    await productoRepository.update(mate);
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
    useCartStore.getState().clearCart();
    let error = '';
    try { useCartStore.getState().addItem(mate); } catch (cause) { error = cause.name; }
    return {
      error,
      memoryItems: useCartStore.getState().items.length,
      persistedItems: JSON.parse(localStorage.getItem('feria_imperio_cart')).state.items.length,
      persistedBytes: localStorage.getItem('feria_imperio_cart').length,
    };
  }, image);
  console.log(JSON.stringify(result));
  assert.equal(result.error, '', 'Adding a product with an allowed image must not exceed cart storage');
  assert.equal(result.persistedItems, 1, 'The mate must persist before opening checkout');
  assert.ok(result.persistedBytes < 20000, 'Cart metadata must not duplicate uploaded photos');
  const popup = context.waitForEvent('page');
  await page.getByRole('link', { name: /^Comprar/ }).click();
  console.log('Comprar clicked; open pages:', context.pages().length);
  const checkout = await popup;
  await checkout.getByRole('heading', { name: 'Mate Imperial Cincelado en Alpaca', exact: true }).waitFor();
  await checkout.waitForFunction(() => {
    const image = document.querySelector('section[aria-label^="Productos de"] img');
    return image?.src.startsWith('data:') && image.complete && image.naturalWidth > 0;
  });
  await checkout.reload();
  await checkout.getByRole('heading', { name: 'Mate Imperial Cincelado en Alpaca', exact: true }).waitFor();
  await checkout.getByRole('button', { name: 'Finalizar compra', exact: true }).click();
  await checkout.getByRole('heading', { name: 'Compra realizada', exact: true }).waitFor();
  const saved = await checkout.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { readOrder } = await import('/src/repositories/localOrders.ts');
    const order = await readOrder(new URL(location.href).searchParams.get('pedido'), useAuthStore.getState().currentComprador.id);
    return order.grupos[0].items[0].producto.imagenUrl.startsWith('data:');
  });
  assert.equal(saved, true, 'The confirmed order must retain its photo in IndexedDB');
  console.log('PASS: edited mate with a 3 MB photo persists, opens in another tab, keeps its photo after reload, and can be purchased.');
} finally { await browser.close(); }
