import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Usage: node scripts/verify-product-upload.mjs [Playwright module URL] [app URL]
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const output = join(tmpdir(), 'feria-product-qa');
await mkdir(output, { recursive: true });

try {
  await page.goto(baseURL);
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { FERIANTES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirecto(FERIANTES_MOCK[0]);
  });
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('button', { name: 'Agregar Nuevo Producto' }).click();
  const dialog = page.getByRole('dialog', { name: /Publicar en/ });
  await dialog.waitFor();
  await dialog.getByLabel('Título del producto').fill('Mate de prueba con galería');
  await dialog.getByLabel('Descripción artesanal').fill('Producto artesanal de prueba con dos fotos.');
  await dialog.getByLabel('Precio ($ ARS)').fill('2500');
  await dialog.getByRole('button', { name: 'Publicar en mi tienda', exact: true }).click();
  await dialog.getByText('Agregá al menos una foto del producto.').waitFor();
  const input = dialog.locator('input[type=file]');
  await input.setInputFiles({ name: 'archivo.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
  await dialog.getByRole('alert').filter({ hasText: 'elegí una imagen' }).waitFor();
  await input.setInputFiles(['public/logo.png', 'public/favicon.png']);
  await dialog.getByText('2 de 6 fotos.', { exact: false }).waitFor();
  assert.equal(await dialog.locator('article h3').innerText(), 'Mate de prueba con galería');
  assert.equal(await dialog.locator('article button').isDisabled(), true);
  await dialog.getByRole('button', { name: 'Quitar foto 2' }).click();
  // Exercise actual drag-and-drop with an image file in a DataTransfer.
  const bytes = Array.from(await readFile('public/favicon.png'));
  const transfer = await page.evaluateHandle((data) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array(data)], 'segunda.png', { type: 'image/png' }));
    return transfer;
  }, bytes);
  await dialog.getByRole('button', { name: /Fotos del producto Arrastrá/ }).dispatchEvent('drop', { dataTransfer: transfer });
  await dialog.getByText('2 de 6 fotos.', { exact: false }).waitFor();
  await dialog.screenshot({ path: join(output, 'form-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth), true);
  await dialog.screenshot({ path: join(output, 'form-mobile.png') });
  await dialog.getByRole('button', { name: 'Publicar en mi tienda', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.getByRole('row').filter({ hasText: 'Mate de prueba con galería' }).waitFor();
  const store = await context.newPage();
  await store.goto(`${baseURL}/tienda/fer-01`);
  await store.getByRole('heading', { name: 'Mate de prueba con galería', exact: true }).click();
  await store.getByRole('button', { name: /Ver foto 2 de Mate de prueba/ }).click();
  assert.equal(await store.getByAltText('Mate de prueba con galería, foto 2').count(), 1);
  await store.reload();
  await store.getByRole('heading', { name: 'Mate de prueba con galería', exact: true }).waitFor();
  await page.reload();
  const row = page.getByRole('row').filter({ hasText: 'Mate de prueba con galería' });
  await row.getByRole('switch').click();
  await store.getByRole('heading', { name: 'Mate de prueba con galería', exact: true }).waitFor({ state: 'hidden' });
  await row.getByRole('switch').click();
  await store.getByRole('heading', { name: 'Mate de prueba con galería', exact: true }).waitFor();
  page.on('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: 'Eliminar producto' }).click();
  await row.waitFor({ state: 'hidden' });
  await page.reload();
  await page.getByText('Cargando catálogo del puesto...').waitFor({ state: 'hidden' });
  assert.equal(await page.getByRole('row').filter({ hasText: 'Mate de prueba con galería' }).count(), 0);
  assert.deepEqual(errors, []);
  console.log(`PASS: validation, multiple upload, removal, drag/drop, live preview, mobile layout, publication, gallery, reload, stock sync and deletion. Screenshots: ${output}`);
} finally {
  await browser.close();
}
