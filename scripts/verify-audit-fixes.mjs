import assert from 'node:assert/strict';

// node scripts/verify-audit-fixes.mjs [Playwright module URL] [local app URL]
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

try {
  await page.goto(baseURL);
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
  });

  const soldOut = page.getByRole('article').filter({ hasText: 'Tabla para Asado en Algarrobo Macizo' });
  const addSoldOut = soldOut.getByRole('button', { name: /^Agregar .* al carrito$/ });
  await addSoldOut.waitFor();
  assert.equal(await addSoldOut.isDisabled(), true);
  const blockedItems = await page.evaluate(async () => {
    const { PRODUCTOS_MOCK } = await import('/src/data/mockData.ts');
    const { useCartStore } = await import('/src/store/useCartStore.ts');
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem(PRODUCTOS_MOCK.find((product) => !product.enStock));
    return useCartStore.getState().items.length;
  });
  assert.equal(blockedItems, 0);

  await page.evaluate(async () => {
    const { useStockStore } = await import('/src/store/useStockStore.ts');
    useStockStore.getState().setDisponibilidad('prd-05', true);
    useStockStore.getState().setDisponibilidad('prd-01', false);
  });
  await soldOut.getByText('Disponible', { exact: true }).waitFor();
  assert.equal(await addSoldOut.isEnabled(), true);
  const mate = page.getByRole('article').filter({ hasText: 'Mate Imperial Cincelado en Alpaca' });
  await mate.getByText('Sin stock', { exact: true }).waitFor();
  assert.equal(await mate.getByRole('button', { name: /^Agregar .* al carrito$/ }).isDisabled(), true);
  await addSoldOut.click();
  await page.getByRole('heading', { name: 'Mi carrito', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  console.log('PASS: unavailable products blocked in cards and store; live stock overrides in both directions');

  for (const width of [320, 390, 768, 1024, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    const search = page.getByRole('search', {
      name: width < 1024 ? 'Búsqueda móvil de puestos, rubros y artículos' : 'Búsqueda de puestos, rubros y artículos',
      exact: true,
    });
    const input = search.getByRole('textbox');
    await input.fill('mate');
    await search.getByRole('button', { name: 'Limpiar búsqueda', exact: true }).click();
    assert.equal(await input.inputValue(), '');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  console.log('PASS: clear-search click at 320, 390, 768, 1024 and 1366 px without overlapping controls');

  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(`${baseURL}/producto/prd-01`);
  await page.getByRole('heading', { name: 'Mate Imperial Cincelado en Alpaca', exact: true }).waitFor();
  const footer = page.locator('footer');
  assert.equal(await footer.getByRole('link', { name: 'Paseos de Ferias', exact: true }).count(), 0);
  assert.equal(await footer.getByRole('link', { name: 'Postular mi Puesto', exact: true }).count(), 0);
  await footer.getByRole('link', { name: 'Inicio', exact: true }).click();
  await page.waitForURL(`${baseURL}/#inicio`);
  await page.locator('#inicio').waitFor();
  console.log('PASS: buyer footer hides unavailable sections and Inicio returns home from product');

  for (const role of ['guest', 'seller']) {
    await page.evaluate(async (role) => {
      const { useAuthStore } = await import('/src/store/useAuthStore.ts');
      const { FERIANTES_MOCK } = await import('/src/data/mockData.ts');
      if (role === 'guest') useAuthStore.getState().logout();
      else useAuthStore.getState().loginDirecto(FERIANTES_MOCK[0]);
    }, role);
    await page.goto(`${baseURL}/producto/prd-01`);
    await footer.getByRole('link', { name: 'Paseos de Ferias', exact: true }).click();
    await page.waitForURL(`${baseURL}/#ferias`);
    await page.locator('#ferias').waitFor();
    await page.goto(`${baseURL}/tienda/fer-01`);
    await footer.getByRole('link', { name: 'Inicio', exact: true }).click();
    await page.waitForURL(`${baseURL}/#inicio`);
    await page.locator('#inicio').first().waitFor();
    await footer.getByRole('link', { name: 'Postular mi Puesto', exact: true }).click();
    await page.waitForURL(`${baseURL}/#contacto`);
    await page.locator('#contacto').waitFor();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: guest/seller footer destinations from internal pages; no uncaught JavaScript errors');
} finally {
  await browser.close();
}
