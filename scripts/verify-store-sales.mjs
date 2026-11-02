import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// node scripts/verify-store-sales.mjs [Playwright module URL] [app URL]
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5180';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
context.on('page', (tab) => tab.on('pageerror', (error) => errors.push(error.message)));
page.on('pageerror', (error) => errors.push(error.message));
const output = join(tmpdir(), 'feria-sales-qa');
await mkdir(output, { recursive: true });

async function loginSeller(tab, index) {
  await tab.evaluate(async (index) => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { FERIANTES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirecto(FERIANTES_MOCK[index]);
  }, index);
}

async function editPayment(alias, cvu = '1234567890123456789012') {
  await page.getByRole('button', { name: 'Cargar/editar CVU o alias' }).click();
  const form = page.getByRole('form', { name: 'Editar datos de transferencia' });
  await form.getByLabel('CVU', { exact: true }).fill(cvu);
  await form.getByLabel('Alias', { exact: true }).fill(alias);
  await form.getByRole('button', { name: 'Guardar datos de transferencia' }).click();
  return form;
}

try {
  await page.goto(baseURL);
  const aliases = await page.evaluate(async () => {
    const { ferianteRepository } = await import('/src/repositories/index.ts');
    return (await ferianteRepository.getAll()).map((store) => ({ alias: store.alias, demo: store.aliasDemostracion }));
  });
  assert.equal(new Set(aliases.map((store) => store.alias)).size, aliases.length);
  assert.equal(aliases.every((store) => store.demo && /^[a-z0-9.]{6,20}$/.test(store.alias)), true);
  assert.equal(aliases[0].alias, 'el.gaucho.tradicion');

  // Buyer must never see a default seller panel.
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
  });
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('heading', { name: 'Acceso a Mi Taller' }).waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Ventas', exact: true }).count(), 0);

  await loginSeller(page, 0);
  await page.goto(`${baseURL}/admin`);
  const sales = page.getByRole('region', { name: 'Ventas', exact: true });
  await sales.getByText('Todavía no tenés ventas').waitFor();
  await page.getByText('el.gaucho.tradicion', { exact: true }).waitFor();
  let form = await editPayment('gaucho.real', '123');
  await form.getByRole('alert').filter({ hasText: /exactamente 22/ }).waitFor();
  await form.getByLabel('CVU', { exact: true }).fill('1234567890123456789012');
  await form.getByLabel('Alias', { exact: true }).fill('bad?');
  await form.getByRole('button', { name: 'Guardar datos de transferencia' }).click();
  await form.getByRole('alert').filter({ hasText: /entre 6 y 20/ }).waitFor();
  await form.getByLabel('Alias', { exact: true }).fill('gaucho.real');
  // A failed write keeps the draft and never announces success.
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.restorePaymentStorage = () => { Storage.prototype.setItem = original; };
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith('feria-imperio-payment-')) throw new DOMException('Full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await form.getByRole('button', { name: 'Guardar datos de transferencia' }).click();
  await form.getByRole('alert').filter({ hasText: /No pudimos guardar/ }).waitFor();
  assert.equal(await form.getByLabel('Alias', { exact: true }).inputValue(), 'gaucho.real');
  await page.evaluate(() => { window.restorePaymentStorage(); delete window.restorePaymentStorage; });
  await form.getByRole('button', { name: 'Guardar datos de transferencia' }).click();
  await page.getByRole('status').filter({ hasText: /Datos de transferencia guardados/ }).waitFor();
  await page.reload();
  await page.getByText('gaucho.real', { exact: true }).waitFor();

  const buyer = await context.newPage();
  await buyer.goto(baseURL);
  const products = await buyer.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { useCartStore } = await import('/src/store/useCartStore.ts');
    const { COMPRADORES_MOCK, PRODUCTOS_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
    useCartStore.getState().clearCart();
    const first = PRODUCTOS_MOCK.find((product) => product.ferianteId === 'fer-01' && product.enStock);
    const second = PRODUCTOS_MOCK.find((product) => product.ferianteId === 'fer-02' && product.enStock);
    useCartStore.getState().addItem(first);
    useCartStore.getState().addItem(second);
    useCartStore.getState().closeCart();
    return { first, second };
  });
  await buyer.goto(`${baseURL}/checkout`);
  await buyer.getByRole('button', { name: 'Finalizar compra', exact: true }).click();
  await buyer.getByRole('heading', { name: 'Compra realizada', exact: true }).waitFor();
  await buyer.getByText('gaucho.real', { exact: true }).waitFor();
  const confirmedURL = buyer.url();

  await sales.getByRole('article').waitFor();
  await sales.getByText(products.first.titulo, { exact: true }).waitFor();
  assert.equal(await sales.getByText(products.second.titulo, { exact: true }).count(), 0);
  const payment = buyer.getByRole('region', { name: 'Transferencia a El Gaucho Tradición', exact: true });
  await payment.locator('input[type=file]').setInputFiles('public/favicon.png');
  await payment.getByAltText('Comprobante 1', { exact: true }).waitFor();
  await payment.getByRole('button', { name: 'Guardar comprobantes' }).click();
  await sales.getByRole('button', { name: /^Ver comprobante 1/ }).waitFor();
  await sales.getByRole('button', { name: /^Ver comprobante 1/ }).click();
  await page.getByRole('dialog', { name: 'Comprobante de transferencia' }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });

  // A banking edit changes only future checkout snapshots.
  await editPayment('gaucho.nuevo');
  await page.getByText('gaucho.nuevo', { exact: true }).waitFor();
  await buyer.reload();
  await buyer.getByText('gaucho.real', { exact: true }).waitFor();
  const newAlias = await buyer.evaluate(async () => {
    const { ferianteRepository } = await import('/src/repositories/index.ts');
    return (await ferianteRepository.getById('fer-01')).alias;
  });
  assert.equal(newAlias, 'gaucho.nuevo');

  await page.screenshot({ path: join(output, 'sales-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).color === 'rgb(255, 255, 255)');
  assert.equal(await sales.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  await page.screenshot({ path: join(output, 'sales-mobile-dark.png'), fullPage: true });

  await loginSeller(page, 1);
  await page.goto(`${baseURL}/admin`);
  const secondSales = page.getByRole('region', { name: 'Ventas', exact: true });
  await secondSales.getByText(products.second.titulo, { exact: true }).waitFor();
  assert.equal(await secondSales.getByText(products.first.titulo, { exact: true }).count(), 0);
  assert.equal(await secondSales.getByRole('button', { name: /^Ver comprobante/ }).count(), 0);
  await page.getByText('barro.vivo.ceramicas', { exact: true }).waitFor();
  await page.reload();
  await secondSales.getByText(products.second.titulo, { exact: true }).waitFor();
  assert.equal(new URL(confirmedURL).searchParams.has('pedido'), true);
  assert.deepEqual(errors, []);
  console.log(`PASS: aliases for all shops, restricted access, bank validation/edit/reload, actual checkout, live sales/receipts across tabs, per-store isolation, receipt dialog/keyboard, historical banking snapshot, mobile/dark. Screenshots: ${output}`);
} finally { await browser.close(); }
