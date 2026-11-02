// Usage: node scripts/capture-guides.mjs [Playwright module URL] [local app URL]
// Disposable demo session; never publishes products or makes real payments.
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const output = new URL('../public/guides/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-proxy-server'] });
const context = await browser.newContext({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const session = await context.newCDPSession(page);
await session.send('Network.clearBrowserCache');
await session.send('Storage.clearDataForOrigin', { origin: new URL(baseURL).origin, storageTypes: 'all' });
await context.clearCookies();
await session.send('Network.setCacheDisabled', { cacheDisabled: true });
console.log('Cache, cookies and origin storage cleared before loading localhost.');

async function capture(name, notes) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(450);
  await page.locator('img').evaluateAll(async (images) => {
    await Promise.all(images.filter((img) => img.getBoundingClientRect().bottom > 0 && img.getBoundingClientRect().top < innerHeight).map((img) => img.decode().catch(() => {})));
  });
  const annotations = [];
  for (const [target, text, x, y] of notes) {
    await target.waitFor({ state: 'visible' });
    const box = await target.boundingBox();
    if (!box || box.y < 0 || box.y + box.height > 750 || box.x < 0 || box.x + box.width > 1200) throw new Error(`Target outside screenshot: ${name}: ${text}`);
    annotations.push({ box, text, x, y });
  }
  await page.evaluate((notes) => {
    const ns = 'http://www.w3.org/2000/svg';
    const overlay = document.createElementNS(ns, 'svg');
    overlay.id = 'guide-capture-annotation';
    overlay.setAttribute('viewBox', '0 0 1200 750');
    overlay.style.cssText = 'position:fixed;inset:0;width:1200px;height:750px;z-index:2147483647;pointer-events:none';
    const color = '#9c3e1c';
    overlay.innerHTML = `<defs><marker id="guide-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="${color}"/></marker></defs>`;
    for (const { box, text, x, y } of notes) {
      const width = Math.min(440, Math.max(250, text.length * 9.6 + 32));
      const centerX = box.x + box.width / 2;
      const below = y > box.y + box.height;
      const endY = below ? box.y + box.height + 9 : box.y - 9;
      const startX = Math.max(x + 18, Math.min(x + width - 18, centerX));
      const startY = below ? y : y + 52;
      const group = document.createElementNS(ns, 'g');
      group.innerHTML = `<rect x="${box.x - 4}" y="${box.y - 4}" width="${box.width + 8}" height="${box.height + 8}" rx="9" fill="none" stroke="white" stroke-width="7"/><rect x="${box.x - 4}" y="${box.y - 4}" width="${box.width + 8}" height="${box.height + 8}" rx="9" fill="none" stroke="${color}" stroke-width="3"/><path d="M${startX},${startY} L${centerX},${endY}" stroke="white" stroke-width="7"/><path d="M${startX},${startY} L${centerX},${endY}" stroke="${color}" stroke-width="3" marker-end="url(#guide-arrow)"/><rect x="${x}" y="${y}" width="${width}" height="52" rx="12" fill="${color}" stroke="white" stroke-width="2"/>`;
      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', x + 16); label.setAttribute('y', y + 32);
      label.setAttribute('fill', 'white'); label.setAttribute('font-family', 'Arial, sans-serif');
      label.setAttribute('font-size', '18'); label.setAttribute('font-weight', '700');
      label.textContent = text;
      group.append(label); overlay.append(group);
    }
    // Keep annotations visible over native dialogs in the browser top layer.
    (document.querySelector('dialog[open]') ?? document.body).append(overlay);
  }, annotations);
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, output)), animations: 'disabled' });
  await page.locator('#guide-capture-annotation').evaluate((element) => element.remove());
  console.log(`Captured ${name}`);
}

