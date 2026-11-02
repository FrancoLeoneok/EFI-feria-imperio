import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// node scripts/verify-checkout.mjs [Playwright module URL] [app URL]
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
context.on('page', (tab) => tab.on('pageerror', (error) => errors.push(error.message)));
page.on('pageerror', (error) => errors.push(error.message));
const output = join(tmpdir(), 'feria-checkout-qa');
await mkdir(output, { recursive: true });

async function seed(tab) {
  return tab.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { useCartStore } = await import('/src/store/useCartStore.ts');
    const { customerPrice } = await import('/src/utils/pricing.ts');
    const { PRODUCTOS_MOCK, COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
    useCartStore.getState().clearCart();
    const first = PRODUCTOS_MOCK.find((product) => product.enStock);
    const second = PRODUCTOS_MOCK.find((product) => product.enStock && product.ferianteId !== first.ferianteId);
    useCartStore.getState().addItem(first);
    useCartStore.getState().addItem(second);
    return { buyer: COMPRADORES_MOCK[0], total: customerPrice(first.precio) + customerPrice(second.precio), revision: useCartStore.getState().revision };
  });
}

try {
  await page.goto(`${baseURL}/checkout`);
  await page.getByRole('button', { name: 'Ingresar como cliente' }).waitFor();
  const seeded = await seed(page);
  const [checkout] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: /^Comprar/ }).click(),
  ]);
  await checkout.waitForLoadState();
  await checkout.getByRole('button', { name: 'Finalizar compra', exact: true }).waitFor();
  assert.equal(await checkout.getByRole('region', { name: /^Productos de/ }).count(), 2);
  await checkout.screenshot({ path: join(output, 'checkout-desktop.png'), fullPage: true, animations: 'disabled' });
  await checkout.setViewportSize({ width: 390, height: 844 });
  await checkout.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await checkout.waitForFunction(() => getComputedStyle(document.querySelector('#root > div')).backgroundColor === 'rgb(24, 24, 27)');
  await checkout.waitForFunction(() => getComputedStyle(document.querySelector('h1')).color === 'rgb(251, 250, 248)');
  assert.equal(await checkout.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await checkout.screenshot({ path: join(output, 'checkout-mobile-dark.png'), fullPage: true, animations: 'disabled' });
  await checkout.getByRole('button', { name: 'Finalizar compra', exact: true }).click();
  await checkout.getByRole('heading', { name: 'Compra realizada', exact: true }).waitFor();
  const confirmedURL = checkout.url();
  await page.waitForFunction(async () => {
    const { useCartStore } = await import('/src/store/useCartStore.ts');
    return useCartStore.getState().items.length === 0;
  });
  assert.equal(await checkout.getByRole('region', { name: /^Transferencia a/ }).count(), 1);
  const payment = checkout.getByRole('region', { name: /^Transferencia a/ }).first();
  const input = payment.locator('input[type=file]');
  await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
  await payment.getByRole('alert').filter({ hasText: /elegí una imagen/ }).waitFor();
  await input.setInputFiles('public/favicon.png');
  await payment.getByAltText('Comprobante 1', { exact: true }).waitFor();
  await payment.getByRole('button', { name: 'Guardar comprobantes' }).click();
  await payment.getByRole('status').filter({ hasText: /Comprobantes guardados/ }).waitFor();
  await checkout.reload();
  await checkout.getByAltText('Comprobante 1', { exact: true }).waitFor();
  await checkout.screenshot({ path: join(output, 'confirmed-mobile.png'), fullPage: true, animations: 'disabled' });
  const stored = await checkout.evaluate(async (buyerId) => {
    const { readOrder, createOrder } = await import('/src/repositories/localOrders.ts');
    const id = new URL(location.href).searchParams.get('pedido');
    const order = await readOrder(id, buyerId);
    const duplicate = await createOrder({ ...order, total: 0 });
    const foreign = await readOrder(id, 'different-buyer');
    return { total: duplicate.total, foreign, groups: order.grupos.length };
  }, seeded.buyer.id);
  assert.equal(stored.total, seeded.total);
  assert.equal(stored.foreign, undefined);
  assert.equal(stored.groups, 2);

  // Exercise a single-store order with explicitly labelled test bank data.
  await checkout.evaluate(async (buyerId) => {
    const { readOrder, createOrder } = await import('/src/repositories/localOrders.ts');
    const id = new URL(location.href).searchParams.get('pedido');
    const order = await readOrder(id, buyerId);
    const group = structuredClone(order.grupos[0]);
    const pago = { titular: 'Feria Imperio', alias: 'alias.de.prueba', cvu: '0000000000000000000000', demostracion: true };
    await createOrder({ ...order, id: 'bank-display-test', pago, grupos: [group], total: group.subtotal });
  }, seeded.buyer.id);
  await checkout.goto(`${baseURL}/checkout?pedido=bank-display-test`);
  await checkout.getByText('alias.de.prueba', { exact: true }).waitFor();
  await checkout.getByText('0000000000000000000000', { exact: true }).waitFor();
  assert.equal(await checkout.getByRole('region', { name: /^Productos de/ }).count(), 1);

  // Storage failure must leave the cart intact and never show success.
  await seed(page);
  await checkout.goto(`${baseURL}/checkout`);
  await checkout.getByRole('button', { name: 'Finalizar compra', exact: true }).waitFor();
  await checkout.evaluate(() => { indexedDB.open = () => { throw new DOMException('Almacenamiento no disponible', 'QuotaExceededError'); }; });
  await checkout.getByRole('button', { name: 'Finalizar compra', exact: true }).click();
  await checkout.getByRole('alert').filter({ hasText: /Almacenamiento no disponible/ }).waitFor();
  assert.equal(await checkout.evaluate(async () => (await import('/src/store/useCartStore.ts')).useCartStore.getState().items.length), 2);
  await checkout.goto(confirmedURL);
  await checkout.getByRole('heading', { name: 'Compra realizada', exact: true }).waitFor();
  await page.evaluate(async () => (await import('/src/store/useAuthStore.ts')).useAuthStore.getState().logout());
  await checkout.getByRole('button', { name: 'Ingresar como cliente' }).waitFor();
  assert.equal(await checkout.getByAltText('Comprobante 1', { exact: true }).count(), 0);
  assert.deepEqual(errors, []);
  console.log(`Checkout OK: new tab, grouped totals, mobile/dark, confirmation, cart sync, receipt upload/reload, duplicates, ownership, storage failure and logout. Screenshots: ${output}`);
} finally { await browser.close(); }
