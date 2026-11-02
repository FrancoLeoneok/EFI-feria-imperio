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

try {
  await page.goto(baseURL);
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
  assert.equal(await page.getByRole('button', { name: 'Cargar/editar CVU o alias' }).count(), 0);

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
  await buyer.getByText('feria.imperio', { exact: true }).waitFor();
  const confirmedURL = buyer.url();

  await sales.getByRole('article').waitFor();
  await sales.getByText(products.first.titulo, { exact: true }).waitFor();
  assert.equal(await sales.getByText(products.second.titulo, { exact: true }).count(), 0);
  const payment = buyer.getByRole('region', { name: 'Transferencia a Feria Imperio', exact: true });
  await payment.locator('input[type=file]').setInputFiles('public/favicon.png');
  await payment.getByAltText('Comprobante 1', { exact: true }).waitFor();
  await payment.getByRole('button', { name: 'Guardar comprobantes' }).click();
  await sales.getByRole('button', { name: /^Ver comprobante 1/ }).waitFor();
  await sales.getByRole('button', { name: /^Ver comprobante 1/ }).click();
  await page.getByRole('dialog', { name: 'Comprobante de transferencia' }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });

  await page.screenshot({ path: join(output, 'sales-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).color === 'rgb(255, 255, 255)');
  assert.equal(await sales.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  await page.screenshot({ path: join(output, 'sales-mobile-dark.png'), fullPage: true, animations: 'disabled' });

  await loginSeller(page, 1);
  await page.goto(`${baseURL}/admin`);
  const secondSales = page.getByRole('region', { name: 'Ventas', exact: true });
  await secondSales.getByText(products.second.titulo, { exact: true }).waitFor();
  assert.equal(await secondSales.getByText(products.first.titulo, { exact: true }).count(), 0);
  assert.equal(await secondSales.getByRole('button', { name: /^Ver comprobante/ }).count(), 1);
  await page.reload();
  await secondSales.getByText(products.second.titulo, { exact: true }).waitFor();
  assert.equal(new URL(confirmedURL).searchParams.has('pedido'), true);
  assert.deepEqual(errors, []);
  console.log(`PASS: no seller banking form, restricted access, centralized checkout, live sales/shared receipt across tabs, per-store product isolation, receipt dialog/keyboard, mobile/dark. Screenshots: ${output}`);
} finally { await browser.close(); }
