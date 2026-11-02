import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-proxy-server'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto(baseURL);
  const calculations = await page.evaluate(async () => {
    const { customerPrice } = await import('/src/utils/pricing.ts');
    const { groupItems } = await import('/src/repositories/localOrders.ts');
    const { PRODUCTOS_MOCK, FERIANTES_MOCK } = await import('/src/data/mockData.ts');
    return {
      prices: [15000, 100.01, 999.99, 100.05].map(customerPrice),
      groups: groupItems(FERIANTES_MOCK.map((store, i) => ({ producto: { ...PRODUCTOS_MOCK[0], id: `test-${i}`, precio: 15000, ferianteId: store.id }, cantidad: 2 })), FERIANTES_MOCK),
    };
  });
  assert.deepEqual(calculations.prices, [16500, 110.01, 1099.99, 110.06]);
  assert.ok(calculations.groups.length > 1);
  assert.ok(calculations.groups.every((group) => group.subtotal === 33000 && group.items[0].producto.precioBase === 15000));
  console.log('PASS: fixed 10% for every store, decimal rounding, quantities and base snapshots');

  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { FERIANTES_MOCK } = await import('/src/data/mockData.ts');
    // Obsolete, even corrupt, bank settings must no longer affect the catalog.
    localStorage.setItem('feria-imperio-payment-fer-01', '{invalid-json');
    useAuthStore.getState().loginDirecto(FERIANTES_MOCK[0]);
  });
  await page.goto(`${baseURL}/admin`);
  const edit = page.getByRole('button', { name: /^Editar producto / }).first();
  await edit.waitFor();
  assert.equal(await page.getByRole('button', { name: 'Cargar/editar CVU o alias' }).count(), 0);
  await edit.click();
  const form = page.getByRole('dialog', { name: 'Editar producto', exact: true });
  await form.getByLabel('Tu precio base ($ ARS)').fill('15000');
  await form.locator('#product-price-help').getByText('$ 16.500 ARS', { exact: true }).waitFor();
  await form.locator('#product-price-help').getByText('$ 1.500 ARS', { exact: true }).waitFor();
  await form.locator('article').getByText('$ 16.500 ARS', { exact: true }).waitFor();
  await page.setViewportSize({ width: 375, height: 844 });
  assert.ok(await form.evaluate((element) => element.scrollWidth <= element.clientWidth));
  await page.screenshot({ path: join(tmpdir(), 'feria-price-form-mobile.png') });
  await form.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  await form.waitFor({ state: 'hidden' });
  await page.reload();
  await edit.click();
  assert.equal(await form.getByLabel('Tu precio base ($ ARS)').inputValue(), '15000');
  await form.locator('article').getByText('$ 16.500 ARS', { exact: true }).waitFor();
  await form.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  await form.waitFor({ state: 'hidden' });
  await page.setViewportSize({ width: 1280, height: 900 });
  const row = page.getByRole('row').filter({ has: page.getByRole('button', { name: /^Editar producto / }) }).first();
  await row.getByRole('button', { name: 'Editar precio rápido' }).click();
  await row.getByLabel('Tu precio base en pesos').fill('20000');
  await row.getByText('Cliente: $ 22.000 ARS (+10%)', { exact: true }).waitFor();
  await row.getByRole('button', { name: 'Guardar precio' }).click();
  console.log('PASS: no seller bank fields; edit, preview, reload and quick edit apply commission once');

  const seeded = await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { useCartStore } = await import('/src/store/useCartStore.ts');
    const { productoRepository } = await import('/src/repositories/index.ts');
    const { COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    const products = await productoRepository.getAll();
    const first = products.find((product) => product.enStock);
    const second = products.find((product) => product.enStock && product.ferianteId !== first.ferianteId);
    await productoRepository.update({ ...first, precio: 15000 });
    await productoRepository.update({ ...second, precio: 100.05 });
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem({ ...first, precio: 15000 });
    useCartStore.getState().updateQuantity(first.id, 2);
    useCartStore.getState().addItem({ ...second, precio: 100.05 });
    return { first, second, total: useCartStore.getState().getTotalPrice() };
  });
  assert.equal(seeded.total, 33110.06);
  await page.getByText('$ 33.110,06 ARS', { exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.goto(`${baseURL}/tienda/${seeded.first.ferianteId}`);
  const card = page.locator('article').filter({ has: page.getByRole('heading', { name: seeded.first.titulo, exact: true }) });
  await card.getByText('$ 16.500 ARS', { exact: true }).waitFor();
  await card.getByRole('button', { name: /^Ver detalles de/ }).click();
  await page.getByRole('main').getByText('$ 16.500 ARS', { exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.goto(`${baseURL}/checkout`);
  await page.locator('aside').getByText('$ 33.110,06 ARS', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Finalizar compra', exact: true }).click();
  await page.getByRole('heading', { name: 'Compra realizada', exact: true }).waitFor();
  const payment = page.getByRole('region', { name: 'Transferencia a Feria Imperio', exact: true });
  assert.equal(await page.getByRole('region', { name: /^Transferencia a/ }).count(), 1);
  await payment.getByText('feria.imperio', { exact: true }).waitFor();
  await payment.getByText('$ 33.110,06 ARS', { exact: true }).waitFor();
  await payment.locator('input[type=file]').setInputFiles('public/favicon.png');
  await payment.getByAltText('Comprobante 1', { exact: true }).waitFor();
  await payment.getByRole('button', { name: 'Guardar comprobantes' }).click();
  await payment.getByRole('status').filter({ hasText: 'Comprobantes guardados' }).waitFor();
  const orderURL = page.url();
  await page.reload();
  await payment.getByAltText('Comprobante 1', { exact: true }).waitFor();
  await page.setViewportSize({ width: 375, height: 844 });
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await page.screenshot({ path: join(tmpdir(), 'feria-platform-payment-mobile.png'), fullPage: true, animations: 'disabled' });
  const snapshot = await page.evaluate(async () => {
    const { readOrder, readStoreSales } = await import('/src/repositories/localOrders.ts');
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const order = await readOrder(new URL(location.href).searchParams.get('pedido'), useAuthStore.getState().currentComprador.id);
    return { order, sales: await Promise.all(order.grupos.map(({ tienda }) => readStoreSales(tienda.id))) };
  });
  assert.equal(snapshot.order.total, 33110.06);
  assert.equal(snapshot.order.comprobantes.length, 1);
  assert.ok(snapshot.sales.every((sales) => sales[0].grupo.comprobantes.length === 1));
  const legacy = await page.evaluate(async () => {
    const { createOrder, readOrder } = await import('/src/repositories/localOrders.ts');
    const { PRODUCTOS_MOCK, COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    const product = { ...PRODUCTOS_MOCK[0], ferianteId: 'legacy-shop' };
    const order = await createOrder({ id: 'legacy-before-commission', fecha: new Date().toISOString(), comprador: COMPRADORES_MOCK[0], estadoPago: 'pendiente', total: product.precio, grupos: [{ tienda: { id: product.ferianteId, nombreComercio: product.ferianteNombre }, items: [{ producto: product, cantidad: 1 }], subtotal: product.precio, comprobantes: ['legacy-receipt'] }] });
    return { before: order.total, after: await readOrder(order.id, order.comprador.id) };
  });
  assert.equal(legacy.after.total, legacy.before);
  assert.equal(legacy.after.grupos[0].items[0].producto.precioBase, undefined);
  assert.deepEqual(legacy.after.grupos[0].comprobantes, ['legacy-receipt']);
  for (const group of snapshot.order.grupos) {
    for (const { producto } of group.items) assert.ok(producto.precioBase !== undefined);
    await page.evaluate(async (id) => {
      const { useAuthStore } = await import('/src/store/useAuthStore.ts');
      const { FERIANTES_MOCK } = await import('/src/data/mockData.ts');
      useAuthStore.getState().loginDirecto(FERIANTES_MOCK.find((store) => store.id === id));
    }, group.tienda.id);
    await page.goto(`${baseURL}/admin`);
    const sales = page.getByRole('region', { name: 'Ventas', exact: true });
    await sales.getByRole('button', { name: /^Ver comprobante 1/ }).waitFor();
    await sales.getByText('Tu importe base', { exact: true }).waitFor();
    await sales.getByText('Comisión de Feria Imperio (10%)', { exact: true }).waitFor();
    assert.ok(await sales.getByRole('article').count() >= 1);
    await page.setViewportSize({ width: 375, height: 844 });
    assert.ok(await sales.evaluate((element) => element.scrollWidth <= element.clientWidth));
  }
  await page.screenshot({ path: join(tmpdir(), 'feria-sales-mobile.png') });
  assert.ok(orderURL.includes('pedido='));
  assert.deepEqual(errors, []);
  console.log('PASS: public price, cart quantities, checkout, single transfer, shared receipt, persistence and seller breakdown/mobile');
} finally { await browser.close(); }