try {
  await page.goto(baseURL);
  await page.getByRole('link', { name: 'Ver Tienda & Catálogo' }).first().waitFor();
  await page.locator('#tiendas').evaluate((element) => window.scrollTo(0, element.offsetTop - 95));
  await capture('cliente-explorar', [
    [page.getByRole('combobox', { name: 'Filtrar por paseo' }), '1. Elegí el paseo de la feria', 720, 110],
    [page.getByRole('link', { name: 'Ver Tienda & Catálogo' }).first(), '2. Entrá a ver sus productos', 40, 650],
  ]);
  await page.goto(`${baseURL}/tienda/fer-01`);
  const add = page.getByRole('button', { name: /Agregar .* al carrito/ }).first();
  await add.locator('xpath=ancestor::article').evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 100));
  await capture('cliente-producto', [[add, 'Sumá el producto al carrito', 650, 170]]);
  await add.click();
  await capture('cliente-lista', [
    [page.getByRole('button', { name: 'Aumentar cantidad' }).locator('..'), '1. Ajustá las cantidades', 330, 260],
    [page.getByRole('link', { name: /^Comprar/ }), '2. Revisá el total y comprá', 330, 490],
  ]);
  await page.getByRole('button', { name: 'Cerrar carrito' }).click();
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.locator('#login-comprador-nombre').fill('Cliente Prueba');
  await page.locator('#login-comprador-password').fill('comprador123');
  await page.locator('#login-comprador-password').press('Enter');
  await page.getByRole('button', { name: /Cliente Prueba/ }).waitFor();
  await page.goto(`${baseURL}/checkout`);
  const finalize = page.getByRole('button', { name: 'Finalizar compra', exact: true });
  await finalize.waitFor();
  await capture('cliente-confirmar', [[finalize, 'Confirmá el pedido con tu cuenta', 620, 110]]);
  await finalize.click();
  const payment = page.getByRole('region', { name: 'Transferencia a Feria Imperio' });
  await payment.waitFor();
  await payment.evaluate((element) => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 95));
  await capture('cliente-pago', [
    [payment.locator('dl'), '1. Consultá la cuenta de la feria', 30, 170],
    [payment.getByRole('button', { name: 'Guardar comprobantes' }), '2. Adjuntá y guardá el comprobante', 30, 470],
  ]);
  await page.getByRole('button', { name: /Cliente Prueba/ }).click();
  await page.getByRole('button', { name: 'Cerrar Sesión', exact: true }).click();
  await page.goto(`${baseURL}/admin`);
  await page.getByRole('button', { name: 'Iniciar Sesión como Feriante' }).click();
  await page.locator('#login-usuario-feriante').fill('El Gaucho Tradición');
  await page.locator('#login-password-feriante').fill('feria123');
  await page.locator('#login-password-feriante').press('Enter');
  await page.getByRole('heading', { name: /Mi Taller •/ }).waitFor();
  await page.getByText('Sesión Iniciada', { exact: true }).waitFor({ state: 'hidden' });
  await capture('feriante-taller', [[page.getByRole('link', { name: 'Ver Mi Tienda' }), 'Abrí tu tienda y compartí el enlace', 680, 270]]);
  const stock = page.getByTitle('Clic para alternar disponibilidad').first();
  await stock.scrollIntoViewIfNeeded();
  await capture('feriante-stock', [[stock, 'Tocá para cambiar la disponibilidad', 650, 630]]);
  await page.getByTitle('Editar precio rápido').first().click();
  await capture('feriante-precio', [[page.getByTitle('Guardar precio').locator('..'), 'Ingresá tu precio base y guardá', 270, 630]]);
  await page.getByTitle('Cancelar', { exact: true }).click();
  const create = page.getByRole('button', { name: 'Agregar Nuevo Producto' });
  await create.scrollIntoViewIfNeeded();
  await capture('feriante-producto', [[create, 'Empezá a cargar un producto', 660, 630]]);
  await create.click();
  const form = page.getByRole('dialog', { name: /Publicar en/ });
  await form.waitFor();
  await capture('feriante-formulario', [
    [form.locator('#product-title'), '1. Escribí un nombre claro', 40, 180],
    [form.locator('#product-price-help'), '2. Revisá precio base y comisión', 855, 460],
  ]);
  const publish = form.getByRole('button', { name: 'Publicar en mi tienda', exact: true });
  // Populate the preview without submitting or modifying the saved catalog.
  await form.locator('#product-title').fill('Mate Imperial Cincelado en Alpaca');
  await form.locator('#product-price').fill('15000');
  await form.locator('#product-description').fill('Mate artesanal con virola cincelada en alpaca y cuero tradicional.');
  await form.locator('input[type=file]').setInputFiles(fileURLToPath(new URL('../public/products/mate-imperial-alpaca.png', import.meta.url)));
  await form.getByAltText('Foto 1 del producto', { exact: true }).waitFor();
  await publish.scrollIntoViewIfNeeded();
  await capture('feriante-publicar', [[publish, 'Revisá la vista previa y publicá', 30, 470]]);
} finally {
  await browser.close();
}
