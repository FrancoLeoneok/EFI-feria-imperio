import assert from 'node:assert/strict';
const { chromium } = await import(process.argv[2] || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-proxy-server'] });
const page = await browser.newPage();
try {
  await page.goto(process.argv[3] || 'http://127.0.0.1:5173');
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    const { COMPRADORES_MOCK } = await import('/src/data/mockData.ts');
    useAuthStore.getState().loginDirectoComprador(COMPRADORES_MOCK[0]);
  });
  for (const width of [320, 375, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    const header = page.locator('header');
    if (width < 1024) {
      await header.getByRole('button', { name: 'Abrir menú de navegación' }).click();
    } else {
      await header.locator('button[aria-expanded]').filter({ visible: true }).click();
    }
    const cart = header.getByRole('button', { name: /^Mi carrito/ });
    await cart.waitFor({ state: 'visible' });
    assert.equal(await cart.locator('.lucide-shopping-cart').count(), 1);
    assert.equal(await header.getByRole('link', { name: 'Catálogo', exact: true }).isVisible(), true);
    assert.equal(await header.getByText('Ver Mi Lista de Compras', { exact: false }).count(), 0);
    assert.equal(await header.locator('img[alt="Logo Feria Imperio"]').getAttribute('src'), '/logo.png');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
    await cart.click();
    await page.getByRole('heading', { name: 'Mi carrito', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    console.log(`PASS ${width}px: cart label/icon, catalog, brand, overflow and cart opening`);
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    useAuthStore.setState({ currentComprador: { ...useAuthStore.getState().currentComprador, nombre: 'Compradora con un nombre muy largo para verificar el menú mobile' } });
    document.documentElement.classList.add('dark');
  });
  await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
  assert.ok(await page.evaluate(() => document.querySelector('#mobile-navigation').scrollWidth <= innerWidth));
  await page.screenshot({ path: 'state/responsive-mobile.png', fullPage: false });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-navigation').count(), 0);
  await page.evaluate(async () => {
    const { useAuthStore } = await import('/src/store/useAuthStore.ts');
    useAuthStore.getState().logout();
  });
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Guest overflow at ${width}`);
    if (width < 1024) await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
    const header = page.locator('header');
    assert.ok(await header.getByRole('button', { name: 'Iniciar sesión', exact: true }).isVisible());
    assert.ok(await header.getByRole('link', { name: 'Postular mi emprendimiento', exact: true }).isVisible());
    await page.keyboard.press('Escape');
  }
  console.log('PASS: long name, dark mode, Escape and guest navigation');
} finally { await browser.close(); }

