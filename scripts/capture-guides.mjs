// Usage: node scripts/capture-guides.mjs [Playwright module URL] [local app URL]
// Only uses the app's demo session; never publishes or changes saved products.
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.argv[2] || 'playwright');
const baseURL = process.argv[3] || 'http://127.0.0.1:5173';
const output = new URL('../public/guides/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 750 },
  deviceScaleFactor: 1,
});

async function capture(name, target, label, position = { x: 40, y: 650 }) {
  await target.waitFor({ state: 'visible' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const box = await target.boundingBox();
  if (!box || box.y < 0 || box.y + box.height > 750)
    throw new Error(`Target outside screenshot: ${name}`);
  await page.evaluate(
    ({ box, label, position }) => {
      const overlay = document.createElement('div');
      overlay.id = 'guide-capture-annotation';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:99999;pointer-events:none';
      const color = '#9c3e1c';
      const endX = box.x + box.width / 2;
      const endY =
        position.y > box.y + box.height ? box.y + box.height + 7 : box.y - 7;
      overlay.innerHTML = `<svg width="1200" height="750" style="position:absolute;inset:0"><defs><marker id="guide-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="${color}"/></marker></defs><rect x="${box.x - 5}" y="${box.y - 5}" width="${box.width + 10}" height="${box.height + 10}" rx="10" fill="none" stroke="white" stroke-width="7"/><rect x="${box.x - 5}" y="${box.y - 5}" width="${box.width + 10}" height="${box.height + 10}" rx="10" fill="none" stroke="${color}" stroke-width="3"/><path d="M${position.x + 145},${position.y + (position.y > box.y ? 0 : 44)} L${endX},${endY}" stroke="white" stroke-width="7"/><path d="M${position.x + 145},${position.y + (position.y > box.y ? 0 : 44)} L${endX},${endY}" stroke="${color}" stroke-width="3" marker-end="url(#guide-arrow)"/></svg>`;
      const caption = document.createElement('div');
      caption.textContent = label;
      caption.style.cssText = `position:absolute;left:${position.x}px;top:${position.y}px;padding:12px 18px;max-width:370px;border:2px solid white;border-radius:12px;background:${color};color:white;font:700 18px/1.3 sans-serif;box-shadow:0 4px 12px #0003`;
      overlay.append(caption);
      document.body.append(overlay);
    },
    { box, label, position },
  );
  await page.screenshot({
    path: new URL(`${name}.png`, output).pathname.replace(/^\/(\w:)/, '$1'),
  });
  await page
    .locator('#guide-capture-annotation')
    .evaluate((element) => element.remove());
  console.log(`Captured ${name}`);
}

try {
  await page.goto(baseURL);
  await page
    .getByRole('link', { name: 'Ver Tienda & Catálogo' })
    .first()
    .waitFor();
  await page
    .locator('#tiendas')
    .evaluate((element) => window.scrollTo(0, element.offsetTop - 95));
  await capture(
    'cliente-explorar',
    page.getByRole('checkbox', { name: 'Finde Confirmado' }).locator('..'),
    'Filtrá los puestos por su presencia en la feria',
    { x: 760, y: 650 },
  );
  await page.goto(`${baseURL}/tienda/fer-01`);
  const add = page.getByRole('button', { name: /Sumar .* a mi lista/ }).first();
  await add
    .locator('xpath=ancestor::article')
    .evaluate((element) =>
      window.scrollTo(
        0,
        window.scrollY + element.getBoundingClientRect().top - 100,
      ),
    );
  await capture('cliente-producto', add, 'Sumá este producto a tu lista', {
    x: 640,
    y: 150,
  });
  await add.click();
  // Adding an item opens the list in the current implementation.
  if (
    !(await page
      .getByRole('button', { name: 'Cerrar panel de lista' })
      .isVisible())
  ) {
    await page
      .getByRole('button', { name: /Mi Lista|lista de feria/i })
      .first()
      .click();
  }
  await capture(
    'cliente-lista',
    page.getByRole('button', { name: 'Aumentar cantidad' }).locator('..'),
    'Ajustá las cantidades y revisá el total',
    { x: 450, y: 370 },
  );
  await page.getByRole('button', { name: 'Cerrar panel de lista' }).click();

  await page.goto(`${baseURL}/admin`);
  await page
    .getByRole('button', { name: 'Iniciar Sesión como Feriante' })
    .click();
  await page.locator('#login-usuario-feriante').fill('El Gaucho Tradición');
  await page.locator('#login-password-feriante').fill('feria123');
  await page
    .getByRole('button', { name: 'Iniciar Sesión en Mi Taller' })
    .click();
  await page.getByRole('heading', { name: /Mi Taller •/ }).waitFor();
  await page.waitForTimeout(4800);
  await capture(
    'feriante-taller',
    page.getByRole('link', { name: 'Ver Mi Tienda' }),
    'Abrí tu tienda pública y compartí su enlace',
    { x: 710, y: 245 },
  );
  const stock = page.getByTitle('Clic para alternar disponibilidad').first();
  await stock.scrollIntoViewIfNeeded();
  await capture(
    'feriante-stock',
    stock,
    'Alterná entre En Stock y Bajo Pedido',
    { x: 670, y: 650 },
  );
  await page.getByTitle('Editar precio rápido').first().click();
  await capture(
    'feriante-precio',
    page.getByTitle('Guardar precio').locator('..'),
    'Ingresá el precio y tocá el ícono de guardar',
    { x: 320, y: 650 },
  );
  await page.getByTitle('Cancelar', { exact: true }).click();
  const create = page.getByRole('button', { name: 'Agregar Nuevo Producto' });
  await create.scrollIntoViewIfNeeded();
  await capture(
    'feriante-producto',
    create,
    'Cargá el nombre, precio, descripción e imagen',
    { x: 630, y: 650 },
  );
} finally {
  await browser.close();
}
