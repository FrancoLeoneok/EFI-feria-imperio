import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5181';
const output = 'state/product-detail';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  await page.goto(baseURL);
  const product = await page.evaluate(async () => {
    const { PRODUCTOS_MOCK } = await import('/src/data/mockData.ts');
    const { productoRepository } = await import('/src/repositories/index.ts');
    const original = PRODUCTOS_MOCK.find((item) => item.enStock);
    const item = { ...original, imagenes: [original.imagenUrl, '/logo.png'] };
    await productoRepository.update(item);
    return item;
  });
  await page.goto(`${baseURL}/tienda/${product.ferianteId}`);
  await page.getByRole('button', { name: `Ver detalles de ${product.titulo}`, exact: true }).click();
  await page.waitForURL(`**/producto/${product.id}`);
  const detail = page.getByRole('main');
  await detail.getByRole('heading', { name: product.titulo, exact: true }).waitFor();
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.equal(await page.title(), `${product.titulo} | Feria Imperio`);
  await page.getByRole('button', { name: 'Foto siguiente', exact: true }).click();
  await page.getByAltText(`${product.titulo}, foto 2`, { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Foto anterior', exact: true }).click();
  await page.getByAltText(`${product.titulo}, foto 1`, { exact: true }).waitFor();
  await page.getByRole('button', { name: `Ver foto 2 de ${product.titulo}`, exact: true }).click();
  assert.equal(await page.getByRole('button', { name: `Ver foto 2 de ${product.titulo}`, exact: true }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'Foto anterior', exact: true }).click();
  await page.getByRole('navigation', { name: 'Ruta del producto' }).getByRole('link', { name: 'Catálogo', exact: true }).click();
  await page.waitForURL(`**/tienda/${product.ferianteId}`);
  await page.getByRole('button', { name: `Ver detalles de ${product.titulo}`, exact: true }).click();
  await detail.getByRole('heading', { name: product.titulo, exact: true }).waitFor();
  await page.screenshot({ path: `${output}/desktop.png`, fullPage: true });
  await page.getByRole('button', { name: 'Agregar al carrito', exact: true }).click();
  await page.getByRole('button', { name: 'Cerrar carrito', exact: true }).click();
  assert.equal(await page.evaluate(async () => (await import('/src/store/useCartStore.ts')).useCartStore.getState().items[0].producto.id), product.id);
  await page.goBack();
  await page.waitForURL(`**/tienda/${product.ferianteId}`);
  await page.goForward();
  await detail.getByRole('heading', { name: product.titulo, exact: true }).waitFor();
  await page.reload();
  await detail.getByRole('heading', { name: product.titulo, exact: true }).waitFor();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${output}/mobile.png`, fullPage: true });
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.screenshot({ path: `${output}/mobile-dark.png`, fullPage: true });
  await page.getByRole('button', { name: 'Iniciá sesión para preguntar', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  assert.ok(page.url().endsWith(`/producto/${product.id}`));
  await page.evaluate(async (id) => {
    (await import('/src/store/useAuthStore.ts')).useAuthStore.getState().closeLoginModal();
    (await import('/src/store/useStockStore.ts')).useStockStore.getState().setDisponibilidad(id, false);
  }, product.id);
  assert.equal(await detail.getByRole('button', { name: 'Sin stock', exact: true }).isDisabled(), true);
  await page.goto(`${baseURL}/producto/no-existe`);
  await detail.getByRole('heading', { name: 'Producto no encontrado', exact: true }).waitFor();
  await page.getByRole('link', { name: 'Volver al catálogo', exact: true }).click();
  await page.waitForURL(`${baseURL}/#catalogo`);
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
  });
  await page.getByRole('button', { name: `Ver detalles de ${product.titulo}`, exact: true }).click();
  await page.waitForURL(`**/producto/${product.id}`);
  await detail.getByRole('heading', { name: product.titulo, exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS: store and catalog navigation, direct URL, reload, back/forward, gallery, cart, login, stock, missing product, responsive widths and dark mode.');
} finally {
  await browser.close();
}
